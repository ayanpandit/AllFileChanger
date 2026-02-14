"""Word Converter – convert DOCX to PDF or TXT."""

from flask import Blueprint, request, send_file, jsonify
from docx import Document
import io, os, tempfile, logging

bp = Blueprint('word_converter', __name__)
logger = logging.getLogger(__name__)

@bp.route('/word-convert', methods=['POST'])
def convert_word():
    temp_path = output_path = None
    try:
        if 'file' not in request.files:
            return jsonify(error='No file provided'), 400

        f = request.files['file']
        fmt = request.form.get('format', 'pdf')

        temp_path = tempfile.mktemp(suffix='.docx')
        f.save(temp_path)

        if fmt == 'pdf':
            from docx2pdf import convert
            output_path = temp_path.replace('.docx', '.pdf')
            convert(temp_path, output_path)
            with open(output_path, 'rb') as fp:
                out = io.BytesIO(fp.read())
            out.seek(0)
            return send_file(out, mimetype='application/pdf',
                             as_attachment=True, download_name='converted.pdf')

        elif fmt == 'txt':
            doc = Document(temp_path)
            text = '\n'.join(p.text for p in doc.paragraphs)
            out = io.BytesIO(text.encode('utf-8'))
            out.seek(0)
            return send_file(out, mimetype='text/plain',
                             as_attachment=True, download_name='converted.txt')

        return jsonify(error='Unsupported format'), 400
    except Exception as e:
        logger.exception('Word convert failed')
        return jsonify(error='Failed to convert Word document', details=str(e)), 500
    finally:
        for p in (temp_path, output_path):
            if p and os.path.exists(p):
                os.unlink(p)
