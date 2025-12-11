# Image to PDF Backend - Railway Deployment Guide

## 🚀 Quick Deploy to Railway

### Method 1: Using Railway CLI (Recommended)

1. **Install Railway CLI**
   ```bash
   npm install -g @railway/cli
   ```

2. **Login to Railway**
   ```bash
   railway login
   ```

3. **Navigate to Backend Directory**
   ```bash
   cd backend/imgtopdf/python
   ```

4. **Initialize and Deploy**
   ```bash
   railway init
   railway up
   ```

5. **Set Environment Variables**
   ```bash
   railway variables set SECRET_KEY=$(openssl rand -hex 32)
   railway variables set FRONTEND_URL=https://allfilechanger.netlify.app
   railway variables set GUNICORN_WORKERS=2
   ```

6. **Get Your URL**
   ```bash
   railway domain
   ```

### Method 2: Using Railway Dashboard

1. **Connect GitHub Repository**
   - Go to [railway.app](https://railway.app)
   - Click "New Project" → "Deploy from GitHub repo"
   - Select your `AllFileChanger` repository
   - Choose the `backend/imgtopdf/python` directory as root

2. **Configure Build Settings**
   - Builder: Nixpacks (auto-detected)
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `gunicorn --config gunicorn.conf.py app:app`
   - Root Directory: `backend/imgtopdf/python`

3. **Set Environment Variables** (in Railway Dashboard → Variables)
   ```
   SECRET_KEY=<generate-32-char-hex-string>
   FRONTEND_URL=https://allfilechanger.netlify.app
   GUNICORN_WORKERS=2
   LOG_LEVEL=INFO
   ```

4. **Generate Domain**
   - Go to Settings → Networking → Generate Domain
   - Or add custom domain

5. **Deploy**
   - Push to GitHub
   - Railway auto-deploys on push

## 🔧 Configuration

### Required Environment Variables

| Variable | Example | Description |
|----------|---------|-------------|
| `PORT` | 5005 | Auto-set by Railway |
| `SECRET_KEY` | `abc123...` | 32+ character secret |
| `FRONTEND_URL` | `https://your-frontend.com` | Your frontend URL |

### Optional Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `GUNICORN_WORKERS` | 2 | Number of worker processes |
| `LOG_LEVEL` | INFO | Logging verbosity |

## 🧪 Testing Deployment

### 1. Health Check
```bash
curl https://your-app.railway.app/health
```

Expected response:
```json
{
  "status": "healthy",
  "service": "image-to-pdf",
  "version": "2.0.0",
  "activeSessions": 0,
  "timestamp": "2025-12-11T..."
}
```

### 2. Test Image Conversion
```bash
curl -X POST https://your-app.railway.app/image-to-pdf \
  -F "images=@test-image.jpg" \
  -o response.json
```

### 3. Test Download
```bash
# Extract sessionId from response.json
curl https://your-app.railway.app/download/<sessionId> -o test.pdf
```

## 📊 Monitoring

### View Logs
```bash
railway logs
```

### Check Metrics
- Go to Railway Dashboard → Your Project → Metrics
- Monitor: CPU, Memory, Network, Response Times

### Health Monitoring
Set up external monitoring (UptimeRobot, Pingdom):
- URL: `https://your-app.railway.app/health`
- Interval: 5 minutes
- Expected: 200 OK

## 🔐 Security Checklist

- ✅ SECRET_KEY set to secure random value
- ✅ CORS configured with specific origins
- ✅ Security headers enabled
- ✅ File size limits enforced
- ✅ Image format validation
- ✅ Session timeout configured
- ✅ HTTPS enforced by Railway

## ⚡ Performance Optimization

### Recommended Settings for Railway

**Hobby Plan ($5/month):**
```
GUNICORN_WORKERS=2
MAX_IMAGES=30
```

**Pro Plan ($20/month):**
```
GUNICORN_WORKERS=4
MAX_IMAGES=50
```

### Auto-Scaling
Railway automatically scales based on:
- CPU usage
- Memory usage
- Request volume

## 🐛 Troubleshooting

### Issue: Deployment Fails

**Check:**
1. Python version in `runtime.txt` matches requirements
2. All dependencies in `requirements.txt`
3. Procfile exists and is correct
4. Railway logs for specific errors

**Fix:**
```bash
railway logs --tail
```

### Issue: 502 Bad Gateway

**Causes:**
- App not listening on `$PORT`
- Health check failing
- Startup timeout

**Fix:**
- Check logs: `railway logs`
- Verify `gunicorn` is running
- Increase startup timeout in railway.json

### Issue: CORS Errors

**Fix:**
Update `FRONTEND_URL` environment variable:
```bash
railway variables set FRONTEND_URL=https://your-actual-frontend.com
```

### Issue: High Memory Usage

**Fix:**
```bash
railway variables set GUNICORN_WORKERS=1
```

### Issue: Slow Response Times

**Causes:**
- Large images
- Too many concurrent requests
- Low worker count

**Fix:**
- Optimize images before upload
- Increase `GUNICORN_WORKERS`
- Upgrade Railway plan

## 📈 Scaling Guidelines

### Vertical Scaling (Increase Resources)
1. Go to Railway Dashboard → Settings
2. Increase Memory/CPU allocation
3. Restart service

### Horizontal Scaling (More Workers)
```bash
railway variables set GUNICORN_WORKERS=4
```

## 🔄 CI/CD Pipeline

### Auto-Deploy on Git Push

Railway automatically deploys when you push to your repository:

1. Make changes to code
2. Commit and push:
   ```bash
   git add .
   git commit -m "Update image to PDF backend"
   git push origin master
   ```
3. Railway detects changes and deploys

### Manual Deploy
```bash
railway up
```

## 💰 Cost Optimization

### Free Tier
- $5 free credits per month
- 500 hours execution time
- Sufficient for testing

### Hobby Plan ($5/month)
- Unlimited execution time
- 8GB RAM, 8vCPU
- Good for small-medium traffic

### Pro Plan ($20/month)
- Priority support
- More resources
- Better performance

## 📞 Support

### Railway Support
- Docs: [docs.railway.app](https://docs.railway.app)
- Discord: [discord.gg/railway](https://discord.gg/railway)
- Email: team@railway.app

### App Issues
- Check logs: `railway logs`
- Review README.md for API documentation
- Test locally first: `python app.py`

## ✅ Post-Deployment Checklist

- [ ] Health endpoint returns 200 OK
- [ ] Image conversion works
- [ ] Download works
- [ ] CORS configured correctly
- [ ] Environment variables set
- [ ] Monitoring set up
- [ ] Frontend URL updated
- [ ] Domain configured (if custom)
- [ ] SSL certificate active (auto by Railway)
- [ ] Logs readable and informative

## 🎯 Next Steps

1. **Update Frontend**: Change API URL to Railway domain
   ```javascript
   const API_URL = 'https://your-app.railway.app';
   ```

2. **Test Integration**: Verify frontend → backend communication

3. **Set Up Monitoring**: Add health checks with external service

4. **Configure Alerts**: Set up Railway notifications for errors

5. **Document API**: Share API documentation with team

---

**Deployment Complete!** 🎉

Your Image to PDF backend is now running on Railway with production-grade configuration.
