# Image Compressor Backend

Professional image compression service with target size and quality-based compression.

## Features
- Quality-based compression (JPEG, PNG, WebP)
- Target size compression with binary search algorithm
- Up to 50MB file upload support
- Professional-grade compression with mozjpeg

## Deployment on Railway

### Setup
1. Install Railway CLI:
```bash
npm install -g @railway/cli
```

2. Login to Railway:
```bash
railway login
```

3. Initialize project:
```bash
railway init
```

4. Link to your project (or create new):
```bash
railway link
```

### Deploy
```bash
railway up
```

### Environment Variables
Set in Railway dashboard:
- `PORT` - Auto-set by Railway (default: 5001)

### Local Development
```bash
npm install
npm start
```

### Build Commands
- **Install**: `npm install`
- **Start**: `npm start`
- **Test**: `curl http://localhost:5001/health`

## API Endpoints

### POST /compress
Compress images with quality or target size.

**Parameters:**
- `image` (file): Image to compress
- `quality` (number): Quality level 1-100 (default: 80)
- `targetSizeKB` (number): Target file size in KB

### GET /health
Health check endpoint.

## Tech Stack
- Node.js + Express
- Sharp (image processing)
- Multer (file upload)
- CORS enabled
