"""OCR Scanner – extract text from images via Tesseract."""

from flask import Blueprint, request, send_file, jsonify
import pytesseract
from PIL import Image
import io, gc

bp = Blueprint('ocr_scanner', __name__)

@bp.route('/scan', methods=['POST'])
def scan_image():
    img = None
    try:
        if 'image' not in request.files:
            return jsonify(error='No image provided'), 400

        lang = request.form.get('language', 'eng')
        raw = request.files['image'].read()
        img = Image.open(io.BytesIO(raw))
        del raw  # MEMORY MANAGEMENT: free raw bytes
        text = pytesseract.image_to_string(img, lang=lang)
        img.close()  # MEMORY MANAGEMENT: close PIL Image
        img = None

        out = io.BytesIO(text.encode('utf-8'))
        out.seek(0)
        return send_file(out, mimetype='text/plain',
                         as_attachment=True, download_name='ocr_result.txt')
    except Exception as e:
        return jsonify(error='Failed to perform OCR', details=str(e)), 500
    finally:
        if img:
            try: img.close()
            except: pass
        gc.collect()
