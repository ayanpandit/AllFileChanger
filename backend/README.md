# 🎯 AllFileChanger - Consolidated Backend Architecture

## 💡 Cost Optimization Strategy

**Problem:** Original architecture required 16+ separate backend deployments = expensive hosting costs

**Solution:** Consolidated multiple related tools into single backend files = 3 total deployments

### Cost Comparison
- **Before:** 16 separate services × $7/month = **$112/month** ❌
- **After:** 3 consolidated services on Render free tier = **$0/month** ✅

---

## 🏗️ Architecture Overview

### Backend Structure
```
backend/
├── imagebackend/
│   ├── node/                    # High-performance image ops
│   │   ├── index.js            # 6 tools in ONE file
│   │   ├── package.json
│   │   └── render.yaml
│   └── python/                  # AI-powered image ops
│       ├── app.py              # 2 tools in ONE file
│       ├── requirements.txt
│       └── render.yaml
├── pdfbackend/
│   └── python/                  # All PDF operations
│       ├── app.py              # 5 tools in ONE file
│       ├── requirements.txt
│       └── render.yaml
└── documentbackend/            # Future: Word/Excel/PPT tools
    └── python/
        └── app.py              # All document tools in ONE file
```

---

## 🖼️ Image Backend (Node.js)

**File:** `backend/imagebackend/node/index.js`

### Consolidated Tools (6 in 1)
| Tool | Endpoint | Description |
|------|----------|-------------|
| **Compress** | `POST /compress` | Quality-based or target-size compression |
| **Convert** | `POST /convert` | JPG↔PNG↔WebP↔HEIF↔AVIF↔GIF↔TIFF |
| **Resize** | `POST /resize` | Custom dimensions with aspect ratio |
| **Rotate-Flip** | `POST /rotate-flip` | Any angle rotation + H/V flip |
| **Crop** | `POST /crop` | Extract region with coordinates |
| **Watermark** | `POST /watermark` | Add text watermarks |

### Technology Stack
- **Runtime:** Node.js 18+
- **Image Processing:** Sharp (fastest image library)
- **File Upload:** Multer
- **Server:** Express.js
- **CORS:** Enabled for frontend

### Deployment
```bash
cd backend/imagebackend/node
npm install
node index.js
```

**Render.com:**
- Deploy using `render.yaml` config
- Build: `npm install`
- Start: `node index.js`
- Port: Auto-assigned by Render
- Health check: `/health`

---

## 🖼️ Image Backend (Python)

**File:** `backend/imagebackend/python/app.py`

### Consolidated Tools (2 in 1)
| Tool | Endpoint | Description |
|------|----------|-------------|
| **Remove Background** | `POST /remove-background` | AI-powered background removal (rembg) |
| **Image Editor** | `POST /edit` | Brightness, contrast, saturation, blur, etc. |

### Technology Stack
- **Runtime:** Python 3.11
- **AI Model:** rembg (U2-Net neural network)
- **Image Library:** Pillow (PIL)
- **Server:** Flask + Gunicorn
- **CORS:** Enabled

### Deployment
```bash
cd backend/imagebackend/python
pip install -r requirements.txt
gunicorn -w 2 -b 0.0.0.0:5001 app:app --timeout 300
```

**Render.com:**
- Deploy using `render.yaml` config
- Build: `pip install -r requirements.txt`
- Start: `gunicorn -w 2 -b 0.0.0.0:$PORT app:app --timeout 300`
- Workers: 2 (AI models are memory-intensive)
- Timeout: 300s (background removal takes time)

---

## 📄 PDF Backend (Python)

**File:** `backend/pdfbackend/python/app.py`

### Consolidated Tools (5 in 1)
| Tool | Endpoint | Description |
|------|----------|-------------|
| **Image to PDF** | `POST /image-to-pdf` | Convert images to PDF |
| **Merge PDFs** | `POST /merge-pdfs` | Combine multiple PDFs |
| **Split PDF** | `POST /split-pdf` | Extract pages |
| **Protect PDF** | `POST /protect-pdf` | Add password (AES-256) |
| **Unlock PDF** | `POST /unlock-pdf` | Remove password |

### Technology Stack
- **Runtime:** Python 3.11
- **PDF Library:** PyPDF2 (manipulation)
- **Image→PDF:** img2pdf (fast conversion)
- **Server:** Flask + Gunicorn
- **CORS:** Enabled

### Deployment
```bash
cd backend/pdfbackend/python
pip install -r requirements.txt
gunicorn -w 4 -b 0.0.0.0:5002 app:app
```

**Render.com:**
- Deploy using `render.yaml` config
- Build: `pip install -r requirements.txt`
- Start: `gunicorn -w 4 -b 0.0.0.0:$PORT app:app`
- Workers: 4 (PDF ops are CPU-bound)

---

## 🚀 Deployment Guide

### Step 1: Deploy Image Backend (Node.js)
1. Create new **Web Service** on Render.com
2. Connect GitHub repo
3. Set root directory: `backend/imagebackend/node`
4. Build command: `npm install`
5. Start command: `node index.js`
6. Copy deployed URL → Update `VITE_IMAGEBACKEND_NODE_URL` in `.env`

### Step 2: Deploy Image Backend (Python)
1. Create new **Web Service** on Render.com
2. Connect GitHub repo
3. Set root directory: `backend/imagebackend/python`
4. Runtime: Python 3.11
5. Build command: `pip install -r requirements.txt`
6. Start command: `gunicorn -w 2 -b 0.0.0.0:$PORT app:app --timeout 300`
7. Copy deployed URL → Update `VITE_IMAGEBACKEND_PYTHON_URL` in `.env`

### Step 3: Deploy PDF Backend (Python)
1. Create new **Web Service** on Render.com
2. Connect GitHub repo
3. Set root directory: `backend/pdfbackend/python`
4. Runtime: Python 3.11
5. Build command: `pip install -r requirements.txt`
6. Start command: `gunicorn -w 4 -b 0.0.0.0:$PORT app:app`
7. Copy deployed URL → Update `VITE_PDFBACKEND_URL` in `.env`

---

## 🔄 Keep-Alive Mechanism

All backends include automatic keep-alive to prevent Render free tier sleep:
- **Ping interval:** Every 13 minutes (780 seconds)
- **Endpoint:** `/health`
- **Thread:** Daemon (non-blocking)

```python
# Python example (built into all Python backends)
def keep_alive():
    def ping_server():
        while True:
            time.sleep(780)  # 13 minutes
            requests.get(f"{server_url}/health", timeout=30)
```

---

## 🛠️ Local Development

### Run All Backends Locally

**Terminal 1 - Image Backend (Node):**
```bash
cd backend/imagebackend/node
npm install
node index.js
# Runs on http://localhost:5000
```

**Terminal 2 - Image Backend (Python):**
```bash
cd backend/imagebackend/python
pip install -r requirements.txt
python app.py
# Runs on http://localhost:5001
```

**Terminal 3 - PDF Backend (Python):**
```bash
cd backend/pdfbackend/python
pip install -r requirements.txt
python app.py
# Runs on http://localhost:5002
```

### Update Frontend .env for Local Dev
```bash
VITE_IMAGEBACKEND_NODE_URL=http://localhost:5000
VITE_IMAGEBACKEND_PYTHON_URL=http://localhost:5001
VITE_PDFBACKEND_URL=http://localhost:5002
```

---

## 📊 API Documentation

### Image Backend (Node.js) - Endpoints

#### 1. Compress Image
```bash
POST /compress
Content-Type: multipart/form-data

FormData:
  image: File (required)
  quality: Number (1-100, default: 80)
  targetSizeKB: Number (optional, overrides quality)

Response: Compressed image file
```

#### 2. Convert Format
```bash
POST /convert
Content-Type: multipart/form-data

FormData:
  image: File (required)
  format: String (jpg|png|webp|avif|heif|gif|tiff)

Response: Converted image file
```

#### 3. Resize Image
```bash
POST /resize
Content-Type: multipart/form-data

FormData:
  image: File (required)
  width: Number (required)
  height: Number (optional, maintains aspect ratio if omitted)
  fit: String (cover|contain|fill, default: cover)

Response: Resized image file
```

#### 4. Rotate & Flip
```bash
POST /rotate-flip
Content-Type: multipart/form-data

FormData:
  image: File (required)
  rotation: Number (degrees, default: 0)
  flipHorizontal: Boolean (default: false)
  flipVertical: Boolean (default: false)

Response: Transformed image file
```

#### 5. Crop Image
```bash
POST /crop
Content-Type: multipart/form-data

FormData:
  image: File (required)
  x: Number (top-left X coordinate)
  y: Number (top-left Y coordinate)
  width: Number (crop width)
  height: Number (crop height)

Response: Cropped image file
```

#### 6. Add Watermark
```bash
POST /watermark
Content-Type: multipart/form-data

FormData:
  image: File (required)
  text: String (watermark text)
  position: String (top-left|top-right|bottom-left|bottom-right|center)
  fontSize: Number (default: 48)
  opacity: Number (0-1, default: 0.5)

Response: Watermarked image file
```

### Image Backend (Python) - Endpoints

#### 1. Remove Background
```bash
POST /remove-background
Content-Type: multipart/form-data

FormData:
  image: File (required)

Response: PNG image with transparent background
Processing time: 5-15 seconds (AI model)
```

#### 2. Edit Image
```bash
POST /edit
Content-Type: multipart/form-data

FormData:
  image: File (required)
  brightness: Number (0-2, default: 1)
  contrast: Number (0-2, default: 1)
  saturation: Number (0-2, default: 1)
  sharpness: Number (0-2, default: 1)
  blur: Number (0-10, default: 0)
  grayscale: Boolean (default: false)

Response: Edited image file
```

### PDF Backend (Python) - Endpoints

#### 1. Image to PDF
```bash
POST /image-to-pdf
Content-Type: multipart/form-data

FormData:
  images: File[] (multiple files, required)

Response: PDF file containing all images
```

#### 2. Merge PDFs
```bash
POST /merge-pdfs
Content-Type: multipart/form-data

FormData:
  pdfs: File[] (minimum 2 files, required)

Response: Merged PDF file
```

#### 3. Split PDF
```bash
POST /split-pdf
Content-Type: multipart/form-data

FormData:
  pdf: File (required)
  pages: String ("all" or "1-3,5,7-9")

Response: Split PDF file
```

#### 4. Protect PDF
```bash
POST /protect-pdf
Content-Type: multipart/form-data

FormData:
  pdf: File (required)
  password: String (required)

Response: Password-protected PDF (AES-256)
```

#### 5. Unlock PDF
```bash
POST /unlock-pdf
Content-Type: multipart/form-data

FormData:
  pdf: File (required)
  password: String (required if encrypted)

Response: Unlocked PDF file
```

---

## 🔍 Troubleshooting

### Backend won't start
```bash
# Check dependencies
npm install  # Node.js
pip install -r requirements.txt  # Python

# Check port conflicts
lsof -i :5000  # macOS/Linux
netstat -ano | findstr :5000  # Windows
```

### CORS errors in browser
- Ensure frontend URL is in CORS origins list
- Check backend logs for CORS headers
- Verify `.env` URLs match deployed backends

### Image processing errors
- **Sharp errors:** Rebuild native bindings: `npm rebuild sharp`
- **rembg errors:** Download model on first run (auto, needs internet)
- **Memory errors:** Reduce Gunicorn workers or image size

### Render deployment issues
- **Build fails:** Check `render.yaml` paths and commands
- **503 errors:** Backend is sleeping, wait 30s for wake-up
- **Timeout:** Increase timeout in `gunicorn` command

---

## 📈 Performance Tips

### Node.js Backend
- Sharp is 4-10x faster than ImageMagick
- Use streams for large files
- Consider PM2 for production clustering

### Python Backend
- rembg first run downloads 176MB model
- Background removal: 5-15s per image
- Use Pillow-SIMD for 4x faster processing

### General
- Enable HTTP/2 on Render
- Use CDN for static files
- Compress responses with gzip

---

## 📝 Future Enhancements

### Planned Features
- [ ] Document backend (Word, Excel, PowerPoint)
- [ ] Batch processing API
- [ ] WebSocket for progress updates
- [ ] Redis caching for frequent conversions
- [ ] S3 storage integration
- [ ] Rate limiting middleware
- [ ] API authentication (JWT)

### Technology Considerations
- **Document Tools:** python-docx, openpyxl, python-pptx
- **OCR:** tesseract, pytesseract
- **Video Processing:** FFmpeg (requires separate backend)

---

## 🤝 Contributing

When adding new tools:
1. **Check if fits existing backend** (image/pdf/document)
2. **Add endpoint to consolidated file** (don't create new service)
3. **Update API documentation** in this README
4. **Test locally** before deploying
5. **Update frontend** `.env.example` if new backend needed

---

## 📄 License

MIT License - See LICENSE file

---

## 💬 Support

- **Issues:** GitHub Issues
- **Docs:** This README
- **Backend Status:** Check `/health` endpoint on each service

---

**Built with ❤️ to minimize deployment costs and maximize performance**
