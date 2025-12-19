# AllFileChanger Frontend - Image Rotate & Flip Tool

Enhanced SEO-optimized frontend for the AllFileChanger platform with comprehensive image rotation and flipping capabilities.

## Features

### 🔄 Image Rotate & Flip Tool
- **Precise Rotation**: 90°, 180°, 270° clockwise/counterclockwise
- **Image Flipping**: Horizontal and vertical flip operations
- **Real-time Preview**: Live canvas preview of transformations
- **Multiple Formats**: Support for JPG, PNG, WebP, GIF, BMP, TIFF
- **Drag & Drop**: Intuitive file upload interface
- **Mobile Responsive**: Optimized for all devices
- **SEO Optimized**: Comprehensive meta tags and structured data

### 🚀 Technical Features
- React 18 with modern hooks
- Tailwind CSS for responsive design
- React Helmet for SEO optimization
- Environment variable configuration
- Error handling and validation
- Loading states and user feedback

## Environment Variables

Create `.env.local` for local development:

```env
# Image Rotate & Flip API URL
VITE_IMGROTATEFLIP_API_URL=http://localhost:5000

# Other service URLs (as needed)
VITE_IMGCOMPRESS_API_URL=https://your-imgcompress-backend.onrender.com
VITE_IMGCONVERTER_API_URL=https://your-imgconverter-backend.onrender.com
VITE_IMGRESIZER_API_URL=https://your-imgresizer-backend.onrender.com
VITE_IMGTOPDF_API_URL=https://your-imgtopdf-backend.onrender.com
```

For production, set these environment variables in your Render dashboard.

## SEO Optimization

The ImageRotateFlip component includes:

### Meta Tags
- Comprehensive title and description
- Keywords targeting image rotation searches
- Open Graph tags for social media
- Twitter Card tags
- Canonical URLs
- Robot directives

### Structured Data
- WebApplication schema
- FAQ schema with common questions
- Breadcrumb navigation
- Review and rating data
- Feature lists and provider information

### Content Structure
- Semantic HTML with proper headings
- Descriptive alt text and ARIA labels
- FAQ section for long-tail keywords
- Related tools section for internal linking
- Call-to-action sections

## Local Development

```bash
# Install dependencies
npm install --legacy-peer-deps

# Start development server
npm run dev

# Build for production
npm run build:production

# Preview production build
npm run preview
```

## Deployment to Render

### Build Configuration
- **Build Command**: `npm install --legacy-peer-deps && npm run build:production`
- **Publish Directory**: `./dist`
- **Node Version**: 18.x

### Environment Variables (Production)
Set these in your Render dashboard:

```
VITE_IMGROTATEFLIP_API_URL=https://your-imgrotateflip-backend.onrender.com
```

### Custom Headers (Optional)
Configure in Render dashboard for security:

```
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
```

## File Structure

```
src/pages/ImageRotateFlip.jsx - Main component with:
├── SEO Meta Tags & Structured Data
├── Hero Section with gradient background
├── Upload Interface with drag & drop
├── Image Processing Controls
├── Real-time Canvas Preview
├── Features Section
├── FAQ Section
├── Related Tools Section
└── Call-to-Action Section
```

## Performance Optimizations

- Lazy loading for images
- Optimized bundle size with Vite
- Code splitting for better loading
- Image compression before processing
- Error boundaries for graceful failure
- Progressive enhancement

## Browser Compatibility

- Chrome/Edge 88+
- Firefox 85+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Keywords Targeted

Primary: image rotate online, flip image online, rotate picture, image rotation tool
Secondary: 90 degree rotation, mirror image, photo rotation, flip pictures online
Long-tail: rotate image 90 degrees online free, flip image horizontally online

## Analytics & Tracking

The component is ready for:
- Google Analytics 4
- Google Search Console
- Core Web Vitals monitoring
- User interaction tracking
- Conversion funnel analysis

## Support

For issues related to:
- Frontend functionality: Check browser console
- Backend connectivity: Verify API URLs
- SEO performance: Use Google Search Console
- Performance: Use Lighthouse audits
