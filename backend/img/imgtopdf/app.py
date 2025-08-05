import os
from flask import Flask, request, send_file, jsonify
from flask_cors import CORS
import img2pdf
import io
from werkzeug.utils import secure_filename
import logging

app = Flask(__name__)

# Configure CORS for production
CORS(app, origins=["https://allfilechanger.com", "http://localhost:3000"])

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Configuration
app.config['MAX_CONTENT_LENGTH'] = 50 * 1024 * 1024  # 50 MB
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'bmp', 'tiff', 'webp'}

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/')
def home():
    return jsonify({
        "status": "AllFileChanger Image to PDF API is running",
        "version": "1.0.0",
        "endpoints": {
            "upload": "/upload - POST method for converting images to PDF"
        }
    }), 200

@app.route('/health')
def health_check():
    return jsonify({"status": "healthy"}), 200

@app.route('/upload', methods=['POST'])
def upload():
    try:
        # Check if files are present
        if 'images' not in request.files:
            return jsonify({"error": "No images field in request"}), 400
        
        files = request.files.getlist('images')
        if not files or all(file.filename == '' for file in files):
            return jsonify({"error": "No files selected"}), 400

        # Validate file types
        valid_files = []
        for file in files:
            if file and allowed_file(file.filename):
                valid_files.append(file)
            else:
                logger.warning(f"Invalid file type: {file.filename}")

        if not valid_files:
            return jsonify({"error": "No valid image files found"}), 400

        # Convert images to PDF
        image_bytes = []
        for file in valid_files:
            file_data = file.read()
            if len(file_data) == 0:
                continue
            image_bytes.append(file_data)

        if not image_bytes:
            return jsonify({"error": "No valid image data found"}), 400

        # Generate PDF
        output_pdf = img2pdf.convert(image_bytes)
        
        logger.info(f"Successfully converted {len(image_bytes)} images to PDF")

        return send_file(
            io.BytesIO(output_pdf),
            as_attachment=True,
            download_name="converted_images.pdf",
            mimetype="application/pdf"
        )

    except img2pdf.ImageOpenError as e:
        logger.error(f"Image processing error: {str(e)}")
        return jsonify({"error": "Invalid image format or corrupted image"}), 400
    except Exception as e:
        logger.error(f"Conversion error: {str(e)}")
        return jsonify({"error": "Failed to convert images to PDF"}), 500

@app.errorhandler(413)
def request_entity_too_large(error):
    return jsonify({"error": "File too large. Maximum size is 50MB"}), 413

@app.errorhandler(404)
def not_found(error):
    return jsonify({"error": "Endpoint not found"}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({"error": "Internal server error"}), 500

# Only used for local development
if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=False)
