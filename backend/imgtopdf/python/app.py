from flask import Flask, request, send_file, jsonify, after_this_request
from flask_cors import CORS
import img2pdf
import io
import os
import secrets
import logging
from datetime import datetime, timedelta
from threading import Lock
from PIL import Image
import time
import gc
from concurrent.futures import ThreadPoolExecutor
import multiprocessing

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

app = Flask(__name__)

# Production-grade configuration
app.config['MAX_CONTENT_LENGTH'] = 100 * 1024 * 1024  # 100MB max total upload
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', secrets.token_hex(32))

# CORS configuration for Railway production
ALLOWED_ORIGINS = [
    'https://allfilechanger.onrender.com',
    'https://allfilechanger.netlify.app',
    'http://localhost:5173',
    'http://localhost:3000',
    'http://localhost:3001',
    os.environ.get('FRONTEND_URL', '')
]
CORS(app, origins=[origin for origin in ALLOWED_ORIGINS if origin], supports_credentials=True)

# Session storage for converted PDFs
sessions = {}
session_lock = Lock()

# Configuration
ALLOWED_IMAGE_EXTENSIONS = {'jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'tiff', 'tif', 'heic', 'heif', 'ico', 'svg'}
MAX_IMAGE_SIZE = 20 * 1024 * 1024  # 20MB per image
MAX_IMAGES = 200  # Maximum images per conversion (increased for bulk processing)
SESSION_TIMEOUT = timedelta(minutes=30)
NUM_WORKERS = multiprocessing.cpu_count()  # Parallel processing workers

def cleanup_old_sessions():
    """Remove expired sessions"""
    with session_lock:
        current_time = datetime.now()
        expired = [sid for sid, data in sessions.items() if current_time - data['created_at'] > SESSION_TIMEOUT]
        for sid in expired:
            del sessions[sid]
        if expired:
            logger.info(f"Cleaned up {len(expired)} expired sessions")

def process_image_for_pdf(image_bytes, filename):
    """Ultra-fast image processing for PDF conversion - optimized for speed"""
    try:
        # Open image
        img = Image.open(io.BytesIO(image_bytes))
        
        # Fast mode conversion - only convert if necessary
        if img.mode not in ('RGB', 'L'):
            if img.mode == 'RGBA':
                # Fast RGBA to RGB conversion
                background = Image.new('RGB', img.size, (255, 255, 255))
                background.paste(img, mask=img.split()[3])
                img = background
            elif img.mode in ('LA', 'P', '1', 'CMYK'):
                # Fast conversion for other modes
                img = img.convert('RGB')
        
        # Quick resize check - only if extremely large
        max_dimension = 3000  # Reduced for faster processing
        if max(img.size) > max_dimension:
            ratio = max_dimension / max(img.size)
            new_size = (int(img.size[0] * ratio), int(img.size[1] * ratio))
            img = img.resize(new_size, Image.Resampling.BILINEAR)  # BILINEAR is faster than LANCZOS
        
        # Save as JPEG with optimized settings for speed
        output = io.BytesIO()
        img.save(output, format='JPEG', quality=85, optimize=False)  # optimize=False is much faster
        output.seek(0)
        
        return output.getvalue(), None
    except Exception as e:
        logger.error(f"Failed to process {filename}: {str(e)}")
        return None, f"Cannot process image {filename}: {str(e)}"

def validate_image(file_data, filename):
    """Validate image file format and size"""
    try:
        # Check file size
        file_data.seek(0, 2)  # Seek to end
        file_size = file_data.tell()
        file_data.seek(0)  # Reset to beginning
        
        if file_size > MAX_IMAGE_SIZE:
            return False, f"Image {filename} exceeds {MAX_IMAGE_SIZE // (1024*1024)}MB limit"
        
        # Check extension
        ext = filename.lower().split('.')[-1] if '.' in filename else ''
        if ext not in ALLOWED_IMAGE_EXTENSIONS:
            return False, f"Unsupported image format: {ext}"
        
        # Quick validation - minimal checks for speed
        try:
            image_bytes = file_data.read()
            # Just check if PIL can open it - don't validate format (faster)
            img = Image.open(io.BytesIO(image_bytes))
            img.format  # Access format to ensure it's valid
            file_data.seek(0)  # Reset for later use
            return True, None
        except Exception as e:
            return False, f"Cannot read image {filename}: {str(e)}"
            
    except Exception as e:
        return False, f"Invalid image file {filename}: {str(e)}"

@app.after_request
def add_security_headers(response):
    """Add security headers to all responses"""
    response.headers['X-Content-Type-Options'] = 'nosniff'
    response.headers['X-Frame-Options'] = 'DENY'
    response.headers['X-XSS-Protection'] = '1; mode=block'
    response.headers['Strict-Transport-Security'] = 'max-age=31536000; includeSubDomains'
    return response

@app.route('/image-to-pdf', methods=['POST', 'OPTIONS'])
def image_to_pdf():
    """Convert images to PDF with session-based storage"""
    if request.method == 'OPTIONS':
        return '', 204
    
    start_time = time.time()
    
    try:
        # Cleanup old sessions periodically
        cleanup_old_sessions()
        
        if 'images' not in request.files:
            logger.warning("No images in request")
            return jsonify({'error': 'No images uploaded'}), 400
        
        files = request.files.getlist('images')
        
        if not files or len(files) == 0:
            logger.warning("Empty file list")
            return jsonify({'error': 'No images provided'}), 400
        
        if len(files) > MAX_IMAGES:
            logger.warning(f"Too many images: {len(files)}")
            return jsonify({'error': f'Maximum {MAX_IMAGES} images allowed'}), 400
        
        # Prepare images for parallel processing
        validation_start = time.time()
        file_data_list = []
        
        for file in files:
            if file.filename:
                image_bytes = file.read()
                file_data_list.append((image_bytes, file.filename))
        
        if not file_data_list:
            return jsonify({'error': 'No valid images found'}), 400
        
        # Parallel validation and processing for EXTREME SPEED
        def validate_and_process(data):
            image_bytes, filename = data
            file_data = io.BytesIO(image_bytes)
            
            # Validate
            is_valid, error_msg = validate_image(file_data, filename)
            if not is_valid:
                return None, error_msg
            
            # Process
            processed_bytes, error_msg = process_image_for_pdf(image_bytes, filename)
            if error_msg:
                return None, error_msg
            
            return processed_bytes, None
        
        # Use ThreadPoolExecutor for parallel processing
        image_bytes_list = []
        with ThreadPoolExecutor(max_workers=NUM_WORKERS) as executor:
            results = list(executor.map(validate_and_process, file_data_list))
        
        # Check for errors and collect results
        for idx, (result, error) in enumerate(results):
            if error:
                logger.warning(f"Image processing failed: {error}")
                return jsonify({'error': error}), 400
            if result:
                image_bytes_list.append(result)
        
        if not image_bytes_list:
            logger.warning("No valid images after processing")
            return jsonify({'error': 'No valid images found'}), 400
        
        validation_time = round((time.time() - validation_start) * 1000, 2)
        logger.info(f"⚡ ULTRA-FAST: Processed {len(image_bytes_list)} images in {validation_time}ms with {NUM_WORKERS} workers")
        
        # Convert images to PDF (all images are now in consistent JPEG/RGB format)
        conversion_start = time.time()
        logger.info(f"Converting {len(image_bytes_list)} images to PDF")
        
        pdf_bytes = img2pdf.convert(image_bytes_list)
        
        conversion_time = round((time.time() - conversion_start) * 1000, 2)
        logger.info(f"PDF conversion completed in {conversion_time}ms")
        
        # Store image count before clearing
        image_count = len(image_bytes_list)
        
        # Clear image bytes from memory
        del image_bytes_list
        gc.collect()
        
        # Create session
        session_id = secrets.token_urlsafe(32)
        with session_lock:
            sessions[session_id] = {
                'pdf': pdf_bytes,
                'created_at': datetime.now(),
                'filename': 'converted.pdf'
            }
        
        processing_time = round((time.time() - start_time) * 1000, 2)
        logger.info(f"PDF created successfully in {processing_time}ms, session: {session_id[:8]}...")
        
        return jsonify({
            'success': True,
            'sessionId': session_id,
            'filename': 'converted.pdf',
            'size': len(pdf_bytes),
            'imageCount': image_count,
            'processingTime': processing_time,
            'validationTime': validation_time,
            'conversionTime': conversion_time
        }), 200
    
    except img2pdf.ImageOpenError as e:
        logger.error(f"Image open error: {str(e)}")
        return jsonify({'error': f'Failed to process images: {str(e)}'}), 400
    except Exception as e:
        logger.error(f"Conversion error: {str(e)}", exc_info=True)
        return jsonify({'error': 'Conversion failed. Please try again.'}), 500

@app.route('/download/<session_id>', methods=['GET'])
def download_pdf(session_id):
    """Download PDF from session"""
    try:
        with session_lock:
            session_data = sessions.get(session_id)
        
        if not session_data:
            logger.warning(f"Session not found: {session_id[:8]}...")
            return jsonify({'error': 'Session expired or invalid'}), 404
        
        pdf_bytes = session_data['pdf']
        filename = session_data['filename']
        
        pdf_buffer = io.BytesIO(pdf_bytes)
        
        @after_this_request
        def cleanup_session(response):
            """Cleanup session after download"""
            with session_lock:
                if session_id in sessions:
                    del sessions[session_id]
                    logger.info(f"Session cleaned up: {session_id[:8]}...")
            return response
        
        logger.info(f"PDF downloaded: {session_id[:8]}..., size: {len(pdf_bytes)} bytes")
        return send_file(
            pdf_buffer,
            mimetype='application/pdf',
            as_attachment=True,
            download_name=filename
        )
    
    except Exception as e:
        logger.error(f"Download error: {str(e)}", exc_info=True)
        return jsonify({'error': 'Download failed'}), 500

@app.route('/session/<session_id>', methods=['DELETE'])
def delete_session(session_id):
    """Manually delete a session"""
    try:
        with session_lock:
            if session_id in sessions:
                del sessions[session_id]
                logger.info(f"Session manually deleted: {session_id[:8]}...")
                return jsonify({'success': True}), 200
            else:
                return jsonify({'error': 'Session not found'}), 404
    except Exception as e:
        logger.error(f"Session deletion error: {str(e)}")
        return jsonify({'error': 'Deletion failed'}), 500

@app.route('/health', methods=['GET'])
def health():
    """Health check endpoint"""
    with session_lock:
        active_sessions = len(sessions)
    
    return jsonify({
        'status': 'healthy',
        'service': 'image-to-pdf',
        'version': '2.0.0',
        'activeSessions': active_sessions,
        'timestamp': datetime.now().isoformat()
    }), 200

@app.route('/', methods=['GET'])
def root():
    """Root endpoint"""
    return jsonify({
        'service': 'Image to PDF Converter API',
        'version': '2.0.0',
        'status': 'running',
        'endpoints': {
            'convert': '/image-to-pdf (POST)',
            'download': '/download/<session_id> (GET)',
            'delete': '/session/<session_id> (DELETE)',
            'health': '/health (GET)'
        }
    }), 200

if __name__ == '__main__':
    PORT = int(os.environ.get('PORT', 5005))
    logger.info(f"🚀 Image to PDF Backend v2.0.0 starting on port {PORT}")
    logger.info(f"Environment: {'Production' if os.environ.get('RAILWAY_ENVIRONMENT') else 'Development'}")
    app.run(host='0.0.0.0', port=PORT, debug=False, threaded=True)