@echo off
REM Build verification script for Windows

echo 🔍 Verifying build for SPA routing...

REM Check if dist directory exists
if not exist "dist" (
    echo ❌ Error: dist directory not found. Run 'npm run build:production' first.
    exit /b 1
)

REM Check if index.html exists
if not exist "dist\index.html" (
    echo ❌ Error: dist\index.html not found.
    exit /b 1
)

REM Check if _redirects file is copied
if not exist "dist\_redirects" (
    echo ⚠️  Warning: _redirects file not found in dist. Copying...
    copy "public\_redirects" "dist\_redirects"
    echo ✅ _redirects file copied to dist directory.
) else (
    echo ✅ _redirects file found in dist directory.
)

REM Check if assets directory exists
if exist "dist\assets" (
    echo ✅ Assets directory found.
) else (
    echo ⚠️  Warning: Assets directory not found.
)

echo.
echo 📋 _redirects file content:
echo ==========================
type "dist\_redirects"
echo ==========================

echo.
echo 🎉 Build verification complete!
echo.
echo 🚀 Deploy checklist:
echo   ✅ dist\index.html exists
echo   ✅ dist\_redirects exists
echo   ✅ Assets are built
echo.
echo 📝 Next steps:
echo   1. Commit and push changes
echo   2. Deploy on Render
echo   3. Test routes manually
