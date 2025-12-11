# 🚂 Railway Deployment Guide - Image to PDF Backend

Complete guide for deploying the Image to PDF backend to Railway.app

## 📋 Prerequisites

- Railway account (https://railway.app)
- Railway CLI installed (optional)
- Git repository connected to Railway

## 🚀 Deployment Methods

### Method 1: Railway Dashboard (Recommended)

1. **Create New Project**
   - Go to https://railway.app/new
   - Click "Deploy from GitHub repo"
   - Select your repository
   - Choose the `backend/imgtopdf` directory

2. **Configure Service**
   - Railway will auto-detect Python app
   - Set the root directory: `backend/imgtopdf`
   - Railway will use `railway.toml` for configuration

3. **Set Environment Variables**
   ```
   PORT = 5005 (or leave empty, Railway auto-assigns)
   RAILWAY_ENVIRONMENT = production
   SECRET_KEY = [generate-random-key]
   LOG_LEVEL = info
   ```

4. **Deploy**
   - Click "Deploy"
   - Wait for build to complete
   - Service will be available at your Railway domain

### Method 2: Railway CLI

1. **Install Railway CLI**
   ```bash
   npm install -g @railway/cli
   ```

2. **Login**
   ```bash
   railway login
   ```

3. **Initialize Project**
   ```bash
   cd backend/imgtopdf
   railway init
   ```

4. **Link to Project**
   ```bash
   railway link
   ```

5. **Set Environment Variables**
   ```bash
   railway variables set SECRET_KEY=your-secret-key-here
   railway variables set LOG_LEVEL=info
   railway variables set RAILWAY_ENVIRONMENT=production
   ```

6. **Deploy**
   ```bash
   railway up
   ```

## 🔧 Configuration Files Explained

### railway.toml
```toml
[build]
builder = "NIXPACKS"

[deploy]
startCommand = "gunicorn --config gunicorn.conf.py app:app"
healthcheckPath = "/health"
healthcheckTimeout = 100
restartPolicyType = "ON_FAILURE"
restartPolicyMaxRetries = 10
```

- **builder**: Uses Nixpacks for automatic build detection
- **startCommand**: Production server start command
- **healthcheckPath**: Railway monitors this endpoint
- **restartPolicy**: Auto-restart on failure

### nixpacks.toml
Specifies build phases and system dependencies for Nixpacks builder.

### Procfile
Backup process definition if Railway doesn't use railway.toml.

### runtime.txt
Specifies Python version (3.11.9).

## 🌐 Environment Variables

### Required
```env
PORT                    # Auto-set by Railway
RAILWAY_ENVIRONMENT     # Set to 'production'
SECRET_KEY             # Generate: python -c "import secrets; print(secrets.token_hex(32))"
```

### Optional
```env
LOG_LEVEL              # info, debug, warning, error (default: info)
WEB_CONCURRENCY        # Number of workers (default: auto-calculated)
```

## 🔍 Health Check

Railway will automatically monitor:
```
GET https://your-app.railway.app/health
```

Expected response:
```json
{
  "status": "healthy",
  "service": "image-to-pdf",
  "timestamp": "2024-12-11T10:30:00",
  "active_sessions": 0
}
```

## 📊 Monitoring

### Railway Dashboard
- **Metrics**: CPU, Memory, Network usage
- **Logs**: Real-time application logs
- **Deployments**: History and rollback capability

### Application Logs
Access logs show:
```
2024-12-11 10:30:00 - app - INFO - 🚀 Image to PDF Backend starting...
2024-12-11 10:30:01 - app - INFO - ✅ Server ready on 0.0.0.0:5005
2024-12-11 10:30:02 - app - INFO - 👷 Workers: 4
```

## 🧪 Testing Deployment

### 1. Health Check
```bash
curl https://your-app.railway.app/health
```

### 2. Image Conversion
```bash
curl -X POST https://your-app.railway.app/image-to-pdf \
  -F "images=@test.jpg" \
  | jq .
```

Expected response:
```json
{
  "success": true,
  "sessionId": "abc123...",
  "imageCount": 1,
  "processingTime": 234.56,
  "message": "Successfully converted 1 images to PDF"
}
```

### 3. Download PDF
```bash
curl https://your-app.railway.app/download/abc123... -o output.pdf
```

## 🔒 Security Checklist

- ✅ CORS configured for production domains
- ✅ File size limits enforced (20MB per image, 100MB total)
- ✅ File validation (extension + content)
- ✅ Session timeout (30 minutes)
- ✅ Security headers (HSTS, X-Frame-Options, etc.)
- ✅ Auto cleanup of expired sessions
- ✅ Non-root user in Docker
- ✅ Secret key from environment

## ⚡ Performance Optimization

### Worker Configuration
```python
# gunicorn.conf.py
workers = multiprocessing.cpu_count() * 2 + 1
worker_class = 'gevent'  # Async I/O
worker_connections = 1000
```

### Railway Resources
- **Starter Plan**: 512MB RAM, 1 vCPU (suitable for testing)
- **Developer Plan**: 8GB RAM, 8 vCPUs (recommended for production)

### Scaling Recommendations
- Monitor active_sessions in health endpoint
- Scale workers based on CPU usage
- Consider Redis for session storage if scaling horizontally

## 🐛 Troubleshooting

### Build Fails
**Issue**: Python dependencies fail to install
**Solution**: Check `requirements.txt` versions, ensure Python 3.11

### Health Check Fails
**Issue**: Railway shows "unhealthy"
**Solution**: Verify `/health` endpoint returns 200, check timeout settings

### Memory Issues
**Issue**: Workers crashing due to OOM
**Solution**: 
- Reduce `workers` count in `gunicorn.conf.py`
- Increase Railway plan resources
- Implement session cleanup more aggressively

### Connection Timeout
**Issue**: Large file uploads timeout
**Solution**: Increase `timeout` in `gunicorn.conf.py` (default: 120s)

### CORS Errors
**Issue**: Frontend can't access backend
**Solution**: 
- Check CORS origins in `app.py`
- Verify Railway domain is allowed
- Check browser console for specific error

## 📱 Frontend Integration

Update frontend to use Railway URL:
```javascript
const API_URL = import.meta.env.VITE_IMGTOPDF_URL || 'https://your-app.railway.app';

// Convert images
const formData = new FormData();
images.forEach(img => formData.append('images', img));

const response = await fetch(`${API_URL}/image-to-pdf`, {
  method: 'POST',
  body: formData
});

const { sessionId } = await response.json();

// Download PDF
window.location.href = `${API_URL}/download/${sessionId}`;
```

## 🔄 Continuous Deployment

Railway automatically deploys on:
- Push to main branch
- Pull request merge
- Manual trigger from dashboard

### Deployment Workflow
1. Push code to GitHub
2. Railway detects changes
3. Builds using Nixpacks
4. Runs health check
5. Switches traffic to new deployment
6. Old deployment removed after success

## 💰 Cost Estimation

### Railway Pricing
- **Hobby Plan**: $5/month (500 hours execution)
- **Developer Plan**: $20/month (up to $20 usage)
- **Team Plan**: Custom pricing

### Usage Calculation
- Always-on service: ~730 hours/month
- Recommended: Developer plan with usage-based pricing
- Monitor usage in Railway dashboard

## 📚 Additional Resources

- [Railway Documentation](https://docs.railway.app)
- [Gunicorn Documentation](https://docs.gunicorn.org)
- [Flask Production Best Practices](https://flask.palletsprojects.com/en/3.0.x/deploying/)
- [img2pdf Documentation](https://gitlab.mister-muffin.de/josch/img2pdf)

## 🎯 Production Checklist

Before going live:
- [ ] Set production SECRET_KEY
- [ ] Configure CORS for production domain
- [ ] Test health check endpoint
- [ ] Test image conversion with various formats
- [ ] Test large file uploads
- [ ] Verify session cleanup works
- [ ] Enable Railway monitoring alerts
- [ ] Set up custom domain (optional)
- [ ] Configure SSL/TLS (automatic with Railway)
- [ ] Document API endpoints for frontend team

## 🆘 Support

If you encounter issues:
1. Check Railway logs: `railway logs`
2. Check application logs in Railway dashboard
3. Verify health endpoint: `curl https://your-app.railway.app/health`
4. Test locally first: `python app.py`
5. Review this guide's troubleshooting section

## 🎉 Success Indicators

Your deployment is successful when:
- ✅ Health endpoint returns 200
- ✅ Railway shows "Active" status
- ✅ Image conversion works from frontend
- ✅ PDF downloads successfully
- ✅ Sessions cleanup automatically
- ✅ Logs show no errors
- ✅ Response times < 3 seconds

---

**Ready to deploy?** Follow Method 1 (Railway Dashboard) for the easiest experience! 🚀
