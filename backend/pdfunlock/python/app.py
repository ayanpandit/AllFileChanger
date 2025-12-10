from flask import Flask, request, send_file, jsonify
from flask_cors import CORS
from PyPDF2 import PdfReader, PdfWriter
import io
import os

app = Flask(__name__)
CORS(app)

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'healthy', 'service': 'pdf-unlock'})

@app.route('/unlock', methods=['POST'])
def unlock_pdf():
    try:
        if 'pdf' not in request.files:
            return jsonify({'error': 'No PDF file provided'}), 400
        
        pdf_file = request.files['pdf']
        password = request.form.get('password', '')
        
        reader = PdfReader(io.BytesIO(pdf_file.read()))
        
        # If PDF is encrypted, try to decrypt with provided password
        if reader.is_encrypted:
            if not password:
                return jsonify({'error': 'PDF is encrypted. Password required'}), 400
            
            if not reader.decrypt(password):
                return jsonify({'error': 'Invalid password'}), 401
        
        writer = PdfWriter()
        
        for page in reader.pages:
            writer.add_page(page)
        
        output = io.BytesIO()
        writer.write(output)
        output.seek(0)
        
        return send_file(
            output,
            mimetype='application/pdf',
            as_attachment=True,
            download_name='unlocked.pdf'
        )
        
    except Exception as e:
        return jsonify({'error': 'Failed to unlock PDF', 'details': str(e)}), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5018))
    app.run(host='0.0.0.0', port=port, debug=True)
