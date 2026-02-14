import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import PageContent from '../components/PageContent';
import { imageResizeData } from '../data/pageContentData';

// API Configuration from environment variables
const IMAGE_RESIZER_API_URL = import.meta.env.VITE_NODE_API_URL + '/api/image';

export default function ImageResize() {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [previewSrc, setPreviewSrc] = useState('');
  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('');
  const [originalSize, setOriginalSize] = useState(0);
  const [currentSize, setCurrentSize] = useState(0);
  const [sessionId, setSessionId] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [processingTime, setProcessingTime] = useState('');
  const fileInputRef = useRef(null);

  // Theme (light/dark) toggle for this page so user can see mode changes
  const [isDark, setIsDark] = useState(() => document.documentElement.classList.contains('dark'));
  useEffect(() => {
    if (isDark) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [isDark]);

  const toggleTheme = () => setIsDark(v => !v);

  // Keep in sync with global site theme changes (e.g. navbar toggle)
  useEffect(() => {
    // If another component toggles the `dark` class on <html>, update local state
    const syncIsDark = () => setIsDark(document.documentElement.classList.contains('dark'));

    const observer = new MutationObserver(() => {
      syncIsDark();
    });

    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    // Sync immediately on mount
    syncIsDark();

    return () => observer.disconnect();
  }, []);

  // Handle file drop
  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    setErrorMessage('');
    
    const droppedFiles = Array.from(e.dataTransfer.files).filter(file => 
      file.type.startsWith('image/')
    );
    
    if (droppedFiles.length > 0) {
      const selectedFile = droppedFiles[0];
      if (selectedFile.size > 50 * 1024 * 1024) {
        setErrorMessage('File too large (max 50MB)');
        return;
      }
      setFile(selectedFile);
      setPreviewSrc(URL.createObjectURL(selectedFile));
      setOriginalSize(selectedFile.size);
    }
  }, []);

  const handleDragEnter = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.size > 50 * 1024 * 1024) {
        setErrorMessage('File too large (max 50MB)');
        return;
      }
      setFile(selectedFile);
      setPreviewSrc(URL.createObjectURL(selectedFile));
      setOriginalSize(selectedFile.size);
      setErrorMessage('');
    }
  };

  const resizeImage = async () => {
    if (!file) {
      setErrorMessage('Please select an image first');
      return;
    }

    if (!width && !height) {
      setErrorMessage('Please enter at least width or height');
      return;
    }

    setIsProcessing(true);
    setErrorMessage('');
    setShowSuccess(false);

    try {
      const formData = new FormData();
      formData.append('image', file);
      if (width) formData.append('width', width);
      if (height) formData.append('height', height);

      const response = await fetch(`${IMAGE_RESIZER_API_URL}/resize`, {
        method: 'POST',
        body: formData,
        headers: {
          'X-Session-ID': sessionId || undefined
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Resize failed');
      }

      const data = await response.json();
      setPreviewSrc(data.image);
      setCurrentSize(data.currentSize);
      setSessionId(data.sessionId);
      setProcessingTime(data.processingTime);
      setShowSuccess(true);

      // Auto-hide success message
      setTimeout(() => setShowSuccess(false), 3000);

    } catch (error) {
      console.error('Resize error:', error);
      setErrorMessage(error.message || 'Failed to resize image');
    } finally {
      setIsProcessing(false);
    }
  };

  const rotateImage = async (direction) => {
    if (!sessionId) {
      setErrorMessage('Please resize an image first');
      return;
    }

    setIsProcessing(true);
    setErrorMessage('');

    try {
      const response = await fetch(`${IMAGE_RESIZER_API_URL}/resize/rotate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          direction: direction,
          sessionId: sessionId 
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Rotation failed');
      }

      const data = await response.json();
      setPreviewSrc(data.image);
      setCurrentSize(data.currentSize);
      setProcessingTime(data.processingTime);

    } catch (error) {
      console.error('Rotate error:', error);
      setErrorMessage(error.message || 'Failed to rotate image');
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadImage = async () => {
    if (!sessionId) {
      setErrorMessage('Please resize or rotate an image first');
      return;
    }

    try {
      const response = await fetch(`${IMAGE_RESIZER_API_URL}/resize/download/${sessionId}`);
      if (!response.ok) throw new Error('Download failed');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `resized-image-${Date.now()}.${file?.name?.split('.').pop() || 'png'}`;
      document.body.appendChild(a);
      a.click();

      // Mobile-friendly cleanup with delay
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      
      if (isMobile) {
        // For mobile, try opening in new tab as fallback
        setTimeout(() => {
          window.open(url, '_blank');
        }, 100);
        
        setTimeout(() => {
          window.URL.revokeObjectURL(url);
          document.body.removeChild(a);
        }, 2000);
      } else {
        setTimeout(() => {
          window.URL.revokeObjectURL(url);
          document.body.removeChild(a);
        }, 1000);
      }
    } catch (error) {
      console.error('Download error:', error);
      setErrorMessage('Failed to download image');
    }
  };

  const resetAll = () => {
    setFile(null);
    setPreviewSrc('');
    setWidth('');
    setHeight('');
    setOriginalSize(0);
    setCurrentSize(0);
    setSessionId(null);
    setErrorMessage('');
    setShowSuccess(false);
    setProcessingTime('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <>
      <Helmet>
        <title>Free Image Resizer & Rotator - Resize Images Online | AllFileChanger</title>
        <meta name="description" content="Free online image resizer and rotator. Resize images to any dimension, rotate left/right, and download instantly. Supports JPEG, PNG, WebP, GIF, and more formats. No registration required." />
        <meta name="keywords" content="image resizer, image rotator, resize images online, image dimensions, photo resizer, picture resizer, online image editor, free image tools, compress images, image optimizer" />
        
        {/* Open Graph / Social Media */}
        <meta property="og:title" content="Free Image Resizer & Rotator - Resize Images Online" />
        <meta property="og:description" content="Resize and rotate images online for free. Support for all major formats with instant preview and download." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://allfilechanger.onrender.com/image-resize" />
        <meta property="og:image" content="https://allfilechanger.onrender.com/images/image-resize-og.jpg" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Free Image Resizer & Rotator" />
        <meta name="twitter:description" content="Resize and rotate images online for free. Perfect for social media, websites, and printing." />
        <meta name="twitter:image" content="https://allfilechanger.onrender.com/images/image-resize-twitter.jpg" />
        
        {/* Technical SEO */}
        <link rel="canonical" href="https://allfilechanger.onrender.com/image-resize" />
        <meta name="robots" content="index, follow" />
        <meta name="author" content="AllFileChanger" />
        
        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "Image Resizer & Rotator",
            "description": "Free online tool to resize and rotate images with instant preview",
            "url": "https://allfilechanger.onrender.com/image-resize",
            "applicationCategory": "ImageEditingApplication",
            "operatingSystem": "Any",
            "permissions": "browser",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            },
            "featureList": [
              "Resize images to custom dimensions",
              "Rotate images left or right",
              "Support for multiple image formats",
              "Instant preview and download",
              "No registration required",
              "Completely free to use"
            ]
          })}
        </script>
      </Helmet>

      <div className={"min-h-screen " + (isDark ? 'bg-black' : 'bg-white') + ' transition-colors duration-500'}>
        {/* Compact Hero + Upload Section */}
        <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 dark:from-black dark:via-black dark:to-black relative overflow-hidden transition-all duration-500">
          <div className="absolute inset-0 bg-black/20 dark:bg-black/80"></div>
          <div className="relative w-full max-w-4xl mx-auto px-4 sm:px-6 py-8">
            
            {/* Hero Content */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-3xl mb-4 shadow-2xl transition-all duration-300 hover:scale-110">
                <span className="text-2xl text-white">🖼️</span>
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-3">
                <span className="text-yellow-300">Image Resizer</span> & Rotator
              </h1>
              <p className="text-base sm:text-lg text-blue-100 max-w-3xl mx-auto mb-3">
                Resize images to any dimension and rotate them instantly. Fast, secure, and mobile-friendly.
              </p>
            </div>

            {/* Upload Card */}
            <div className="bg-white dark:bg-black rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden transition-all duration-500">
              <div className="p-4 sm:p-6">

            {/* File Upload Area */}
            <div
              className={`relative border-2 border-dashed rounded-lg p-8 transition-all duration-300 ${
                dragActive
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500'
              }`}
              onDrop={handleDrop}
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDragOver={handleDragOver}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
              
              <div className="text-center">
                <div className="text-6xl mb-4">📁</div>
                <p className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  {file ? file.name : 'Click to upload or drag and drop'}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  JPEG, PNG, WebP, GIF, BMP, TIFF, AVIF, HEIF, HEIC
                </p>
              </div>
            </div>

            {/* Dimension Inputs */}
            {file && (
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Width (pixels)
                  </label>
                  <input
                    type="number"
                    value={width}
                    onChange={(e) => setWidth(e.target.value)}
                    placeholder="e.g., 800"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Height (pixels)
                  </label>
                  <input
                    type="number"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    placeholder="e.g., 600"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>
            )}

            {/* Action Buttons */}
            {file && (
              <div className="mt-6 flex flex-wrap gap-3 justify-center">
                <button
                  onClick={resizeImage}
                  disabled={isProcessing || (!width && !height)}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium rounded-lg transition-colors duration-200 flex items-center gap-2"
                >
                  {isProcessing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      📐 Resize Image
                    </>
                  )}
                </button>

                {/* Show rotate buttons after processing */}
                {sessionId && (
                  <>
                    <button
                      onClick={() => rotateImage('left')}
                      disabled={isProcessing}
                      className="px-6 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white font-medium rounded-lg transition-colors duration-200 flex items-center gap-2"
                    >
                      {isProcessing ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        </>
                      ) : (
                        <>⤺ Rotate Left</>
                      )}
                    </button>
                    <button
                      onClick={() => rotateImage('right')}
                      disabled={isProcessing}
                      className="px-6 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white font-medium rounded-lg transition-colors duration-200 flex items-center gap-2"
                    >
                      {isProcessing ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        </>
                      ) : (
                        <>⤻ Rotate Right</>
                      )}
                    </button>
                    <button
                      onClick={downloadImage}
                      className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors duration-200"
                    >
                      ⬇️ Download
                    </button>
                  </>
                )}

                <button
                  onClick={resetAll}
                  className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg transition-colors duration-200"
                >
                  🔄 Reset
                </button>
              </div>
            )}

            {/* Messages */}
            {errorMessage && (
              <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="text-red-700 dark:text-red-300 text-center font-medium">
                  ❌ {errorMessage}
                </p>
              </div>
            )}

            {showSuccess && (
              <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                <p className="text-green-700 dark:text-green-300 text-center font-medium">
                  ✅ Image processed successfully! {processingTime && `(${processingTime})`}
                </p>
              </div>
            )}

            {/* Image Info */}
            {originalSize > 0 && (
              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {(originalSize / 1024).toFixed(2)} KB
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Original Size</div>
                </div>
                {currentSize > 0 && (
                  <>
                    <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                        {(currentSize / 1024).toFixed(2)} KB
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">New Size</div>
                    </div>
                    <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                        {((originalSize - currentSize) / originalSize * 100).toFixed(1)}%
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Size Change</div>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
          </div>
      </section>

      {/* Preview Section */}
      {previewSrc && (
        <section className="py-8 px-4 bg-gray-50 dark:bg-gray-900 transition-all duration-500">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white dark:bg-black rounded-xl shadow-lg p-8 border border-gray-200 dark:border-gray-800">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 text-center">
                Image Preview
              </h3>
              <div className="flex justify-center">
                <img
                  src={previewSrc}
                  alt="Resized preview"
                  className="max-w-full max-h-96 rounded-lg shadow-md border border-gray-200 dark:border-gray-600"
                />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Features Section */}
      <section className="py-8 px-4 bg-white dark:bg-black transition-all duration-500">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gray-50 dark:bg-gray-900 rounded-xl shadow-lg p-8 border border-gray-200 dark:border-gray-800">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
              🌟 Powerful Image Resizing Features
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="text-center p-4">
                <div className="text-4xl mb-3">📐</div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Custom Dimensions</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Resize to any width and height while maintaining aspect ratio
                </p>
              </div>
              <div className="text-center p-4">
                <div className="text-4xl mb-3">🔄</div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Instant Rotation</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Rotate images left or right with a single click
                </p>
              </div>
              <div className="text-center p-4">
                <div className="text-4xl mb-3">👁️</div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Live Preview</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  See changes instantly before downloading
                </p>
              </div>
              <div className="text-center p-4">
                <div className="text-4xl mb-3">🚀</div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Lightning Fast</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Process images in seconds with optimized algorithms
                </p>
              </div>
              <div className="text-center p-4">
                <div className="text-4xl mb-3">🔒</div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">100% Secure</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Images processed locally, nothing stored on servers
                </p>
              </div>
              <div className="text-center p-4">
                <div className="text-4xl mb-3">🆓</div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Completely Free</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  No watermarks, no limits, no registration required
                </p>
              </div>
            </div>
          </div>

          {/* How It Works */}
          <div className={`rounded-xl p-8 mb-8 ${isDark ? 'bg-black' : 'bg-white'}`}>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
              🛠️ How to Resize Images Online
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-3">1</div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Upload Image</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Select or drag your image file
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-3">2</div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Set Dimensions</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Enter your desired width and height
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-3">3</div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Process & Preview</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Click resize and preview results
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-orange-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-3">4</div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Download</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Save your resized image
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Tools Section */}
      <section className="py-8 px-4 bg-white dark:bg-black transition-all duration-500">
        <div className="max-w-7xl mx-auto">
          <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-6 text-center`}>
            🔗 Related Tools
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link to="/image-compressor" className={`${isDark ? 'bg-black border border-gray-700' : 'bg-white border border-gray-200'} p-6 rounded-lg hover:shadow-lg transition`}>
              <div className="text-3xl mb-3">🗜️</div>
              <h3 className={`${isDark ? 'text-white' : 'text-gray-900'} font-semibold mb-2`}>Image Compressor</h3>
              <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} text-sm`}>Reduce file size while keeping quality.</p>
            </Link>

            <Link to="/image-converter" className={`${isDark ? 'bg-black border border-gray-700' : 'bg-white border border-gray-200'} p-6 rounded-lg hover:shadow-lg transition`}>
              <div className="text-3xl mb-3">🛠️</div>
              <h3 className={`${isDark ? 'text-white' : 'text-gray-900'} font-semibold mb-2`}>Image Converter</h3>
              <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} text-sm`}>Convert images between formats.</p>
            </Link>

            <Link to="/image-rotate-flip" className={`${isDark ? 'bg-black border border-gray-700' : 'bg-white border border-gray-200'} p-6 rounded-lg hover:shadow-lg transition`}>
              <div className="text-3xl mb-3">🔄</div>
              <h3 className={`${isDark ? 'text-white' : 'text-gray-900'} font-semibold mb-2`}>Rotate & Flip</h3>
              <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} text-sm`}>Quickly rotate or flip images.</p>
            </Link>

            <Link to="/image-to-pdf" className={`${isDark ? 'bg-black border border-gray-700' : 'bg-white border border-gray-200'} p-6 rounded-lg hover:shadow-lg transition`}>
              <div className="text-3xl mb-3">📄</div>
              <h3 className={`${isDark ? 'text-white' : 'text-gray-900'} font-semibold mb-2`}>Image to PDF</h3>
              <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} text-sm`}>Create PDFs from images.</p>
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-8 px-4 bg-gray-50 dark:bg-gray-900 transition-all duration-500">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            ❓ Frequently Asked Questions
          </h2>
            <div className="space-y-6">
              <details className={`${isDark ? 'bg-black' : 'bg-white'} rounded-lg p-6 shadow-sm`}>
                <summary className="font-semibold text-gray-900 dark:text-white cursor-pointer">
                  What image formats can I resize?
                </summary>
                <p className="mt-3 text-gray-600 dark:text-gray-300">
                  You can resize JPEG, PNG, WebP, GIF, BMP, TIFF, AVIF, HEIF, and HEIC image formats. All popular formats are supported.
                </p>
              </details>
              
              <details className={`${isDark ? 'bg-black' : 'bg-white'} rounded-lg p-6 shadow-sm`}>
                <summary className="font-semibold text-gray-900 dark:text-white cursor-pointer">
                  Is there a file size limit?
                </summary>
                <p className="mt-3 text-gray-600 dark:text-gray-300">
                  Yes, the maximum file size is 50MB per image. This covers most use cases while ensuring fast processing.
                </p>
              </details>
              
              <details className={`${isDark ? 'bg-black' : 'bg-white'} rounded-lg p-6 shadow-sm`}>
                <summary className="font-semibold text-gray-900 dark:text-white cursor-pointer">
                  Does resizing affect image quality?
                </summary>
                <p className="mt-3 text-gray-600 dark:text-gray-300">
                  Our tool uses advanced algorithms to maintain the best possible quality during resizing. Slight quality changes may occur when significantly reducing dimensions.
                </p>
              </details>
              
              <details className={`${isDark ? 'bg-black' : 'bg-white'} rounded-lg p-6 shadow-sm`}>
                <summary className="font-semibold text-gray-900 dark:text-white cursor-pointer">
                  Are my images stored on your servers?
                </summary>
                <p className="mt-3 text-gray-600 dark:text-gray-300">
                  No, images are processed temporarily and automatically deleted after 30 minutes. We don't store or access your images permanently.
                </p>
              </details>
              
              <details className={`${isDark ? 'bg-black' : 'bg-white'} rounded-lg p-6 shadow-sm`}>
                <summary className="font-semibold text-gray-900 dark:text-white cursor-pointer">
                  Can I batch resize multiple images?
                </summary>
                <p className="mt-3 text-gray-600 dark:text-gray-300">
                  Currently, the tool processes one image at a time for optimal performance and quality. Batch processing will be available in future updates.
                </p>
              </details>
            </div>
          </div>
      </section>
      <PageContent {...imageResizeData} />
    </div>
    </>
  );
}
