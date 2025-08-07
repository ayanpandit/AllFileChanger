# Image Rotate & Flip - Deployment Configuration

## URLs
- **Backend**: https://imgrotateflip.onrender.com
- **Frontend**: https://allfilechanger.onrender.com
- **Repository**: https://github.com/ayanpandit/AllFileChanger

## Backend Deployment (Render)

### Service Configuration
```
Service Type: Web Service
Name: imgrotateflip
Environment: Node
Region: US East (Ohio)
Plan: Free
```

### Build & Deploy Settings
```
Root Directory: backend/img/imgrotateflip
Build Command: npm install
Start Command: npm start
```

### Environment Variables
```
NODE_ENV=production
PORT=10000  (auto-set by Render)
```

### Auto-Deploy
- ✅ Enabled for master branch
- Deploys automatically on git push

## Frontend Deployment (Render)

### Service Configuration  
```
Service Type: Static Site
Name: allfilechanger
Build Command: npm install --legacy-peer-deps && npm run build:production
Publish Directory: ./dist
```

### Environment Variables
```
VITE_IMGROTATEFLIP_API_URL=https://imgrotateflip.onrender.com
```

## Local Development

### Backend
```bash
cd backend/img/imgrotateflip
npm install
npm run dev
# Server runs on http://localhost:5000
```

### Frontend
```bash
cd frontend
npm install --legacy-peer-deps
npm run dev
# Frontend runs on http://localhost:5173
```

## Testing Endpoints

### Backend Health Check
```
GET https://imgrotateflip.onrender.com/
GET https://imgrotateflip.onrender.com/health
```

### Image Processing
```
POST https://imgrotateflip.onrender.com/process
Content-Type: multipart/form-data
Body:
- image: [file]
- rotate: [degrees] (0, 90, 180, 270)
- flipX: [boolean] (true/false)
- flipY: [boolean] (true/false)
```

## CORS Configuration
Backend allows requests from:
- http://localhost:3000 (local React)
- http://localhost:5173 (local Vite)
- https://allfilechanger.onrender.com (production)
- https://imgrotateflip.onrender.com (testing)

## Keep-Alive Features
- ✅ 13-minute ping interval
- ✅ Memory usage logging
- ✅ Uptime monitoring
- ✅ Health check endpoint

## File Cleanup
- Original files deleted after processing
- Processed files deleted 5 seconds after download
- Automatic cleanup on errors

## Monitoring
- Console logging for all operations
- Health check endpoint for monitoring
- Memory and uptime reporting
