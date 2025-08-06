# AllFileChanger Image Converter API - Render Deployment Guide

## 🚀 Production Deployment on Render.com

This comprehensive guide will help you deploy your high-performance image converter API to Render.com with enterprise-grade configurations.

### ✅ Pre-Deployment Checklist

- [x] Production-ready server with clustering and memory management
- [x] Comprehensive format support (JPG, PNG, WebP, AVIF, HEIF, HEIC, GIF, ICO, SVG)
- [x] CORS configured for `allfilechanger.netlify.app`
- [x] Rate limiting and security headers
- [x] Health checks and monitoring endpoints
- [x] Keep-alive service to prevent sleeping
- [x] Optimized memory usage and buffer pooling
- [x] Graceful error handling and logging

### 📋 Step-by-Step Deployment

#### 1. **Prepare Your Repository**

Ensure your `backend/img/imgconverter/` directory contains:
```
backend/img/imgconverter/
├── server.js           # Main application file
├── package.json        # Dependencies and scripts
├── render.yaml         # Render configuration
├── DEPLOYMENT.md       # This guide
└── README.md          # API documentation
```

#### 2. **Deploy to Render**

1. **Login to Render.com** and connect your GitHub repository
2. **Create New Web Service** with these settings:
   - **Name**: `allfilechanger-image-converter`
   - **Root Directory**: `backend/img/imgconverter`
   - **Environment**: `Node`
   - **Build Command**: `npm install --production`
   - **Start Command**: `npm run prod`

#### 3. **Environment Variables**

Set these environment variables in Render dashboard:

```bash
NODE_ENV=production
PORT=10000
RENDER_EXTERNAL_URL=https://your-service-name.onrender.com
```

#### 4. **Advanced Configuration**

**Instance Type**: Choose based on your needs
- **Starter**: $7/month (512MB RAM) - Good for testing
- **Standard**: $25/month (2GB RAM) - Recommended for production
- **Pro**: $85/month (8GB RAM) - High volume usage

**Health Check**: 
- **Path**: `/health`
- **Protocol**: `HTTP`

#### 5. **Custom Domain (Optional)**

If you have a custom domain:
1. Go to **Settings → Custom Domains**
2. Add your domain (e.g., `api.allfilechanger.com`)
3. Configure DNS with provided CNAME

### 🔧 Post-Deployment Configuration

#### Update Frontend URLs

Once deployed, update your frontend to use the production URL:

```javascript
// In your React components, replace:
const API_URL = 'http://localhost:3000';

// With your Render URL:
const API_URL = 'https://your-service-name.onrender.com';
```

#### Test the Deployment

1. **Health Check**: Visit `https://your-service-name.onrender.com/health`
2. **API Status**: Visit `https://your-service-name.onrender.com/status`
3. **Supported Formats**: Visit `https://your-service-name.onrender.com/formats`

### 📊 Monitoring & Performance

#### Key Endpoints for Monitoring

- `GET /health` - Basic health check with metrics
- `GET /metrics` - Detailed performance metrics
- `GET /status` - Service status and version
- `GET /formats` - Supported formats and limits

#### Performance Optimizations Included

✅ **Clustering**: Multi-worker processes for better CPU utilization  
✅ **Memory Management**: Intelligent buffer pooling and cleanup  
✅ **Rate Limiting**: 100 requests per 15 minutes per IP  
✅ **Compression**: Gzip compression for responses  
✅ **Security**: Helmet.js security headers  
✅ **Keep-Alive**: RenderKeepAlive service prevents sleeping  
✅ **Image Optimization**: Automatic resizing for large images  
✅ **Format Fallbacks**: Graceful degradation for unsupported formats  

### 🛠️ Troubleshooting

#### Common Issues

**1. Memory Errors**
- Solution: Upgrade to higher RAM tier or optimize image sizes

**2. Timeout Issues** 
- Check: Request timeout is set to 300 seconds
- Solution: Optimize large image processing

**3. CORS Errors**
- Verify: Frontend URL is in CORS whitelist
- Check: `allfilechanger.netlify.app` is configured

**4. Keep-Alive Not Working**
- Verify: `RENDER_EXTERNAL_URL` environment variable is set
- Check: RenderKeepAlive logs in console

#### Debug Commands

```bash
# Check service health
curl https://your-service-name.onrender.com/health

# Test image conversion
curl -X POST https://your-service-name.onrender.com/convert \
  -F "image=@test.jpg" \
  -F "format=webp" \
  -F "quality=85" \
  -O -J

# View metrics
curl https://your-service-name.onrender.com/metrics
```

### 📈 Scaling Considerations

#### Traffic Handling
- **Current Config**: 10 concurrent conversions per worker
- **Multiple Workers**: CPU core count determines worker processes
- **Rate Limiting**: 100 requests per 15 minutes per IP

#### Upgrade Path
1. **Horizontal Scaling**: Use Render's auto-scaling features
2. **Vertical Scaling**: Upgrade to higher RAM/CPU tiers
3. **CDN Integration**: Consider Cloudflare for global distribution

### 🔐 Security Features

✅ **Helmet.js**: Security headers and XSS protection  
✅ **Rate Limiting**: Prevents abuse and DoS attacks  
✅ **File Validation**: Strict file type and size checking  
✅ **Memory Limits**: Prevents memory exhaustion attacks  
✅ **Error Sanitization**: Production errors don't leak sensitive info  
✅ **CORS Whitelist**: Only your frontend domains allowed  

### 📝 API Documentation

#### Convert Image Endpoint

```http
POST /convert
Content-Type: multipart/form-data

Fields:
- image: File (required) - Image file to convert
- format: String (required) - Output format (jpg, png, webp, etc.)
- quality: Integer (optional, 1-100) - Compression quality (default: 85)

Response: Binary image data
Headers: Conversion metadata and processing time
```

#### Example Usage

```javascript
const formData = new FormData();
formData.append('image', fileInput.files[0]);
formData.append('format', 'webp');
formData.append('quality', '90');

const response = await fetch('https://your-service-name.onrender.com/convert', {
    method: 'POST',
    body: formData
});

if (response.ok) {
    const blob = await response.blob();
    // Handle converted image
}
```

### 🎯 Success Metrics

After deployment, you should see:
- ✅ Health endpoint returning 200 OK
- ✅ All 10 image formats working
- ✅ Response times under 5 seconds for typical images
- ✅ Memory usage stable under 80%
- ✅ No service sleep issues (keep-alive working)

### 📞 Support

If you encounter issues:
1. Check Render logs for error details
2. Verify all environment variables are set
3. Test endpoints individually
4. Monitor memory and CPU usage
5. Check CORS configuration for your frontend

---

**Deployment Status**: ✅ Ready for Production  
**Last Updated**: $(date)  
**Version**: 2.0.0
