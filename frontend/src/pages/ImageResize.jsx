import React, { useState, useCallback, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

// API Configuration - Production backend URL
const IMAGE_RESIZER_API_URL = process.env.NODE_ENV === 'production' 
  ? 'https://allfilechangerimageresizer.onrender.com' 
  : 'http://localhost:5000';

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
      const response = await fetch(`${IMAGE_RESIZER_API_URL}/rotate`, {
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

  const downloadImage = () => {
    if (!sessionId) {
      setErrorMessage('Please resize or rotate an image first');
      return;
    }
    
    window.open(`${IMAGE_RESIZER_API_URL}/download/${sessionId}`, '_blank');
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

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900">
        {/* Hero Section */}
        <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-700 dark:to-purple-700">
          <div className="absolute inset-0 bg-black opacity-10"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
            <div className="text-center">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6">
                🖼️ Image Resizer & Rotator
              </h1>
              <p className="text-xl sm:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
                Resize images to any dimension and rotate them instantly. Free, fast, and secure with no registration required.
              </p>
              <div className="flex flex-wrap justify-center gap-4 text-blue-100">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                  Custom Dimensions
                </span>
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                  Instant Preview
                </span>
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                  One-Click Rotation
                </span>
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                  All Formats
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          
          {/* Upload Section */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-8">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Upload Your Image
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                Drag and drop an image or click to browse (max 50MB)
              </p>
            </div>

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
                      Resizing...
                    </>
                  ) : (
                    <>
                      📐 Resize Image
                    </>
                  )}
                </button>

                {sessionId && (
                  <>
                    <button
                      onClick={() => rotateImage('left')}
                      disabled={isProcessing}
                      className="px-6 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white font-medium rounded-lg transition-colors duration-200"
                    >
                      ⤺ Rotate Left
                    </button>
                    <button
                      onClick={() => rotateImage('right')}
                      disabled={isProcessing}
                      className="px-6 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white font-medium rounded-lg transition-colors duration-200"
                    >
                      ⤻ Rotate Right
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

          {/* Preview Section */}
          {previewSrc && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-8">
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
          )}

          {/* Features Section */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-8">
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
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-8 mb-8">
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

          {/* Related Tools */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
              🔗 Related Tools
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Link
                to="/image-converter"
                className="group p-6 border border-gray-200 dark:border-gray-600 rounded-lg hover:border-blue-500 hover:shadow-md transition-all duration-200"
              >
                <div className="text-3xl mb-3">🔄</div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600">
                  Image Converter
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Convert between different image formats
                </p>
              </Link>
              
              <Link
                to="/image-compressor"
                className="group p-6 border border-gray-200 dark:border-gray-600 rounded-lg hover:border-blue-500 hover:shadow-md transition-all duration-200"
              >
                <div className="text-3xl mb-3">🗜️</div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600">
                  Image Compressor
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Reduce image file sizes without quality loss
                </p>
              </Link>
              
              <Link
                to="/image-to-pdf"
                className="group p-6 border border-gray-200 dark:border-gray-600 rounded-lg hover:border-blue-500 hover:shadow-md transition-all duration-200"
              >
                <div className="text-3xl mb-3">📄</div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600">
                  Image to PDF
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Convert images to PDF documents
                </p>
              </Link>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-gray-50 dark:bg-gray-900 py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
              ❓ Frequently Asked Questions
            </h2>
            <div className="space-y-6">
              <details className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
                <summary className="font-semibold text-gray-900 dark:text-white cursor-pointer">
                  What image formats can I resize?
                </summary>
                <p className="mt-3 text-gray-600 dark:text-gray-300">
                  You can resize JPEG, PNG, WebP, GIF, BMP, TIFF, AVIF, HEIF, and HEIC image formats. All popular formats are supported.
                </p>
              </details>
              
              <details className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
                <summary className="font-semibold text-gray-900 dark:text-white cursor-pointer">
                  Is there a file size limit?
                </summary>
                <p className="mt-3 text-gray-600 dark:text-gray-300">
                  Yes, the maximum file size is 50MB per image. This covers most use cases while ensuring fast processing.
                </p>
              </details>
              
              <details className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
                <summary className="font-semibold text-gray-900 dark:text-white cursor-pointer">
                  Does resizing affect image quality?
                </summary>
                <p className="mt-3 text-gray-600 dark:text-gray-300">
                  Our tool uses advanced algorithms to maintain the best possible quality during resizing. Slight quality changes may occur when significantly reducing dimensions.
                </p>
              </details>
              
              <details className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
                <summary className="font-semibold text-gray-900 dark:text-white cursor-pointer">
                  Are my images stored on your servers?
                </summary>
                <p className="mt-3 text-gray-600 dark:text-gray-300">
                  No, images are processed temporarily and automatically deleted after 30 minutes. We don't store or access your images permanently.
                </p>
              </details>
              
              <details className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
                <summary className="font-semibold text-gray-900 dark:text-white cursor-pointer">
                  Can I batch resize multiple images?
                </summary>
                <p className="mt-3 text-gray-600 dark:text-gray-300">
                  Currently, the tool processes one image at a time for optimal performance and quality. Batch processing will be available in future updates.
                </p>
              </details>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
