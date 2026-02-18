"""Word → PDF conversion using docx2pdf (requires LibreOffice on Linux)."""

from flask import Blueprint, request, send_file, jsonify
from docx2pdf import convert
import io, os, tempfile, logging, gc

bp = Blueprint('word_to_pdf', __name__)
logger = logging.getLogger(__name__)

@bp.route('/word-to-pdf', methods=['POST'])
def word_to_pdf():
    word_path = pdf_path = None
    try:
        if 'file' not in request.files and 'word' not in request.files:
            return jsonify(error='No Word file provided'), 400

        word_path = tempfile.mktemp(suffix='.docx')
        pdf_path = tempfile.mktemp(suffix='.pdf')

        f = request.files.get('file') or request.files.get('word')
        f.save(word_path)
        convert(word_path, pdf_path)

        with open(pdf_path, 'rb') as f:
            out = io.BytesIO(f.read())
        out.seek(0)

        return send_file(out, mimetype='application/pdf',
                         as_attachment=True, download_name='converted.pdf')
    except Exception as e:
        logger.exception('Word→PDF failed')
        return jsonify(error='Failed to convert Word to PDF', details=str(e)), 500
    finally:
        for p in (word_path, pdf_path):
            if p and os.path.exists(p):
                try: os.unlink(p)
                except: pass
        gc.collect()
