# PPTX to PDF Converter API

Production-grade PowerPoint to PDF converter backend with Railway deployment support.

## Features

✅ **High-Quality Conversion** - Uses LibreOffice for pixel-perfect PDF generation  
✅ **Fast & Lightweight** - Optimized for speed and minimal server resource usage  
✅ **Production Ready** - Robust error handling, logging, and cleanup  
✅ **Railway Optimized** - Pre-configured for one-click Railway deployment  
✅ **Secure** - File validation, size limits, automatic cleanup  
✅ **Multi-format Support** - Convert to PDF or extract text

## Tech Stack

- **Flask** - Lightweight WSGI web framework
- **Gunicorn** - Production WSGI server
- **LibreOffice** - High-quality document conversion engine
- **python-pptx** - PowerPoint file processing

## API Endpoints

### Health Check
```http
GET /health
```

Response:
```json
{
  "status": "healthy",
  "service": "pptx-to-pdf-converter",
  "libreoffice_available": true
}
```

### Convert File
```http
POST /convert
Content-Type: multipart/form-data
```

Parameters:
- `file` (required): PPT/PPTX file (max 50MB)
- `format` (optional): Output format - `pdf` (default) or `txt`

Response: Binary file download

## Local Development

### Prerequisites
- Python 3.10+
- LibreOffice (for PDF conversion)

### Install LibreOffice

**macOS:**
```bash
brew install --cask libreoffice
```

**Ubuntu/Debian:**
```bash
sudo apt-get update
sudo apt-get install -y libreoffice libreoffice-writer libreoffice-impress
```

**Windows:**
Download from [LibreOffice.org](https://www.libreoffice.org/download/download/)

### Setup & Run

```bash
# Install dependencies
pip install -r requirements.txt

# Run development server
python app.py

# Or use Gunicorn (production)
gunicorn --bind 0.0.0.0:5021 --workers 2 --threads 2 --timeout 120 app:app
```

Server runs on `http://localhost:5021`

## Railway Deployment

### Quick Deploy

1. **Push to GitHub**
2. **Connect to Railway**:
   - Go to [Railway.app](https://railway.app)
   - Create new project → Deploy from GitHub
   - Select this repository
   - Set root directory to `backend/ppttopdf/python`

3. **Railway Auto-detects**:
   - Uses `nixpacks.toml` for LibreOffice installation
   - Runs build and start commands automatically

### Build & Start Commands

**Build Command:**
```bash
pip install -r requirements.txt
```

**Start Command:**
```bash
gunicorn --bind 0.0.0.0:$PORT --workers 2 --threads 2 --timeout 120 --max-requests 100 --max-requests-jitter 10 app:app
```

### Environment Variables (Optional)

Set in Railway dashboard:
- `PORT` - Auto-set by Railway
- `FLASK_ENV` - Set to `production` (default)

### Resource Optimization

The app is configured for minimal resource usage:
- **2 workers, 2 threads** - Handles ~8-12 concurrent requests
- **120s timeout** - Sufficient for large files
- **Max requests: 100** - Worker recycling prevents memory leaks
- **Auto cleanup** - Temporary files deleted after conversion

### Production Features

✅ Automatic file cleanup  
✅ Timeout handling for large files  
✅ Worker recycling to prevent memory leaks  
✅ Comprehensive logging  
✅ Health check endpoint  
✅ CORS enabled  
✅ Secure filename handling  
✅ File type validation  
✅ Size limits (50MB)

## Testing

```bash
# Test with curl
curl -X POST http://localhost:5021/convert \
  -F "file=@presentation.pptx" \
  -F "format=pdf" \
  -o output.pdf

# Health check
curl http://localhost:5021/health
```

## Troubleshooting

**LibreOffice not found:**
- Ensure LibreOffice is installed and in PATH
- Check with: `libreoffice --version`

**Conversion timeout:**
- Increase timeout in `nixpacks.toml` and `Procfile`
- Reduce file size or complexity

**Memory issues:**
- Reduce workers/threads
- Add swap space on Railway

## Performance

- **Conversion Speed**: 1-3 seconds for typical presentations
- **Memory Usage**: ~200-400MB per worker
- **Concurrent Requests**: 8-12 optimal
- **File Size Limit**: 50MB (configurable)

## License

MIT
