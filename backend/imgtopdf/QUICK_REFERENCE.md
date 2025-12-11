# 🚀 Quick Reference Card - Image to PDF Backend

## 📍 Service Info
- **Port**: 5005 (local) / Auto-assigned (Railway)
- **Health Check**: `/health`
- **Max Upload**: 100MB total
- **Max Image**: 20MB each
- **Max Count**: 50 images
- **Timeout**: 30 minutes

## 🌐 API Endpoints

```bash
# Health Check
GET /health

# Convert Images to PDF
POST /image-to-pdf
  Form-data: images[] (multiple files)
  Returns: { sessionId, imageCount, processingTime }

# Download PDF
GET /download/:sessionId
  Returns: PDF file (application/pdf)

# Delete Session
DELETE /session/:sessionId
```

## 🔧 Quick Start

### Local Development
```bash
cd backend/imgtopdf/python
pip install -r requirements.txt
python app.py
```

### Production (Gunicorn)
```bash
cd backend/imgtopdf/python
gunicorn --config gunicorn.conf.py app:app
```

### Test
```bash
cd backend/imgtopdf
python test_backend.py
```

## 🚂 Railway Deploy

```bash
# CLI
railway login
railway init
railway up

# Or push to GitHub and deploy via Dashboard
```

## 🔑 Environment Variables

```env
PORT=5005
RAILWAY_ENVIRONMENT=production
SECRET_KEY=your-32-char-hex-key
LOG_LEVEL=info
WEB_CONCURRENCY=4
```

## 📝 Quick Test

```bash
# Health
curl http://localhost:5005/health

# Convert
curl -X POST http://localhost:5005/image-to-pdf \
  -F "images=@test.jpg" | jq .

# Download (use sessionId from above)
curl http://localhost:5005/download/[sessionId] -o output.pdf
```

## 📊 Files Overview

| File | Purpose |
|------|---------|
| `app.py` | Main Flask application |
| `requirements.txt` | Python dependencies |
| `gunicorn.conf.py` | Server configuration |
| `railway.toml` | Railway config |
| `Dockerfile` | Docker image |
| `test_backend.py` | Test suite |

## 🎯 Key Features

✅ Session-based downloads
✅ File validation
✅ Auto cleanup
✅ Security headers
✅ Multi-worker
✅ Async I/O (Gevent)
✅ Health checks
✅ Logging

## 📞 Support

- Docs: `README.md`
- Deployment: `DEPLOYMENT.md`
- Summary: `PRODUCTION_READY.md`
- Railway: https://docs.railway.app

---

**Ready to deploy!** 🎉
