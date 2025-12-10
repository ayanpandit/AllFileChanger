from flask import Flask, request, send_file, jsonify
from flask_cors import CORS
from docx import Document
import io
import os
import tempfile

app = Flask(__name__)
CORS(app)

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'healthy', 'service': 'word-converter'})

@app.route('/convert', methods=['POST'])
def convert_word():
    try:
        if 'file' not in request.files:
            return jsonify({'error': 'No file provided'}), 400
        
        file = request.files['file']
        target_format = request.form.get('format', 'pdf')
        
        # Create temporary file
        with tempfile.NamedTemporaryFile(delete=False, suffix='.docx') as temp:
            file.save(temp.name)
            temp_path = temp.name
        
        if target_format == 'pdf':
            from docx2pdf import convert
            output_path = temp_path.replace('.docx', '.pdf')
            convert(temp_path, output_path)
            mimetype = 'application/pdf'
        elif target_format == 'txt':
            doc = Document(temp_path)
            text = '\n'.join([para.text for para in doc.paragraphs])
            output = io.BytesIO(text.encode('utf-8'))
            os.unlink(temp_path)
            output.seek(0)
            return send_file(output, mimetype='text/plain', as_attachment=True, download_name='converted.txt')
        else:
            os.unlink(temp_path)
            return jsonify({'error': 'Unsupported format'}), 400
        
        with open(output_path, 'rb') as f:
            output = io.BytesIO(f.read())
        
        os.unlink(temp_path)
        os.unlink(output_path)
        
        output.seek(0)
        return send_file(output, mimetype=mimetype, as_attachment=True, download_name=f'converted.{target_format}')
        
    except Exception as e:
        return jsonify({'error': 'Failed to convert Word document', 'details': str(e)}), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5019))
    app.run(host='0.0.0.0', port=port, debug=True)
