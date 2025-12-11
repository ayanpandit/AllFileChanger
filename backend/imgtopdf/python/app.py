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

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

app = Flask(__name__)

# Production-grade configuration
app.config['MAX_CONTENT_LENGTH'] = 200 * 1024 * 1024  # 200MB max total upload (for 100+ images)
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
ALLOWED_IMAGE_EXTENSIONS = {'jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'tiff', 'tif'}
MAX_IMAGE_SIZE = 20 * 1024 * 1024  # 20MB per image
MAX_IMAGES = 150  # Maximum images per conversion (increased for 100+ support)
SESSION_TIMEOUT = timedelta(minutes=30)
OPTIMIZE_IMAGES = True  # Enable image optimization for faster processing

def cleanup_old_sessions():
    """Remove expired sessions"""
    with session_lock:
        current_time = datetime.now()
        expired = [sid for sid, data in sessions.items() if current_time - data['created_at'] > SESSION_TIMEOUT]
        for sid in expired:
            del sessions[sid]
        if expired:
            logger.info(f"Cleaned up {len(expired)} expired sessions")

def optimize_image(image_bytes, filename):
    """Optimize image for faster PDF conversion"""
    try:
        img = Image.open(io.BytesIO(image_bytes))
        
        # Convert to RGB if necessary (img2pdf requires RGB for JPEG)
        if img.mode not in ('RGB', 'L', 'RGBA'):
            if img.mode == 'P' or img.mode == '1':
                img = img.convert('RGB')
        
        # Optimize large images (reduce dimensions if too large)
        max_dimension = 4096  # Maximum width/height
        if max(img.size) > max_dimension:
            ratio = max_dimension / max(img.size)
            new_size = tuple(int(dim * ratio) for dim in img.size)
            img = img.resize(new_size, Image.Resampling.LANCZOS)
        
        # Save optimized image to bytes
        output = io.BytesIO()
        
        # Save as JPEG with optimization (faster and smaller)
        if img.mode == 'RGBA':
            # Convert RGBA to RGB with white background
            background = Image.new('RGB', img.size, (255, 255, 255))
            background.paste(img, mask=img.split()[3])
            img = background
        
        if img.mode in ('RGB', 'L'):
            img.save(output, format='JPEG', quality=85, optimize=True)
        else:
            img.save(output, format='PNG', optimize=True)
        
        return output.getvalue()
    except Exception as e:
        logger.warning(f"Image optimization failed for {filename}: {e}, using original")
        return image_bytes

def validate_and_process_image(file_data, filename):
    """Validate image file format, size, and return processed bytes"""
    try:
        # Check file size
        file_data.seek(0, 2)  # Seek to end
        file_size = file_data.tell()
        file_data.seek(0)  # Reset to beginning
        
        if file_size > MAX_IMAGE_SIZE:
            return None, f"Image {filename} exceeds {MAX_IMAGE_SIZE // (1024*1024)}MB limit"
        
        # Check extension
        ext = filename.lower().split('.')[-1] if '.' in filename else ''
        if ext not in ALLOWED_IMAGE_EXTENSIONS:
            return None, f"Unsupported image format: {ext}"
        
        # Read bytes
        image_bytes = file_data.read()
        
        # Quick validation with PIL (without full verify to avoid corruption)
        try:
            img = Image.open(io.BytesIO(image_bytes))
            img_format = img.format
            if not img_format or img_format.lower() not in ['jpeg', 'png', 'gif', 'bmp', 'webp', 'tiff']:
                return None, f"Invalid image format: {img_format}"
        except Exception as e:
            return None, f"Cannot read image {filename}: {str(e)}"
        
        # Optimize if enabled
        if OPTIMIZE_IMAGES:
            image_bytes = optimize_image(image_bytes, filename)
        
        return image_bytes, None
    except Exception as e:
        return None, f"Invalid image file {filename}: {str(e)}"

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
        
        # Validate and process all images
        image_bytes_list = []
        validation_start = time.time()
        
        for idx, file in enumerate(files):
            if not file.filename:
                continue
            
            file_data = io.BytesIO(file.read())
            image_bytes, error_msg = validate_and_process_image(file_data, file.filename)
            
            if error_msg:
                logger.warning(f"Image validation failed: {error_msg}")
                return jsonify({'error': error_msg}), 400
            
            if image_bytes:
                image_bytes_list.append(image_bytes)
        
        if not image_bytes_list:
            logger.warning("No valid images after validation")
            return jsonify({'error': 'No valid images found'}), 400
        
        validation_time = round((time.time() - validation_start) * 1000, 2)
        logger.info(f"Validated and processed {len(image_bytes_list)} images in {validation_time}ms")
        
        # Convert images to PDF with optimized settings
        conversion_start = time.time()
        logger.info(f"Converting {len(image_bytes_list)} images to PDF")
        
        # Use img2pdf with layout settings for better compatibility
        layout_fun = img2pdf.get_layout_fun(pagesize=None, border=None, fit=img2pdf.FitMode.into)
        pdf_bytes = img2pdf.convert(image_bytes_list, layout_fun=layout_fun)
        
        conversion_time = round((time.time() - conversion_start) * 1000, 2)
        logger.info(f"PDF conversion completed in {conversion_time}ms")
        
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
            'imageCount': len(image_bytes_list),
            'processingTime': processing_time
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
        'version': '2.1.0',
        'activeSessions': active_sessions,
        'maxImages': MAX_IMAGES,
        'optimizeImages': OPTIMIZE_IMAGES,
        'timestamp': datetime.now().isoformat()
    }), 200

@app.route('/', methods=['GET'])
def root():
    """Root endpoint"""
    return jsonify({
        'service': 'Image to PDF Converter API',
        'version': '2.1.0',
        'status': 'running',
        'features': {
            'maxImages': MAX_IMAGES,
            'optimizeImages': OPTIMIZE_IMAGES,
            'supportedFormats': list(ALLOWED_IMAGE_EXTENSIONS)
        },
        'endpoints': {
            'convert': '/image-to-pdf (POST)',
            'download': '/download/<session_id> (GET)',
            'delete': '/session/<session_id> (DELETE)',
            'health': '/health (GET)'
        }
    }), 200

if __name__ == '__main__':
    PORT = int(os.environ.get('PORT', 5005))
    logger.info(f"🚀 Image to PDF Backend v2.1.0 starting on port {PORT}")
    logger.info(f"Environment: {'Production' if os.environ.get('RAILWAY_ENVIRONMENT') else 'Development'}")
    logger.info(f"Max images: {MAX_IMAGES}, Optimization: {OPTIMIZE_IMAGES}")
    app.run(host='0.0.0.0', port=PORT, debug=False, threaded=True)
