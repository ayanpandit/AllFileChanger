from flask import Flask, request, send_file, jsonify
from flask_cors import CORS
import io
import os
import tempfile

app = Flask(__name__)
CORS(app)

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'healthy', 'service': 'format-converter'})

@app.route('/convert', methods=['POST'])
def convert_format():
    try:
        if 'file' not in request.files:
            return jsonify({'error': 'No file provided'}), 400
        
        file = request.files['file']
        target_format = request.form.get('format')
        source_format = file.filename.split('.')[-1].lower()
        
        if not target_format:
            return jsonify({'error': 'Target format not specified'}), 400
        
        # Create temporary file
        with tempfile.NamedTemporaryFile(delete=False, suffix=f'.{source_format}') as temp:
            file.save(temp.name)
            temp_path = temp.name
        
        # Use LibreOffice for conversion
        from subprocess import run
        output_dir = os.path.dirname(temp_path)
        
        try:
            run([
                'libreoffice',
                '--headless',
                '--convert-to', target_format,
                '--outdir', output_dir,
                temp_path
            ], check=True)
            
            output_path = temp_path.replace(f'.{source_format}', f'.{target_format}')
            
            with open(output_path, 'rb') as f:
                output = io.BytesIO(f.read())
            
            os.unlink(temp_path)
            os.unlink(output_path)
            
            output.seek(0)
            
            mimetype_map = {
                'pdf': 'application/pdf',
                'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                'pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
                'txt': 'text/plain'
            }
            
            return send_file(
                output,
                mimetype=mimetype_map.get(target_format, 'application/octet-stream'),
                as_attachment=True,
                download_name=f'converted.{target_format}'
            )
        except Exception as e:
            os.unlink(temp_path)
            raise e
        
    except Exception as e:
        return jsonify({'error': 'Failed to convert format', 'details': str(e)}), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5025))
    app.run(host='0.0.0.0', port=port, debug=True)
