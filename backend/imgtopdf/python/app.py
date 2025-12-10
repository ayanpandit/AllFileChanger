from flask import Flask, request, send_file, jsonify
from flask_cors import CORS
import img2pdf
import io

app = Flask(__name__)
CORS(app, origins=['https://allfilechanger.onrender.com', 'http://localhost:5173', 'http://localhost:3000'])

@app.route('/image-to-pdf', methods=['POST'])
def image_to_pdf():
    try:
        if 'images' not in request.files:
            return jsonify({'error': 'No images uploaded'}), 400
        
        files = request.files.getlist('images')
        image_bytes = [file.read() for file in files if file.filename]
        
        if not image_bytes:
            return jsonify({'error': 'No valid images'}), 400
        
        pdf_bytes = img2pdf.convert(image_bytes)
        pdf_buffer = io.BytesIO(pdf_bytes)
        
        return send_file(pdf_buffer, mimetype='application/pdf', as_attachment=True, download_name='converted.pdf')
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/health')
def health():
    return jsonify({'status': 'healthy'})

if __name__ == '__main__':
    PORT = 5005
    print(f'✅ Image to PDF Backend running on port {PORT}')
    app.run(host='0.0.0.0', port=PORT, debug=False)
