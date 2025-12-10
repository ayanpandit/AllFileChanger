from flask import Flask, request, send_file, jsonify
from flask_cors import CORS
import pytesseract
from PIL import Image
import io
import os

app = Flask(__name__)
CORS(app)

# Configure Tesseract path (Windows)
# pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'healthy', 'service': 'ocr-scanner'})

@app.route('/scan', methods=['POST'])
def scan_image():
    try:
        if 'image' not in request.files:
            return jsonify({'error': 'No image provided'}), 400
        
        image_file = request.files['image']
        language = request.form.get('language', 'eng')
        
        # Open image
        image = Image.open(io.BytesIO(image_file.read()))
        
        # Perform OCR
        text = pytesseract.image_to_string(image, lang=language)
        
        output = io.BytesIO(text.encode('utf-8'))
        output.seek(0)
        
        return send_file(output, mimetype='text/plain', as_attachment=True, download_name='ocr_result.txt')
        
    except Exception as e:
        return jsonify({'error': 'Failed to perform OCR', 'details': str(e)}), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5023))
    app.run(host='0.0.0.0', port=port, debug=True)
