"""Text Extractor – extract text from PDF, DOCX, PPTX, TXT."""

from flask import Blueprint, request, send_file, jsonify
from PyPDF2 import PdfReader
from docx import Document
from pptx import Presentation
import io

bp = Blueprint('text_extractor', __name__)

@bp.route('/extract', methods=['POST'])
def extract_text():
    try:
        if 'file' not in request.files:
            return jsonify(error='No file provided'), 400

        f = request.files['file']
        ext = f.filename.rsplit('.', 1)[-1].lower() if '.' in f.filename else ''
        raw = f.read()
        parts = []

        if ext == 'pdf':
            for page in PdfReader(io.BytesIO(raw)).pages:
                parts.append(page.extract_text() or '')
        elif ext in ('docx', 'doc'):
            for p in Document(io.BytesIO(raw)).paragraphs:
                parts.append(p.text)
        elif ext in ('pptx', 'ppt'):
            for slide in Presentation(io.BytesIO(raw)).slides:
                for shape in slide.shapes:
                    if hasattr(shape, 'text'):
                        parts.append(shape.text)
        elif ext == 'txt':
            parts.append(raw.decode('utf-8'))
        else:
            return jsonify(error='Unsupported file type'), 400

        out = io.BytesIO('\n\n'.join(parts).encode('utf-8'))
        out.seek(0)
        return send_file(out, mimetype='text/plain',
                         as_attachment=True, download_name='extracted_text.txt')
    except Exception as e:
        return jsonify(error='Failed to extract text', details=str(e)), 500
