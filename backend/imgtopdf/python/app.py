from flask import Flask, request, send_file, jsonify
from flask_cors import CORS
import img2pdf
import io
import os
import logging
from datetime import datetime, timedelta
import secrets
from PIL import Image
import threading
import time

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

app = Flask(__name__)

# Security configuration
app.config['MAX_CONTENT_LENGTH'] = 100 * 1024 * 1024  # 100MB max request size
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', secrets.token_hex(32))

# CORS configuration - allow all origins for development, restrict in production
CORS(app, 
     origins='*',
     methods=['GET', 'POST', 'OPTIONS'],
     allow_headers=['Content-Type', 'Authorization'],
     expose_headers=['Content-Disposition'],
     supports_credentials=False,
     max_age=3600)

# Session storage for processed PDFs
sessions = {}
SESSION_TIMEOUT = timedelta(minutes=30)
MAX_FILE_SIZE = 20 * 1024 * 1024  # 20MB per image
MAX_IMAGES = 50
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'bmp', 'tiff', 'webp'}

def cleanup_sessions():
    """Periodically clean up expired sessions"""
    while True:
        try:
            now = datetime.now()
            expired = [sid for sid, data in sessions.items() 
                      if now - data['created'] > SESSION_TIMEOUT]
            for sid in expired:
                sessions.pop(sid, None)
                logger.info(f"Cleaned up expired session: {sid}")
            time.sleep(300)  # Run every 5 minutes
        except Exception as e:
            logger.error(f"Error in cleanup: {e}")

# Start cleanup thread
cleanup_thread = threading.Thread(target=cleanup_sessions, daemon=True)
cleanup_thread.start()

def allowed_file(filename):
    """Check if file extension is allowed"""
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def validate_image(file_data):
    """Validate image data and check if it's a valid image"""
    try:
        img = Image.open(io.BytesIO(file_data))
        img.verify()  # Verify it's a valid image
        return True
    except Exception as e:
        logger.warning(f"Invalid image data: {e}")
        return False

@app.route('/health', methods=['GET'])
def health():
    """Health check endpoint for Railway"""
    return jsonify({
        'status': 'healthy',
        'service': 'image-to-pdf',
        'timestamp': datetime.now().isoformat(),
        'active_sessions': len(sessions)
    }), 200

@app.route('/image-to-pdf', methods=['POST', 'OPTIONS'])
def image_to_pdf():
    """Convert images to PDF with session-based download"""
    if request.method == 'OPTIONS':
        return '', 204
    
    try:
        # Validate request
        if 'images' not in request.files:
            return jsonify({'error': 'No images uploaded'}), 400
        
        files = request.files.getlist('images')
        
        if not files or len(files) == 0:
            return jsonify({'error': 'No files selected'}), 400
        
        if len(files) > MAX_IMAGES:
            return jsonify({'error': f'Maximum {MAX_IMAGES} images allowed'}), 400
        
        # Validate and collect image bytes
        image_bytes = []
        for file in files:
            if not file or not file.filename:
                continue
            
            if not allowed_file(file.filename):
                return jsonify({'error': f'Invalid file type: {file.filename}'}), 400
            
            file_data = file.read()
            
            if len(file_data) > MAX_FILE_SIZE:
                return jsonify({'error': f'File too large: {file.filename} (max 20MB)'}), 400
            
            if not validate_image(file_data):
                return jsonify({'error': f'Invalid or corrupted image: {file.filename}'}), 400
            
            image_bytes.append(file_data)
        
        if not image_bytes:
            return jsonify({'error': 'No valid images found'}), 400
        
        # Convert to PDF
        start_time = time.time()
        pdf_bytes = img2pdf.convert(image_bytes)
        processing_time = round((time.time() - start_time) * 1000, 2)
        
        # Create session
        session_id = secrets.token_urlsafe(32)
        sessions[session_id] = {
            'pdf': pdf_bytes,
            'created': datetime.now(),
            'image_count': len(image_bytes)
        }
        
        logger.info(f"Session {session_id}: Converted {len(image_bytes)} images to PDF in {processing_time}ms")
        
        return jsonify({
            'success': True,
            'sessionId': session_id,
            'imageCount': len(image_bytes),
            'processingTime': processing_time,
            'message': f'Successfully converted {len(image_bytes)} images to PDF'
        }), 200
        
    except Exception as e:
        logger.error(f"Error converting images to PDF: {str(e)}", exc_info=True)
        return jsonify({'error': 'Failed to convert images to PDF', 'details': str(e)}), 500

@app.route('/download/<session_id>', methods=['GET'])
def download_pdf(session_id):
    """Download PDF using session ID"""
    try:
        if session_id not in sessions:
            return jsonify({'error': 'Session not found or expired'}), 404
        
        session_data = sessions[session_id]
        
        # Check if session expired
        if datetime.now() - session_data['created'] > SESSION_TIMEOUT:
            sessions.pop(session_id, None)
            return jsonify({'error': 'Session expired'}), 410
        
        pdf_buffer = io.BytesIO(session_data['pdf'])
        pdf_buffer.seek(0)
        
        logger.info(f"Session {session_id}: PDF downloaded")
        
        # Clean up session after download
        threading.Timer(2.0, lambda: sessions.pop(session_id, None)).start()
        
        return send_file(
            pdf_buffer,
            mimetype='application/pdf',
            as_attachment=True,
            download_name='converted.pdf'
        )
        
    except Exception as e:
        logger.error(f"Error downloading PDF: {str(e)}", exc_info=True)
        return jsonify({'error': 'Failed to download PDF'}), 500

@app.route('/session/<session_id>', methods=['DELETE'])
def delete_session(session_id):
    """Manually delete a session"""
    if session_id in sessions:
        sessions.pop(session_id)
        return jsonify({'success': True}), 200
    return jsonify({'error': 'Session not found'}), 404

@app.errorhandler(413)
def request_entity_too_large(error):
    """Handle file too large error"""
    return jsonify({'error': 'Request too large. Maximum 100MB total upload size.'}), 413

@app.errorhandler(500)
def internal_server_error(error):
    """Handle internal server errors"""
    logger.error(f"Internal server error: {error}")
    return jsonify({'error': 'Internal server error'}), 500

# Security headers
@app.after_request
def add_security_headers(response):
    response.headers['X-Content-Type-Options'] = 'nosniff'
    response.headers['X-Frame-Options'] = 'DENY'
    response.headers['X-XSS-Protection'] = '1; mode=block'
    response.headers['Strict-Transport-Security'] = 'max-age=31536000; includeSubDomains'
    return response

if __name__ == '__main__':
    PORT = int(os.environ.get('PORT', 5005))
    ENV = os.environ.get('RAILWAY_ENVIRONMENT', 'development')
    
    logger.info(f"🚀 Image to PDF Backend starting...")
    logger.info(f"📍 Environment: {ENV}")
    logger.info(f"🔌 Port: {PORT}")
    logger.info(f"💾 Max file size: {MAX_FILE_SIZE / 1024 / 1024}MB per image")
    logger.info(f"📊 Max images: {MAX_IMAGES}")
    
    app.run(
        host='0.0.0.0',
        port=PORT,
        debug=False,
        threaded=True
    )
