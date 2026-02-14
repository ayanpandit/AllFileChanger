"""Format Converter – generic document conversion via LibreOffice."""

from flask import Blueprint, request, send_file, jsonify
import io, os, tempfile, subprocess, shutil, logging

bp = Blueprint('format_converter', __name__)
logger = logging.getLogger(__name__)

_MIME = {
    'pdf':  'application/pdf',
    'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'txt':  'text/plain',
}

@bp.route('/format-convert', methods=['POST'])
def convert_format():
    temp_dir = None
    try:
        if 'file' not in request.files:
            return jsonify(error='No file provided'), 400

        f = request.files['file']
        target = request.form.get('format')
        if not target:
            return jsonify(error='Target format not specified'), 400

        src_ext = f.filename.rsplit('.', 1)[-1].lower() if '.' in f.filename else ''
        temp_dir = tempfile.mkdtemp()
        in_path = os.path.join(temp_dir, f'input.{src_ext}')
        f.save(in_path)

        subprocess.run(
            ['libreoffice', '--headless', '--convert-to', target, '--outdir', temp_dir, in_path],
            capture_output=True, timeout=120, check=True
        )

        out_path = os.path.join(temp_dir, f'input.{target}')
        if not os.path.exists(out_path):
            return jsonify(error='Conversion produced no output'), 500

        with open(out_path, 'rb') as fp:
            out = io.BytesIO(fp.read())
        out.seek(0)

        return send_file(out,
                         mimetype=_MIME.get(target, 'application/octet-stream'),
                         as_attachment=True, download_name=f'converted.{target}')
    except subprocess.TimeoutExpired:
        return jsonify(error='Conversion timed out'), 504
    except Exception as e:
        logger.exception('Format conversion failed')
        return jsonify(error='Failed to convert format', details=str(e)), 500
    finally:
        if temp_dir and os.path.exists(temp_dir):
            shutil.rmtree(temp_dir, ignore_errors=True)
