# Image Rotate & Flip Backend

Backend service for rotating and flipping images using Sharp library.

## Features
- Image rotation (90°, 180°, 270°)
- Horizontal and vertical flipping
- Multiple image format support
- CORS enabled for frontend integration

## Local Development

```bash
npm install
npm start
```

Server will run on `http://localhost:5000`

## Deployment Commands for Render

### Build Command:
```bash
npm install
```

### Start Command:
```bash
npm start
```

## Environment Variables
- `PORT`: Server port (automatically set by Render)
- `NODE_ENV`: Set to "production" for deployment

## API Endpoints

### POST /process
Upload and process an image with rotation and flip operations.

**Request:**
- `image`: Image file (multipart/form-data)
- `rotate`: Rotation angle in degrees
- `flipX`: Boolean for horizontal flip
- `flipY`: Boolean for vertical flip

**Response:**
- Processed image file

## Keep Alive
The server includes a keep-alive mechanism that pings every 13 minutes to prevent sleeping on free hosting tiers.
