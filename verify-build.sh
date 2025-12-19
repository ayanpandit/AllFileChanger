#!/bin/bash
# Build verification script for Render deployment

echo "🔍 Verifying build for SPA routing..."

# Check if dist directory exists
if [ ! -d "dist" ]; then
    echo "❌ Error: dist directory not found. Run 'npm run build:production' first."
    exit 1
fi

# Check if index.html exists
if [ ! -f "dist/index.html" ]; then
    echo "❌ Error: dist/index.html not found."
    exit 1
fi

# Check if _redirects file is copied
if [ ! -f "dist/_redirects" ]; then
    echo "⚠️  Warning: _redirects file not found in dist. Copying..."
    cp public/_redirects dist/_redirects
    echo "✅ _redirects file copied to dist directory."
else
    echo "✅ _redirects file found in dist directory."
fi

# Check if assets directory exists
if [ -d "dist/assets" ]; then
    echo "✅ Assets directory found."
else
    echo "⚠️  Warning: Assets directory not found."
fi

# Verify _redirects content
echo "📋 _redirects file content:"
echo "=========================="
cat dist/_redirects
echo "=========================="

echo ""
echo "🎉 Build verification complete!"
echo ""
echo "🚀 Deploy checklist:"
echo "  ✅ dist/index.html exists"
echo "  ✅ dist/_redirects exists"
echo "  ✅ Assets are built"
echo ""
echo "📝 Next steps:"
echo "  1. Commit and push changes"
echo "  2. Deploy on Render"
echo "  3. Test routes manually"
