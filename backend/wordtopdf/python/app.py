from flask import Flask, request, send_file, jsonify
from flask_cors import CORS
from docx2pdf import convert
import io
import os
import tempfile

app = Flask(__name__)
CORS(app)

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'healthy', 'service': 'word-to-pdf'})

@app.route('/convert', methods=['POST'])
def word_to_pdf():
    try:
        if 'word' not in request.files:
            return jsonify({'error': 'No Word file provided'}), 400
        
        word_file = request.files['word']
        
        # Create temporary files
        with tempfile.NamedTemporaryFile(delete=False, suffix='.docx') as word_temp:
            word_file.save(word_temp.name)
            word_path = word_temp.name
        
        with tempfile.NamedTemporaryFile(delete=False, suffix='.pdf') as pdf_temp:
            pdf_path = pdf_temp.name
        
        # Convert Word to PDF (Note: This requires LibreOffice on the server)
        # Alternative: use python-docx and reportlab for cross-platform support
        convert(word_path, pdf_path)
        
        # Read the converted file
        with open(pdf_path, 'rb') as f:
            output = io.BytesIO(f.read())
        
        # Cleanup
        os.unlink(word_path)
        os.unlink(pdf_path)
        
        output.seek(0)
        return send_file(
            output,
            mimetype='application/pdf',
            as_attachment=True,
            download_name='converted.pdf'
        )
        
    except Exception as e:
        return jsonify({'error': 'Failed to convert Word to PDF', 'details': str(e)}), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5014))
    app.run(host='0.0.0.0', port=port, debug=True)
