import React, { useState, useCallback, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

// API Configuration - Production backend URL
const IMAGE_ROTATEFLIP_API_URL = process.env.NODE_ENV === 'production' 
  ? 'https://allfilechangerimagerotateflip.onrender.com' 
  : 'http://localhost:5000';

export default function ImageRotateFlip() {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [previewSrc, setPreviewSrc] = useState('');
  const [originalSize, setOriginalSize] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [hasUploaded, setHasUploaded] = useState(false);
  const [imageKey, setImageKey] = useState(0); // Force image re-render
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
      setOriginalSize(selectedFile.size);
      uploadImage(selectedFile);
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
      setOriginalSize(selectedFile.size);
      setErrorMessage('');
      uploadImage(selectedFile);
    }
  };

  const uploadImage = async (selectedFile) => {
    setIsProcessing(true);
    setErrorMessage('');
    setShowSuccess(false);

    try {
      const formData = new FormData();
      formData.append('image', selectedFile);

      const response = await fetch(`${IMAGE_ROTATEFLIP_API_URL}/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      setPreviewSrc(data.image);
      setHasUploaded(true);
      setShowSuccess(true);

      // Auto-hide success message
      setTimeout(() => setShowSuccess(false), 3000);

    } catch (error) {
      console.error('Upload error:', error);
      setErrorMessage(error.message || 'Failed to upload image');
    } finally {
      setIsProcessing(false);
    }
  };

  const transformImage = async (type, direction) => {
    if (!hasUploaded) {
      setErrorMessage('Please upload an image first');
      return;
    }

    setIsProcessing(true);
    setErrorMessage('');

    try {
      const response = await fetch(`${IMAGE_ROTATEFLIP_API_URL}/${type}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ direction: direction })
      });

      if (!response.ok) {
        throw new Error(`${type} failed`);
      }

      const data = await response.json();
      setPreviewSrc(data.image);
      setImageKey(prev => prev + 1); // Force image re-render
      setShowSuccess(true);

      // Auto-hide success message
      setTimeout(() => setShowSuccess(false), 3000);

    } catch (error) {
      console.error('Transform error:', error);
      setErrorMessage(error.message || `Failed to ${type} image`);
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadImage = () => {
    if (!hasUploaded) {
      setErrorMessage('Please upload and transform an image first');
      return;
    }
    
    window.open(`${IMAGE_ROTATEFLIP_API_URL}/download`, '_blank');
  };

  const resetAll = () => {
    setFile(null);
    setPreviewSrc('');
    setOriginalSize(0);
    setErrorMessage('');
    setShowSuccess(false);
    setHasUploaded(false);
    setImageKey(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <>
      <Helmet>
        <title>Free Image Rotator & Flipper - Rotate & Flip Images Online | AllFileChanger</title>
        <meta name="description" content="Free online image rotator and flipper. Rotate images left/right by 90 degrees, flip horizontally or vertically. Supports all major image formats. No registration required." />
        <meta name="keywords" content="image rotator, flip images, rotate images online, image transformation, photo rotator, picture flipper, online image editor, free image tools" />
        
        {/* Open Graph / Social Media */}
        <meta property="og:title" content="Free Image Rotator & Flipper - Transform Images Online" />
        <meta property="og:description" content="Rotate and flip images online for free. Perfect for correcting orientation and creating mirror effects." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://allfilechanger.onrender.com/image-rotate-flip" />
        <meta property="og:image" content="https://allfilechanger.onrender.com/images/image-rotate-flip-og.jpg" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Free Image Rotator & Flipper" />
        <meta name="twitter:description" content="Rotate and flip images online for free. Fix orientation and create effects instantly." />
        <meta name="twitter:image" content="https://allfilechanger.onrender.com/images/image-rotate-flip-twitter.jpg" />
        
        {/* Technical SEO */}
        <link rel="canonical" href="https://allfilechanger.onrender.com/image-rotate-flip" />
        <meta name="robots" content="index, follow" />
        <meta name="author" content="AllFileChanger" />
        
        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "Image Rotator & Flipper",
            "description": "Free online tool to rotate and flip images with instant preview",
            "url": "https://allfilechanger.onrender.com/image-rotate-flip",
            "applicationCategory": "ImageEditingApplication",
            "operatingSystem": "Any",
            "permissions": "browser",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            },
            "featureList": [
              "Rotate images left or right by 90 degrees",
              "Flip images horizontally or vertically",
              "Support for all major image formats",
              "Instant preview and download",
              "No registration required",
              "Completely free to use"
            ]
          })}
        </script>
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-green-900">
        {/* Hero Section */}
        <div className="relative overflow-hidden bg-gradient-to-r from-green-600 to-blue-600 dark:from-green-700 dark:to-blue-700">
          <div className="absolute inset-0 bg-black opacity-10"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
            <div className="text-center">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6">
                🌀 Image Rotator & Flipper
              </h1>
              <p className="text-xl sm:text-2xl text-green-100 mb-8 max-w-3xl mx-auto">
                Rotate and flip images instantly. Fix orientation issues or create mirror effects with one click.
              </p>
              <div className="flex flex-wrap justify-center gap-4 text-green-100">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-yellow-400 rounded-full"></span>
                  90° Rotation
                </span>
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-yellow-400 rounded-full"></span>
                  Horizontal Flip
                </span>
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-yellow-400 rounded-full"></span>
                  Vertical Flip
                </span>
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-yellow-400 rounded-full"></span>
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
              className={`relative border-2 border-dashed rounded-lg p-8 transition-all duration-300 cursor-pointer ${
                dragActive
                  ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                  : 'border-gray-300 dark:border-gray-600 hover:border-green-400 dark:hover:border-green-500'
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

            {/* Action Buttons */}
            {hasUploaded && (
              <div className="mt-8">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 text-center">
                  Transform Your Image
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <button
                    onClick={() => transformImage('rotate', 'left')}
                    disabled={isProcessing}
                    className="px-4 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium rounded-lg transition-all duration-200 flex flex-col items-center gap-2 transform hover:scale-105 active:scale-95 disabled:scale-100"
                  >
                    <span className="text-2xl transition-transform duration-300 hover:rotate-[-90deg]">⤺</span>
                    <span className="text-sm">Rotate Left</span>
                  </button>

                  <button
                    onClick={() => transformImage('rotate', 'right')}
                    disabled={isProcessing}
                    className="px-4 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium rounded-lg transition-all duration-200 flex flex-col items-center gap-2 transform hover:scale-105 active:scale-95 disabled:scale-100"
                  >
                    <span className="text-2xl transition-transform duration-300 hover:rotate-[90deg]">⤻</span>
                    <span className="text-sm">Rotate Right</span>
                  </button>

                  <button
                    onClick={() => transformImage('flip', 'horizontal')}
                    disabled={isProcessing}
                    className="px-4 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white font-medium rounded-lg transition-all duration-200 flex flex-col items-center gap-2 transform hover:scale-105 active:scale-95 disabled:scale-100"
                  >
                    <span className="text-2xl transition-transform duration-300 hover:scale-x-[-1]">↔️</span>
                    <span className="text-sm">Flip Horizontal</span>
                  </button>

                  <button
                    onClick={() => transformImage('flip', 'vertical')}
                    disabled={isProcessing}
                    className="px-4 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white font-medium rounded-lg transition-all duration-200 flex flex-col items-center gap-2 transform hover:scale-105 active:scale-95 disabled:scale-100"
                  >
                    <span className="text-2xl transition-transform duration-300 hover:scale-y-[-1]">↕️</span>
                    <span className="text-sm">Flip Vertical</span>
                  </button>
                </div>

                <div className="mt-6 flex flex-wrap gap-3 justify-center">
                  <button
                    onClick={downloadImage}
                    className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors duration-200 flex items-center gap-2"
                  >
                    <span>⬇️</span>
                    Download Image
                  </button>

                  <button
                    onClick={resetAll}
                    className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg transition-colors duration-200 flex items-center gap-2"
                  >
                    <span>🔄</span>
                    Start Over
                  </button>
                </div>
              </div>
            )}

            {/* Processing Indicator */}
            {isProcessing && (
              <div className="mt-4 flex items-center justify-center gap-3">
                <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-gray-600 dark:text-gray-300">Processing image...</span>
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
                  ✅ Image processed successfully!
                </p>
              </div>
            )}

            {/* Image Info */}
            {originalSize > 0 && (
              <div className="mt-6 text-center">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg inline-block">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {(originalSize / 1024).toFixed(2)} KB
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Original Size</div>
                </div>
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
                  key={imageKey}
                  src={previewSrc}
                  alt="Transformed preview"
                  className="max-w-full max-h-96 rounded-lg shadow-md border border-gray-200 dark:border-gray-600 transition-all duration-500 ease-in-out"
                  style={{ 
                    transform: isProcessing ? 'scale(0.95)' : 'scale(1)',
                    opacity: isProcessing ? 0.7 : 1 
                  }}
                />
              </div>
            </div>
          )}

          {/* Features Section */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
              🌟 Image Transformation Features
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center p-4">
                <div className="text-4xl mb-3">⤺</div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Rotate Left</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Rotate images counterclockwise by 90 degrees
                </p>
              </div>
              <div className="text-center p-4">
                <div className="text-4xl mb-3">⤻</div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Rotate Right</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Rotate images clockwise by 90 degrees
                </p>
              </div>
              <div className="text-center p-4">
                <div className="text-4xl mb-3">↔️</div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Flip Horizontal</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Mirror images horizontally (left-right)
                </p>
              </div>
              <div className="text-center p-4">
                <div className="text-4xl mb-3">↕️</div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Flip Vertical</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Mirror images vertically (up-down)
                </p>
              </div>
            </div>
          </div>

          {/* How It Works */}
          <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-xl p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
              🛠️ How to Rotate & Flip Images
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-3">1</div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Upload Image</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Select or drag your image file
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-3">2</div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Choose Transform</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Click rotate or flip buttons
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-3">3</div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Preview Result</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  See instant transformation preview
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-orange-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-3">4</div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Download</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Save your transformed image
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
                to="/image-resize"
                className="group p-6 border border-gray-200 dark:border-gray-600 rounded-lg hover:border-green-500 hover:shadow-md transition-all duration-200"
              >
                <div className="text-3xl mb-3">📏</div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-green-600">
                  Image Resizer
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Resize images to custom dimensions
                </p>
              </Link>
              
              <Link
                to="/image-converter"
                className="group p-6 border border-gray-200 dark:border-gray-600 rounded-lg hover:border-green-500 hover:shadow-md transition-all duration-200"
              >
                <div className="text-3xl mb-3">🔄</div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-green-600">
                  Image Converter
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Convert between different image formats
                </p>
              </Link>
              
              <Link
                to="/image-compressor"
                className="group p-6 border border-gray-200 dark:border-gray-600 rounded-lg hover:border-green-500 hover:shadow-md transition-all duration-200"
              >
                <div className="text-3xl mb-3">🗜️</div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-green-600">
                  Image Compressor
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Reduce image file sizes without quality loss
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
                  What's the difference between rotating and flipping?
                </summary>
                <p className="mt-3 text-gray-600 dark:text-gray-300">
                  Rotating turns the image by 90 degrees clockwise or counterclockwise. Flipping creates a mirror image either horizontally (left-right) or vertically (up-down).
                </p>
              </details>
              
              <details className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
                <summary className="font-semibold text-gray-900 dark:text-white cursor-pointer">
                  Can I apply multiple transformations?
                </summary>
                <p className="mt-3 text-gray-600 dark:text-gray-300">
                  Yes! You can apply transformations sequentially. For example, you can rotate an image and then flip it horizontally.
                </p>
              </details>
              
              <details className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
                <summary className="font-semibold text-gray-900 dark:text-white cursor-pointer">
                  Does transformation affect image quality?
                </summary>
                <p className="mt-3 text-gray-600 dark:text-gray-300">
                  No, rotating and flipping are lossless operations. Your image quality will remain exactly the same.
                </p>
              </details>
              
              <details className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
                <summary className="font-semibold text-gray-900 dark:text-white cursor-pointer">
                  What image formats are supported?
                </summary>
                <p className="mt-3 text-gray-600 dark:text-gray-300">
                  We support all major formats: JPEG, PNG, WebP, GIF, BMP, TIFF, AVIF, HEIF, and HEIC.
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
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
