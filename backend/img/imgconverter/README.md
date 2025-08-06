# 🔄 AllFileChanger Image Converter API

High-performance, production-ready image conversion API supporting 10+ formats with enterprise-grade optimizations, clustering, and memory management.

## ✨ Features

- **🎨 Universal Format Support**: JPG, PNG, WebP, AVIF, HEIF, HEIC, GIF, ICO, SVG
- **⚡ High Performance**: Multi-worker clustering with intelligent load balancing
- **🛡️ Enterprise Security**: Rate limiting, CORS protection, security headers
- **📊 Advanced Monitoring**: Health checks, metrics, and performance tracking
- **🔧 Memory Optimized**: Buffer pooling, automatic cleanup, memory pressure handling
- **🌐 Production Ready**: Render.com deployment with keep-alive functionality
- **📱 Mobile Optimized**: Automatic resizing for large images to optimize performance

## 🚀 Quick Start

### Local Development

```bash
# Clone the repository
git clone https://github.com/your-username/AllFileChanger.git
cd AllFileChanger/backend/img/imgconverter

# Install dependencies
npm install

# Start development server
npm run dev

# Or start production server
npm run prod
```

### Production Deployment

Deploy to Render.com in one click:

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy)

Or follow the [comprehensive deployment guide](./DEPLOYMENT.md).

## 📡 API Endpoints

### Image Conversion

#### `POST /convert`

Convert images between supported formats with optional quality control.

**Request:**
```http
POST /convert
Content-Type: multipart/form-data

Fields:
- image: File (required) - Image file to convert
- format: String (required) - Target format
- quality: Integer (optional, 1-100) - Compression quality (default: 85)
```

**Response:**
```http
HTTP/1.1 200 OK
Content-Type: image/[format]
Content-Disposition: attachment; filename="converted_[id].[ext]"
Content-Length: [size]
X-Conversion-Id: [unique-id]
X-Processing-Time: [ms]
X-Compression-Ratio: [percentage]

[Binary image data]
```

**Example Usage:**

```javascript
const formData = new FormData();
formData.append('image', fileInput.files[0]);
formData.append('format', 'webp');
formData.append('quality', '85');

const response = await fetch('/convert', {
    method: 'POST',
    body: formData
});

if (response.ok) {
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    // Use the converted image
} else {
    const error = await response.json();
    console.error('Conversion failed:', error.error);
}
```

### Service Information

#### `GET /`
API documentation and service information.

#### `GET /status`
Basic service status and version information.

#### `GET /health`
Comprehensive health check with metrics:
```json
{
  "status": "healthy",
  "worker": 12345,
  "uptime": "120s",
  "memory": {
    "used": "45MB",
    "total": "128MB", 
    "usage": "35%"
  },
  "cpu": {
    "load": [0.1, 0.2, 0.15],
    "usage": "250ms"
  },
  "conversions": {
    "active": 2,
    "total": 1542,
    "errors": 3,
    "avgTime": "850ms"
  }
}
```

#### `GET /metrics`
Detailed performance metrics for monitoring.

#### `GET /formats`
List of supported formats and service limits:
```json
{
  "supported": ["jpeg", "jpg", "png", "webp", "avif", "heif", "heic", "gif", "ico", "svg"],
  "limits": {
    "maxFileSize": 50,
    "maxConcurrent": 10,
    "timeout": 300000
  }
}
```

## 🎨 Supported Formats

| Format | Extension | Input | Output | Quality Control | Notes |
|--------|-----------|-------|--------|----------------|--------|
| **JPEG** | `.jpg`, `.jpeg` | ✅ | ✅ | ✅ | Most compatible format |
| **PNG** | `.png` | ✅ | ✅ | ❌ | Lossless compression |
| **WebP** | `.webp` | ✅ | ✅ | ✅ | Modern web format |
| **AVIF** | `.avif` | ✅ | ✅ | ✅ | Next-gen compression |
| **HEIF** | `.heif` | ✅ | ✅ | ✅ | Apple ecosystem |
| **HEIC** | `.heic` | ✅ | ✅ | ✅ | iPhone/iPad format |
| **GIF** | `.gif` | ✅ | ✅* | ❌ | *Converted to PNG |
| **ICO** | `.ico` | ✅ | ✅ | ❌ | Windows icons (32x32) |
| **SVG** | `.svg` | ✅ | ✅ | ❌ | Vector graphics |

## ⚙️ Configuration

### Environment Variables

```bash
NODE_ENV=production              # Environment mode
PORT=3000                       # Server port
RENDER_EXTERNAL_URL=            # Render service URL for keep-alive
MAX_FILE_SIZE=52428800         # Max file size (50MB)
MAX_CONCURRENT=10              # Max concurrent conversions
REQUEST_TIMEOUT=300000         # Request timeout (5 minutes)
CLUSTER_WORKERS=auto           # Worker count (auto = CPU cores)
```

### Performance Tuning

The API automatically optimizes performance based on:
- **Image Size**: Large images (>25MP) are auto-resized in production
- **Memory Usage**: Intelligent buffer pooling and cleanup
- **CPU Load**: Multi-worker clustering based on CPU cores
- **Concurrent Requests**: Queue-based processing with limits

## 🔧 Advanced Features

### Clustering & Load Balancing
- Multi-worker processes (one per CPU core)
- Intelligent request distribution
- Graceful worker restart on failures

### Memory Management
- Buffer pooling for efficient memory usage
- Automatic cleanup on memory pressure
- Memory usage monitoring and alerts

### Security Features
- Rate limiting (100 requests per 15 minutes per IP)
- CORS protection with whitelist
- Security headers via Helmet.js
- File type validation and sanitization

### Monitoring & Observability
- Real-time performance metrics
- Request/response tracking
- Error logging and reporting
- Health check endpoints

## 🛠️ Development

### Project Structure
```
backend/img/imgconverter/
├── server.js           # Main application
├── package.json        # Dependencies
├── render.yaml         # Render configuration  
├── DEPLOYMENT.md       # Deployment guide
└── README.md          # This file
```

### Key Dependencies
- **Express**: Web framework
- **Sharp**: High-performance image processing
- **Multer**: File upload handling
- **Helmet**: Security headers
- **CORS**: Cross-origin requests
- **Rate Limiter**: Request throttling

### Development Commands
```bash
npm run dev             # Start development server
npm run prod           # Start production server
npm run health         # Health check
npm test              # Run tests
```

## 📊 Performance Benchmarks

### Typical Processing Times
- **JPEG → WebP**: ~200-500ms
- **PNG → AVIF**: ~500-1000ms  
- **HEIC → JPG**: ~300-800ms
- **Large Images (>10MB)**: ~1-3 seconds

### Throughput
- **Concurrent Conversions**: 10 per worker
- **Workers**: CPU core count
- **Memory Usage**: ~50-100MB per worker
- **File Size Limit**: 50MB per file

## 🔐 Security

### Rate Limiting
```javascript
{
  windowMs: 15 * 60 * 1000,  // 15 minutes
  max: 100,                  // 100 requests per window
  standardHeaders: true,     // Include rate limit headers
  legacyHeaders: false      // Disable X-RateLimit-* headers
}
```

### CORS Configuration
```javascript
{
  origin: [
    'https://allfilechanger.netlify.app',
    'http://localhost:5500',
    'http://127.0.0.1:5500'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}
```

## 🚨 Error Handling

### Error Response Format
```json
{
  "error": "Error description",
  "conversionId": "conv_1234567890_abcdef",
  "processingTime": "250ms"
}
```

### Common Error Codes
- **400**: Bad request (invalid format, missing file)
- **413**: File too large (>50MB)
- **429**: Rate limit exceeded
- **500**: Internal server error
- **503**: Service busy (too many concurrent requests)

## 📈 Monitoring

### Health Check
Monitor service health at `/health` endpoint. Returns:
- Service status and uptime
- Memory and CPU usage
- Active conversions count
- Performance statistics

### Metrics
Access detailed metrics at `/metrics` for:
- Request volume and timing
- Error rates and types
- Memory usage patterns
- Worker performance stats

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: [DEPLOYMENT.md](./DEPLOYMENT.md)
- **Issues**: [GitHub Issues](https://github.com/your-username/AllFileChanger/issues)
- **Email**: support@allfilechanger.com

---

**Status**: ✅ Production Ready  
**Version**: 2.0.0  
**Last Updated**: 2024
