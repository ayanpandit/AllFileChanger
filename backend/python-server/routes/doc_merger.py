"""Document Merger – merge multiple PDFs or DOCX files."""

from flask import Blueprint, request, send_file, jsonify
from PyPDF2 import PdfMerger
from docx import Document
from docxcompose.composer import Composer
import io, gc

bp = Blueprint('doc_merger', __name__)

@bp.route('/merge', methods=['POST'])
def merge_documents():
    input_buffers = []
    merger = None
    try:
        if 'files' not in request.files:
            return jsonify(error='No files provided'), 400

        files = request.files.getlist('files')
        ftype = request.form.get('type', 'pdf')

        if len(files) < 2:
            return jsonify(error='At least 2 files required'), 400

        if ftype == 'pdf':
            merger = PdfMerger()
            for f in files:
                buf = io.BytesIO(f.read())
                input_buffers.append(buf)
                merger.append(buf)
            out = io.BytesIO()
            merger.write(out)
            merger.close()
            merger = None
            # MEMORY MANAGEMENT: close input buffers
            for buf in input_buffers:
                buf.close()
            input_buffers.clear()
            out.seek(0)
            return send_file(out, mimetype='application/pdf',
                             as_attachment=True, download_name='merged.pdf')

        elif ftype == 'docx':
            master = Document(io.BytesIO(files[0].read()))
            composer = Composer(master)
            for f in files[1:]:
                composer.append(Document(io.BytesIO(f.read())))
            out = io.BytesIO()
            composer.save(out)
            del composer, master  # MEMORY MANAGEMENT: free documents
            out.seek(0)
            return send_file(out,
                             mimetype='application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                             as_attachment=True, download_name='merged.docx')

        return jsonify(error='Unsupported file type'), 400
    except Exception as e:
        return jsonify(error='Failed to merge documents', details=str(e)), 500
    finally:
        if merger:
            try: merger.close()
            except: pass
        for buf in input_buffers:
            try: buf.close()
            except: pass
        gc.collect()
