# Image Converter Backend

Professional image format conversion service supporting 10+ formats.

## Features
- Convert between JPG, PNG, WebP, AVIF, HEIF, GIF, TIFF, BMP, ICO, SVG
- Quality control (1-100%)
- Batch conversion support (up to 50 files)
- Preserve or strip metadata
- Resize during conversion
- MozJPEG optimization for JPG
- Up to 100MB file upload support

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
- `PORT` - Auto-set by Railway (default: 5002)

### Local Development
```bash
npm install
npm start
```

### Build Commands
- **Install**: `npm install`
- **Start**: `npm start`
- **Test**: `curl http://localhost:5002/health`

## API Endpoints

### POST /convert
Convert single image to target format.

**Parameters:**
- `image` (file): Image to convert
- `format` (string): Target format (jpg, png, webp, avif, heif, gif, tiff, bmp, ico, svg)
- `quality` (number): Quality level 1-100 (default: 90)
- `preserveMetadata` (boolean): Keep EXIF data (default: true)
- `resize` (object): Optional resize config

### POST /convert-batch
Convert multiple images at once (returns ZIP).

**Parameters:**
- `images` (files): Multiple images (max 50)
- `format` (string): Target format
- `quality` (number): Quality level

### GET /health
Health check endpoint.

## Supported Formats

### Input Formats
- JPG/JPEG, PNG, WebP, AVIF, HEIF, GIF, TIFF, BMP, ICO, SVG

### Output Formats
- **JPG/JPEG**: MozJPEG optimized, progressive
- **PNG**: Adaptive filtering, palette optimization
- **WebP**: Lossless/lossy with smart subsampling
- **AVIF**: Next-gen format with AV1 compression
- **HEIF**: Apple's high-efficiency format
- **GIF**: Color quantization and dithering
- **TIFF**: LZW/JPEG compression with pyramids
- **BMP**: Uncompressed bitmap
- **ICO**: Favicon format
- **SVG**: Vector tracing simulation

## Tech Stack
- Node.js + Express
- Sharp (image processing with libvips)
- Multer (file upload)
- Archiver (ZIP creation)
- CORS enabled
