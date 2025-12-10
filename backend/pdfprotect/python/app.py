from flask import Flask, request, send_file, jsonify
from flask_cors import CORS
from PyPDF2 import PdfReader, PdfWriter
import io
import os

app = Flask(__name__)
CORS(app)

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'healthy', 'service': 'pdf-protect'})

@app.route('/protect', methods=['POST'])
def protect_pdf():
    try:
        if 'pdf' not in request.files:
            return jsonify({'error': 'No PDF file provided'}), 400
        
        pdf_file = request.files['pdf']
        password = request.form.get('password')
        
        if not password:
            return jsonify({'error': 'Password is required'}), 400
        
        reader = PdfReader(io.BytesIO(pdf_file.read()))
        writer = PdfWriter()
        
        for page in reader.pages:
            writer.add_page(page)
        
        # Add password protection
        writer.encrypt(user_password=password, owner_password=password, permissions_flag=-1)
        
        output = io.BytesIO()
        writer.write(output)
        output.seek(0)
        
        return send_file(
            output,
            mimetype='application/pdf',
            as_attachment=True,
            download_name='protected.pdf'
        )
        
    except Exception as e:
        return jsonify({'error': 'Failed to protect PDF', 'details': str(e)}), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5017))
    app.run(host='0.0.0.0', port=port, debug=True)
