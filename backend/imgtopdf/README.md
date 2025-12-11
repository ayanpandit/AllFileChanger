# Image to PDF Backend - Production Ready

Professional-grade Flask backend for converting images to PDF files.

## 🚀 Features

- **Session-Based Architecture**: Secure temporary storage for processed PDFs
- **File Validation**: Comprehensive image validation and size limits
- **Security Headers**: Production-ready security configuration
- **Error Handling**: Robust error handling with detailed logging
- **Health Checks**: Railway-compatible health monitoring
- **Auto Cleanup**: Automatic session cleanup every 5 minutes
- **Rate Limiting**: Protection against abuse
- **CORS Configured**: Proper cross-origin resource sharing

## 📋 Technical Specifications

- **Max Upload Size**: 100MB total
- **Max Image Size**: 20MB per image
- **Max Images**: 50 images per conversion
- **Session Timeout**: 30 minutes
- **Supported Formats**: PNG, JPG, JPEG, GIF, BMP, TIFF, WebP

## 🛠️ Tech Stack

- **Framework**: Flask 3.0.0
- **WSGI Server**: Gunicorn 21.2.0 with Gevent workers
- **Image Processing**: img2pdf 0.5.1 + Pillow 11.0.0
- **Python Version**: 3.11.9

## 🌐 API Endpoints

### POST /image-to-pdf
Convert multiple images to a single PDF

**Request**:
```bash
curl -X POST http://localhost:5005/image-to-pdf \
  -F "images=@image1.jpg" \
  -F "images=@image2.png"
```

**Response**:
```json
{
  "success": true,
  "sessionId": "abc123...",
  "imageCount": 2,
  "processingTime": 234.56,
  "message": "Successfully converted 2 images to PDF"
}
```

### GET /download/:sessionId
Download the converted PDF

**Request**:
```bash
curl http://localhost:5005/download/abc123... -o output.pdf
```

### DELETE /session/:sessionId
Manually cleanup a session

### GET /health
Health check endpoint

**Response**:
```json
{
  "status": "healthy",
  "service": "image-to-pdf",
  "timestamp": "2024-12-11T10:30:00",
  "active_sessions": 5
}
```

## 🚂 Railway Deployment

### Environment Variables
```env
PORT=5005
RAILWAY_ENVIRONMENT=production
SECRET_KEY=your-secret-key-here
LOG_LEVEL=info
```

### Deploy Command
```bash
railway up
```

The service will automatically use the `railway.toml` configuration.

## 🐳 Docker Deployment

### Build Image
```bash
docker build -t imgtopdf-backend .
```

### Run Container
```bash
docker run -p 5005:5005 \
  -e PORT=5005 \
  -e SECRET_KEY=your-secret-key \
  imgtopdf-backend
```

## 💻 Local Development

### Setup
```bash
cd python
pip install -r requirements.txt
```

### Run Development Server
```bash
python app.py
```

### Run with Gunicorn (Production Mode)
```bash
gunicorn --config gunicorn.conf.py app:app
```

## 🔒 Security Features

- **CORS Protection**: Configured for specific origins
- **File Validation**: Extension and content validation
- **Size Limits**: Prevents resource exhaustion
- **Session Expiry**: Automatic cleanup of old sessions
- **Security Headers**: HSTS, X-Frame-Options, CSP
- **Non-root User**: Docker container runs as non-root

## 📊 Performance

- **Worker Configuration**: Auto-scales based on CPU cores
- **Async I/O**: Gevent for concurrent request handling
- **Preload App**: Faster worker startup
- **Connection Pooling**: Efficient resource usage
- **Graceful Shutdown**: Proper cleanup on exit

## 🔧 Configuration

Edit `gunicorn.conf.py` to customize:
- Worker count
- Timeout values
- Logging format
- Connection limits

## 📝 Logging

All requests and errors are logged with timestamps:
```
2024-12-11 10:30:00 - app - INFO - Session abc123: Converted 3 images to PDF in 245.12ms
```

## 🧪 Testing

Test the health endpoint:
```bash
curl http://localhost:5005/health
```

Test image conversion:
```bash
curl -X POST http://localhost:5005/image-to-pdf \
  -F "images=@test.jpg" \
  | jq .
```

## 🐛 Troubleshooting

### Large File Uploads
Increase `MAX_CONTENT_LENGTH` in `app.py`

### Worker Timeout
Increase `timeout` in `gunicorn.conf.py`

### Memory Issues
Reduce `workers` count or implement Redis session storage

## 📦 Dependencies

See `requirements.txt` for complete list:
- flask==3.0.0
- flask-cors==4.0.0
- img2pdf==0.5.1
- Pillow==11.0.0
- gunicorn==21.2.0
- gevent==24.2.1

## 🎯 Production Checklist

- ✅ Session-based architecture
- ✅ File validation and size limits
- ✅ Security headers configured
- ✅ Error handling and logging
- ✅ Health check endpoint
- ✅ Auto cleanup mechanism
- ✅ Gunicorn with Gevent workers
- ✅ Railway deployment ready
- ✅ Docker support
- ✅ Environment variable configuration

## 📄 License

Part of AllFileChanger project.
