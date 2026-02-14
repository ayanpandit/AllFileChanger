"""PDF Compress – compress content streams & remove duplication."""

from flask import Blueprint, request, send_file, jsonify
from PyPDF2 import PdfReader, PdfWriter
import io

bp = Blueprint('pdf_compress', __name__)

@bp.route('/compress', methods=['POST'])
def compress_pdf():
    try:
        if 'pdf' not in request.files:
            return jsonify(error='No PDF file provided'), 400

        reader = PdfReader(io.BytesIO(request.files['pdf'].read()))
        writer = PdfWriter()

        for page in reader.pages:
            page.compress_content_streams()
            writer.add_page(page)

        if reader.metadata:
            writer.add_metadata(reader.metadata)

        out = io.BytesIO()
        writer.write(out)
        out.seek(0)

        return send_file(out, mimetype='application/pdf',
                         as_attachment=True, download_name='compressed.pdf')
    except Exception as e:
        return jsonify(error='Failed to compress PDF', details=str(e)), 500
