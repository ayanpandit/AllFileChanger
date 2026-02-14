"""PDF Split – extract pages / ranges from a PDF."""

from flask import Blueprint, request, send_file, jsonify
from PyPDF2 import PdfReader, PdfWriter
import io, zipfile

bp = Blueprint('pdf_split', __name__)

@bp.route('/split', methods=['POST'])
def split_pdf():
    try:
        if 'pdf' not in request.files:
            return jsonify(error='No PDF file provided'), 400

        reader = PdfReader(io.BytesIO(request.files['pdf'].read()))
        total = len(reader.pages)
        mode = request.form.get('mode') or request.form.get('type', 'all')

        if mode == 'all':
            buf = io.BytesIO()
            with zipfile.ZipFile(buf, 'w', zipfile.ZIP_DEFLATED) as zf:
                for i in range(total):
                    w = PdfWriter()
                    w.add_page(reader.pages[i])
                    pb = io.BytesIO()
                    w.write(pb)
                    zf.writestr(f'page_{i+1}.pdf', pb.getvalue())
            buf.seek(0)
            return send_file(buf, mimetype='application/zip',
                             as_attachment=True, download_name='split_pages.zip')

        elif mode == 'range':
            start = int(request.form.get('start', 1)) - 1
            end = int(request.form.get('end', total))
            w = PdfWriter()
            for i in range(start, end):
                w.add_page(reader.pages[i])
            out = io.BytesIO()
            w.write(out)
            out.seek(0)
            return send_file(out, mimetype='application/pdf',
                             as_attachment=True, download_name=f'pages_{start+1}-{end}.pdf')

        return jsonify(error='Invalid mode'), 400
    except Exception as e:
        return jsonify(error='Failed to split PDF', details=str(e)), 500
