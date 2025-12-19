# Image to PDF Converter Backend

Production-grade Flask API for converting images to PDF with session-based processing.

## Features

✅ **Production-Ready**
- Session-based PDF storage for reliable downloads
- Comprehensive error handling and validation
- Security headers and CORS protection
- Request logging and monitoring
- Automatic session cleanup

✅ **Image Processing**
- Supports: JPG, JPEG, PNG, GIF, BMP, WebP, TIFF, HEIC, HEIF, ICO, SVG
- Multi-image conversion (up to 200 images per request)
- File size validation (20MB per image, 100MB total payload)
- Automatic mode conversion + resizing for consistent, high-quality PDFs

✅ **Performance**
- Gunicorn with gevent workers in production
- Parallel ThreadPoolExecutor processing using all CPU cores
- Optimized memory usage with aggressive cleanup
- Health/metrics endpoints for observability

## API Endpoints

### 1. Convert Images to PDF
```http
POST /image-to-pdf
Content-Type: multipart/form-data

Body: images[] (files)
```

**Response:**
```json
{
  "success": true,
  "sessionId": "abc123...",
  "filename": "converted.pdf",
  "size": 1048576,
  "imageCount": 3,
  "processingTime": 245.67
}
```

### 2. Download PDF
```http
GET /download/<session_id>
```

**Response:** PDF file (application/pdf)

### 3. Delete Session
```http
DELETE /session/<session_id>
```

**Response:**
```json
{
  "success": true
}
```

### 4. Health Check
```http
GET /health
```

**Response:**
```json
{
  "status": "healthy",
  "service": "image-to-pdf",
  "version": "2.0.0",
  "activeSessions": 5,
  "timestamp": "2025-12-11T10:30:00"
}
```

## Railway Deployment

### Prerequisites
- Railway account
- GitHub repository connected

### Deploy Steps

1. **Create New Project**
   ```bash
   railway init
   ```

2. **Set Environment Variables** (Railway Dashboard)
   ```
   PORT=5005
   SECRET_KEY=<generate-secure-key>
   FRONTEND_URL=https://your-frontend.com
   GUNICORN_WORKERS=2
   ```

3. **Deploy**
   ```bash
   railway up
   ```

4. **Custom Domain** (Optional)
   - Go to Settings → Domains
   - Add custom domain or use Railway domain

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port (Railway auto-sets) | 5005 |
| `SECRET_KEY` | Flask secret key | Auto-generated |
| `FRONTEND_URL` | Frontend URL for CORS | - |
| `GUNICORN_WORKERS` | Number of worker processes | 2 |
| `LOG_LEVEL` | Logging level | INFO |

## Local Development

### Setup
```bash
# Create virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run development server
python app.py
```

### Test API
```bash
# Health check
curl http://localhost:5005/health

# Convert images
curl -X POST http://localhost:5005/image-to-pdf \
  -F "images=@image1.jpg" \
  -F "images=@image2.jpg"
```

## Configuration Limits

- **Max Images**: 200 per conversion
- **Max Image Size**: 20MB per image
- **Max Total Upload**: 100MB
- **Session Timeout**: 30 minutes
- **Worker Timeout**: 300 seconds

## Security Features

- CORS with whitelist origins
- File type validation
- Image format verification
- Security headers (X-Frame-Options, CSP, etc.)
- Request size limits
- Session-based temporary storage

## Monitoring

View logs in Railway dashboard:
```bash
railway logs
```

## Performance Optimization

- Gunicorn with gevent for async I/O
- Worker preloading for faster startup
- Memory-efficient session storage
- Automatic cleanup of expired sessions

## Troubleshooting

### High Memory Usage
- Reduce `GUNICORN_WORKERS`
- Lower `MAX_IMAGES` limit

### Timeout Errors
- Increase `timeout` in gunicorn.conf.py
- Check image sizes

### CORS Issues
- Verify `FRONTEND_URL` in environment variables
- Check ALLOWED_ORIGINS in app.py

## Version History

- **v2.0.0** - Production-grade rewrite with session management
- **v1.0.0** - Initial release

## License

MIT
