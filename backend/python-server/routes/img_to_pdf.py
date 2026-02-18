"""Image → PDF conversion – returns the PDF directly in the response."""

from flask import Blueprint, request, send_file, jsonify
import img2pdf, io, os, gc, logging
from PIL import Image

bp = Blueprint('img_to_pdf', __name__)
logger = logging.getLogger(__name__)

# MEMORY MANAGEMENT: Reduced limits for Railway free tier
_MAX_IMAGES = 20   # reduced from 200
_MAX_SIZE = 10 * 1024 * 1024  # 10 MB per image (reduced from 20 MB)
_ALLOWED_EXT = {'jpg','jpeg','png','gif','bmp','webp','tiff','tif','heic','heif','ico','svg'}

def _process(image_bytes, filename):
    """Convert any image to RGB JPEG bytes for img2pdf."""
    img = None
    try:
        img = Image.open(io.BytesIO(image_bytes))
        if img.mode not in ('RGB', 'L'):
            if img.mode == 'RGBA':
                bg = Image.new('RGB', img.size, (255, 255, 255))
                bg.paste(img, mask=img.split()[3])
                img.close()  # MEMORY MANAGEMENT: close original
                img = bg
            else:
                new_img = img.convert('RGB')
                img.close()  # MEMORY MANAGEMENT: close original
                img = new_img
        if max(img.size) > 3000:
            r = 3000 / max(img.size)
            new_img = img.resize((int(img.size[0]*r), int(img.size[1]*r)), Image.Resampling.BILINEAR)
            img.close()
            img = new_img
        buf = io.BytesIO()
        img.save(buf, format='JPEG', quality=85)
        result = buf.getvalue()
        buf.close()
        return result, None
    except Exception as e:
        return None, str(e)
    finally:
        if img:
            try: img.close()
            except: pass

# ── Routes ──────────────────────────────────────────────────────────────────

@bp.route('/image-to-pdf', methods=['POST'])
def image_to_pdf():
    if 'images' not in request.files:
        return jsonify(error='No images uploaded'), 400

    files = request.files.getlist('images')
    if not files:
        return jsonify(error='No images provided'), 400
    if len(files) > _MAX_IMAGES:
        return jsonify(error=f'Maximum {_MAX_IMAGES} images allowed'), 400

    # MEMORY MANAGEMENT: Process images sequentially instead of using ThreadPoolExecutor
    # This uses less peak RAM since only 1 image is in memory at a time
    images_bytes = []
    try:
        for f in files:
            if not f.filename:
                continue
            raw = f.read()
            data, err = _process(raw, f.filename)
            del raw  # MEMORY MANAGEMENT: free raw bytes immediately
            if err:
                del images_bytes
                gc.collect()
                return jsonify(error=f'Image processing failed: {err}'), 400
            if data:
                images_bytes.append(data)

        if not images_bytes:
            return jsonify(error='No valid images after processing'), 400

        pdf_bytes = img2pdf.convert(images_bytes)
        count = len(images_bytes)

        # MEMORY MANAGEMENT: free all image bytes before sending
        del images_bytes
        gc.collect()

        logger.info(f'Converted {count} images to PDF ({len(pdf_bytes)} bytes)')

        buf = io.BytesIO(pdf_bytes)
        del pdf_bytes  # MEMORY MANAGEMENT: BytesIO has its own copy
        return send_file(buf, mimetype='application/pdf',
                         as_attachment=True, download_name='converted.pdf')
    except Exception as e:
        return jsonify(error='Failed to convert images to PDF', details=str(e)), 500
    finally:
        gc.collect()
