"""PDF Merge – combine multiple PDFs into one."""

from flask import Blueprint, request, send_file, jsonify
from PyPDF2 import PdfMerger
import io, gc

bp = Blueprint('pdf_merge', __name__)

@bp.route('/merge', methods=['POST'])
def merge_pdfs():
    input_buffers = []
    merger = None
    try:
        if 'pdfs' not in request.files:
            return jsonify(error='No PDF files provided'), 400

        files = request.files.getlist('pdfs')
        if len(files) < 2:
            return jsonify(error='At least 2 PDF files required'), 400

        merger = PdfMerger()
        for f in files:
            buf = io.BytesIO(f.read())
            input_buffers.append(buf)
            merger.append(buf)

        out = io.BytesIO()
        merger.write(out)
        merger.close()
        merger = None

        # MEMORY MANAGEMENT: close input buffers immediately
        for buf in input_buffers:
            buf.close()
        input_buffers.clear()

        out.seek(0)
        return send_file(out, mimetype='application/pdf',
                         as_attachment=True, download_name='merged.pdf')
    except Exception as e:
        return jsonify(error='Failed to merge PDFs', details=str(e)), 500
    finally:
        # MEMORY MANAGEMENT: ensure cleanup on error too
        if merger:
            try: merger.close()
            except: pass
        for buf in input_buffers:
            try: buf.close()
            except: pass
        gc.collect()
