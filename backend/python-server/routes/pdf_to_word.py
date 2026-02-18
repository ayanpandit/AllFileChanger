"""PDF → Word conversion using pdf2docx."""

from flask import Blueprint, request, send_file, jsonify
from pdf2docx import Converter
import io, os, tempfile, logging, gc

bp = Blueprint('pdf_to_word', __name__)
logger = logging.getLogger(__name__)

@bp.route('/to-word', methods=['POST'])
def pdf_to_word():
    pdf_path = docx_path = None
    try:
        if 'pdf' not in request.files:
            return jsonify(error='No PDF file provided'), 400

        pdf_path = tempfile.mktemp(suffix='.pdf')
        docx_path = tempfile.mktemp(suffix='.docx')

        request.files['pdf'].save(pdf_path)

        cv = Converter(pdf_path)
        cv.convert(docx_path)
        cv.close()
        del cv  # MEMORY MANAGEMENT: free converter

        with open(docx_path, 'rb') as f:
            out = io.BytesIO(f.read())
        out.seek(0)

        return send_file(out,
                         mimetype='application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                         as_attachment=True, download_name='converted.docx')
    except Exception as e:
        logger.exception('PDF→Word failed')
        return jsonify(error='Failed to convert PDF to Word', details=str(e)), 500
    finally:
        for p in (pdf_path, docx_path):
            if p and os.path.exists(p):
                os.unlink(p)
        gc.collect()
