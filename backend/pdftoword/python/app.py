from flask import Flask, request, send_file, jsonify
from flask_cors import CORS
from pdf2docx import Converter
import io
import os
import tempfile

app = Flask(__name__)
CORS(app)

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'healthy', 'service': 'pdf-to-word'})

@app.route('/convert', methods=['POST'])
def pdf_to_word():
    try:
        if 'pdf' not in request.files:
            return jsonify({'error': 'No PDF file provided'}), 400
        
        pdf_file = request.files['pdf']
        
        # Create temporary files
        with tempfile.NamedTemporaryFile(delete=False, suffix='.pdf') as pdf_temp:
            pdf_file.save(pdf_temp.name)
            pdf_path = pdf_temp.name
        
        with tempfile.NamedTemporaryFile(delete=False, suffix='.docx') as docx_temp:
            docx_path = docx_temp.name
        
        # Convert PDF to Word
        cv = Converter(pdf_path)
        cv.convert(docx_path)
        cv.close()
        
        # Read the converted file
        with open(docx_path, 'rb') as f:
            output = io.BytesIO(f.read())
        
        # Cleanup
        os.unlink(pdf_path)
        os.unlink(docx_path)
        
        output.seek(0)
        return send_file(
            output,
            mimetype='application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            as_attachment=True,
            download_name='converted.docx'
        )
        
    except Exception as e:
        return jsonify({'error': 'Failed to convert PDF to Word', 'details': str(e)}), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5013))
    app.run(host='0.0.0.0', port=port, debug=True)
