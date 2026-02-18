"""PDF Unlock – decrypt a password-protected PDF."""

from flask import Blueprint, request, send_file, jsonify
from PyPDF2 import PdfReader, PdfWriter
import io, gc

bp = Blueprint('pdf_unlock', __name__)

@bp.route('/unlock', methods=['POST'])
def unlock_pdf():
    input_buf = None
    try:
        if 'pdf' not in request.files:
            return jsonify(error='No PDF file provided'), 400

        password = request.form.get('password', '')
        input_buf = io.BytesIO(request.files['pdf'].read())
        reader = PdfReader(input_buf)

        if reader.is_encrypted:
            if not password:
                return jsonify(error='PDF is encrypted. Password required'), 400
            if not reader.decrypt(password):
                return jsonify(error='Invalid password'), 401

        writer = PdfWriter()
        for page in reader.pages:
            writer.add_page(page)

        out = io.BytesIO()
        writer.write(out)

        # MEMORY MANAGEMENT: free input data
        del reader, writer
        input_buf.close()
        input_buf = None

        out.seek(0)
        return send_file(out, mimetype='application/pdf',
                         as_attachment=True, download_name='unlocked.pdf')
    except Exception as e:
        return jsonify(error='Failed to unlock PDF', details=str(e)), 500
    finally:
        if input_buf:
            try: input_buf.close()
            except: pass
        gc.collect()
