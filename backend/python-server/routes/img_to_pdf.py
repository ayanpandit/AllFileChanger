"""Image → PDF conversion with session-based download."""

from flask import Blueprint, request, send_file, jsonify, after_this_request
import img2pdf, io, os, secrets, gc, logging
from datetime import datetime, timedelta
from threading import Lock
from PIL import Image
from concurrent.futures import ThreadPoolExecutor

bp = Blueprint('img_to_pdf', __name__)
logger = logging.getLogger(__name__)

# ── Session store ───────────────────────────────────────────────────────────
_sessions = {}
_lock = Lock()
_SESSION_TTL = timedelta(minutes=10)
_MAX_IMAGES = 200
_MAX_SIZE = 20 * 1024 * 1024  # 20 MB per image
_ALLOWED_EXT = {'jpg','jpeg','png','gif','bmp','webp','tiff','tif','heic','heif','ico','svg'}

def _cleanup():
    now = datetime.now()
    with _lock:
        expired = [k for k, v in _sessions.items() if now - v['ts'] > _SESSION_TTL]
        for k in expired:
            del _sessions[k]

def _process(image_bytes, filename):
    """Convert any image to RGB JPEG bytes for img2pdf."""
    try:
        img = Image.open(io.BytesIO(image_bytes))
        if img.mode not in ('RGB', 'L'):
            if img.mode == 'RGBA':
                bg = Image.new('RGB', img.size, (255, 255, 255))
                bg.paste(img, mask=img.split()[3])
                img = bg
            else:
                img = img.convert('RGB')
        if max(img.size) > 3000:
            r = 3000 / max(img.size)
            img = img.resize((int(img.size[0]*r), int(img.size[1]*r)), Image.Resampling.BILINEAR)
        buf = io.BytesIO()
        img.save(buf, format='JPEG', quality=85)
        return buf.getvalue(), None
    except Exception as e:
        return None, str(e)

# ── Routes ──────────────────────────────────────────────────────────────────

@bp.route('/image-to-pdf', methods=['POST'])
def image_to_pdf():
    _cleanup()
    if 'images' not in request.files:
        return jsonify(error='No images uploaded'), 400

    files = request.files.getlist('images')
    if not files:
        return jsonify(error='No images provided'), 400
    if len(files) > _MAX_IMAGES:
        return jsonify(error=f'Maximum {_MAX_IMAGES} images allowed'), 400

    pairs = [(f.read(), f.filename) for f in files if f.filename]
    if not pairs:
        return jsonify(error='No valid images'), 400

    results = []
    with ThreadPoolExecutor(max_workers=min(4, os.cpu_count() or 2)) as pool:
        results = list(pool.map(lambda p: _process(*p), pairs))

    images_bytes = []
    for data, err in results:
        if err:
            return jsonify(error=f'Image processing failed: {err}'), 400
        if data:
            images_bytes.append(data)

    if not images_bytes:
        return jsonify(error='No valid images after processing'), 400

    pdf_bytes = img2pdf.convert(images_bytes)
    count = len(images_bytes)
    del images_bytes
    gc.collect()

    sid = secrets.token_urlsafe(32)
    with _lock:
        _sessions[sid] = {'pdf': pdf_bytes, 'ts': datetime.now(), 'filename': 'converted.pdf'}

    return jsonify(success=True, sessionId=sid, filename='converted.pdf',
                   size=len(pdf_bytes), imageCount=count), 200


@bp.route('/download/<session_id>', methods=['GET'])
def download_pdf(session_id):
    with _lock:
        data = _sessions.get(session_id)
    if not data:
        return jsonify(error='Session expired or invalid'), 404

    buf = io.BytesIO(data['pdf'])

    @after_this_request
    def _del(response):
        with _lock:
            _sessions.pop(session_id, None)
        return response

    return send_file(buf, mimetype='application/pdf',
                     as_attachment=True, download_name=data['filename'])
