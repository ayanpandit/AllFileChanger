"""PDF Protect – add password encryption."""

from flask import Blueprint, request, send_file, jsonify
from PyPDF2 import PdfReader, PdfWriter
import io

bp = Blueprint('pdf_protect', __name__)

@bp.route('/protect', methods=['POST'])
def protect_pdf():
    try:
        if 'pdf' not in request.files:
            return jsonify(error='No PDF file provided'), 400

        password = request.form.get('password')
        if not password:
            return jsonify(error='Password is required'), 400

        reader = PdfReader(io.BytesIO(request.files['pdf'].read()))
        writer = PdfWriter()

        for page in reader.pages:
            writer.add_page(page)

        writer.encrypt(user_password=password, owner_password=password, permissions_flag=-1)

        out = io.BytesIO()
        writer.write(out)
        out.seek(0)

        return send_file(out, mimetype='application/pdf',
                         as_attachment=True, download_name='protected.pdf')
    except Exception as e:
        return jsonify(error='Failed to protect PDF', details=str(e)), 500
