"""AllFileChanger – Unified Python Backend
==========================================
Consolidates all 17 Python micro-services into a single Flask app
using Blueprints for clean route organisation.

Run:  python app.py                             (development)
      gunicorn app:app -b 0.0.0.0:5050 -w 4    (production)
"""

from flask import Flask, jsonify
from flask_cors import CORS
import os, logging, atexit, shutil, tempfile, signal, sys

# ── Logging ─────────────────────────────────────────────────────────────────
LOG_LEVEL = os.environ.get('LOG_LEVEL', 'INFO').upper()
logging.basicConfig(
    level=getattr(logging, LOG_LEVEL, logging.INFO),
    format='%(asctime)s [%(name)s] %(levelname)s  %(message)s'
)
logger = logging.getLogger('allfilechanger')

# ── App factory ─────────────────────────────────────────────────────────────
app = Flask(__name__)
app.config['MAX_CONTENT_LENGTH'] = 100 * 1024 * 1024  # 100 MB

# ── CORS – restrict in production ──────────────────────────────────────────
cors_origins = os.environ.get('CORS_ORIGIN', '*')
CORS(app, origins=cors_origins.split(',') if cors_origins != '*' else '*')

# ── Temp directory for all file operations ──────────────────────────────────
TEMP_DIR = os.path.join(tempfile.gettempdir(), 'allfilechanger')
os.makedirs(TEMP_DIR, exist_ok=True)

def cleanup_temp():
    """Remove global temp dir on shutdown."""
    if os.path.exists(TEMP_DIR):
        shutil.rmtree(TEMP_DIR, ignore_errors=True)
        logger.info('Cleaned up temp directory')

atexit.register(cleanup_temp)

# ── Register Blueprints ─────────────────────────────────────────────────────
from routes.img_to_pdf       import bp as img_to_pdf_bp
from routes.pdf_merge         import bp as pdf_merge_bp
from routes.pdf_split         import bp as pdf_split_bp
from routes.pdf_compress      import bp as pdf_compress_bp
from routes.pdf_to_word       import bp as pdf_to_word_bp
from routes.word_to_pdf       import bp as word_to_pdf_bp
from routes.pdf_to_excel      import bp as pdf_to_excel_bp
from routes.pdf_to_ppt        import bp as pdf_to_ppt_bp
from routes.pdf_protect       import bp as pdf_protect_bp
from routes.pdf_unlock        import bp as pdf_unlock_bp
from routes.word_converter    import bp as word_converter_bp
from routes.excel_converter   import bp as excel_converter_bp
from routes.ppt_converter     import bp as ppt_converter_bp
from routes.text_extractor    import bp as text_extractor_bp
from routes.ocr_scanner       import bp as ocr_scanner_bp
from routes.doc_merger        import bp as doc_merger_bp
from routes.format_converter  import bp as format_converter_bp

app.register_blueprint(img_to_pdf_bp,       url_prefix='/api/pdf')
app.register_blueprint(pdf_merge_bp,        url_prefix='/api/pdf')
app.register_blueprint(pdf_split_bp,        url_prefix='/api/pdf')
app.register_blueprint(pdf_compress_bp,     url_prefix='/api/pdf')
app.register_blueprint(pdf_to_word_bp,      url_prefix='/api/pdf')
app.register_blueprint(word_to_pdf_bp,      url_prefix='/api/doc')
app.register_blueprint(pdf_to_excel_bp,     url_prefix='/api/pdf')
app.register_blueprint(pdf_to_ppt_bp,       url_prefix='/api/pdf')
app.register_blueprint(pdf_protect_bp,      url_prefix='/api/pdf')
app.register_blueprint(pdf_unlock_bp,       url_prefix='/api/pdf')
app.register_blueprint(word_converter_bp,   url_prefix='/api/doc')
app.register_blueprint(excel_converter_bp,  url_prefix='/api/doc')
app.register_blueprint(ppt_converter_bp,    url_prefix='/api/doc')
app.register_blueprint(text_extractor_bp,   url_prefix='/api/doc')
app.register_blueprint(ocr_scanner_bp,      url_prefix='/api/doc')
app.register_blueprint(doc_merger_bp,       url_prefix='/api/doc')
app.register_blueprint(format_converter_bp, url_prefix='/api/doc')

# ── Health / Root ───────────────────────────────────────────────────────────
@app.route('/health')
def health():
    return jsonify(
        status='healthy',
        service='allfilechanger-python-backend',
        environment=os.environ.get('FLASK_ENV', 'production'),
    )

@app.route('/')
def root():
    return jsonify(
        service='AllFileChanger Unified Python API',
        version='1.0.0',
        endpoints={
            'image_to_pdf':    'POST /api/pdf/image-to-pdf',
            'pdf_merge':       'POST /api/pdf/merge',
            'pdf_split':       'POST /api/pdf/split',
            'pdf_compress':    'POST /api/pdf/compress',
            'pdf_to_word':     'POST /api/pdf/to-word',
            'pdf_to_excel':    'POST /api/pdf/to-excel',
            'pdf_to_ppt':      'POST /api/pdf/to-powerpoint',
            'pdf_protect':     'POST /api/pdf/protect',
            'pdf_unlock':      'POST /api/pdf/unlock',
            'word_to_pdf':     'POST /api/doc/word-to-pdf',
            'word_convert':    'POST /api/doc/word-convert',
            'excel_convert':   'POST /api/doc/excel-convert',
            'ppt_convert':     'POST /api/doc/ppt-convert',
            'text_extract':    'POST /api/doc/extract',
            'ocr_scan':        'POST /api/doc/scan',
            'doc_merge':       'POST /api/doc/merge',
            'format_convert':  'POST /api/doc/format-convert',
            'health':          'GET  /health',
        }
    )

# ── Error handler ───────────────────────────────────────────────────────────
@app.errorhandler(413)
def too_large(e):
    return jsonify(error='File too large (max 100 MB)'), 413

@app.errorhandler(Exception)
def handle_exception(e):
    logger.exception('Unhandled error')
    detail = str(e) if os.environ.get('FLASK_ENV') != 'production' else 'An internal error occurred'
    return jsonify(error='Internal server error', details=detail), 500

# ── Graceful shutdown ───────────────────────────────────────────────────────
def _shutdown(signum, frame):
    logger.info(f'Received signal {signum} – shutting down')
    cleanup_temp()
    sys.exit(0)

signal.signal(signal.SIGTERM, _shutdown)
signal.signal(signal.SIGINT,  _shutdown)

# ── Run ─────────────────────────────────────────────────────────────────────
if __name__ == '__main__':
    PORT = int(os.environ.get('PORT', 5050))
    logger.info(f'🚀 AllFileChanger Python Backend starting on port {PORT}')
    app.run(host='0.0.0.0', port=PORT, debug=False, threaded=True)
