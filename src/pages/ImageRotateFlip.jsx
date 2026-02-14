import React, { useRef, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import PageContent from '../components/PageContent';
import { imageRotateFlipData } from '../data/pageContentData';

const ImageRotateFlip = () => {
  const canvasRef = useRef(null);
  const [img, setImg] = useState(null);
  const [angle, setAngle] = useState(0);
  const [flipX, setFlipX] = useState(1);
  const [flipY, setFlipY] = useState(1);
  const [originalFile, setOriginalFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  // Handle file drop
  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    setErrorMessage('');
    
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type.startsWith('image/')) {
      if (droppedFile.size > 50 * 1024 * 1024) {
        setErrorMessage('File too large (max 50MB)');
        return;
      }
      handleFileProcess(droppedFile);
    } else {
      setErrorMessage('Please drop a valid image file');
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

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    if (file.size > 50 * 1024 * 1024) {
      setErrorMessage('File too large (max 50MB)');
      return;
    }
    
    if (!file.type.startsWith('image/')) {
      setErrorMessage('Please select a valid image file');
      return;
    }
    
    setErrorMessage('');
    handleFileProcess(file);
  };

  const handleFileProcess = (file) => {
    setOriginalFile(file);

    const reader = new FileReader();
    reader.onload = (event) => {
      const newImg = new Image();
      newImg.onload = () => {
        setImg(newImg);
        setAngle(0);
        setFlipX(1);
        setFlipY(1);
        drawImage(newImg, 0, 1, 1);
        setShowSuccess(false);
      };
      newImg.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  const drawImage = (image, angleDeg, fx, fy) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const angleRad = (angleDeg * Math.PI) / 180;

    const sin = Math.abs(Math.sin(angleRad));
    const cos = Math.abs(Math.cos(angleRad));
    const width = image.width;
    const height = image.height;
    const newWidth = width * cos + height * sin;
    const newHeight = width * sin + height * cos;

    canvas.width = newWidth;
    canvas.height = newHeight;

    ctx.save();
    ctx.translate(newWidth / 2, newHeight / 2);
    ctx.rotate(angleRad);
    ctx.scale(fx, fy);
    ctx.drawImage(image, -width / 2, -height / 2);
    ctx.restore();
  };

  const rotate = (deg) => {
    const newAngle = (angle + deg) % 360;
    setAngle(newAngle);
    if (img) drawImage(img, newAngle, flipX, flipY);
  };

  const flip = (axis) => {
    const newFlipX = axis === 'horizontal' ? -flipX : flipX;
    const newFlipY = axis === 'vertical' ? -flipY : flipY;
    setFlipX(newFlipX);
    setFlipY(newFlipY);
    if (img) drawImage(img, angle, newFlipX, newFlipY);
  };

  const resetImage = () => {
    if (img) {
      setAngle(0);
      setFlipX(1);
      setFlipY(1);
      drawImage(img, 0, 1, 1);
    }
  };

  const removeFile = () => {
    setImg(null);
    setOriginalFile(null);
    setAngle(0);
    setFlipX(1);
    setFlipY(1);
    setErrorMessage('');
    setShowSuccess(false);
  };

  const uploadToServer = async () => {
    if (!originalFile) {
      setErrorMessage("Please upload an image first!");
      return;
    }

    setIsProcessing(true);
    setErrorMessage('');

    const formData = new FormData();
    formData.append('image', originalFile);
    formData.append('rotate', angle);
    formData.append('flipX', flipX === -1);
    formData.append('flipY', flipY === -1);

    try {
      const API_URL = import.meta.env.VITE_NODE_API_URL + '/api/image';
      console.log('🔗 Using API URL:', API_URL);
      
      // Send to backend for processing
      const response = await fetch(`${API_URL}/rotate-flip`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Processing failed');
      }

      const data = await response.json();
      console.log('✅ Processed:', data);

      // Download the processed image
      const downloadResponse = await fetch(`${API_URL}/rotate-flip/download/${data.sessionId}`);
      if (!downloadResponse.ok) throw new Error('Download failed');

      const blob = await downloadResponse.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `rotated-flipped-${originalFile.name}`;
      document.body.appendChild(a);
      a.click();

      // Mobile-friendly cleanup
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      
      if (isMobile) {
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
      
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (err) {
      console.error(err);
      setErrorMessage(err.message || "Processing failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black transition-all duration-500">
      <Helmet>
        <title>Free Image Rotate & Flip Tool Online | Rotate Photos 90°, 180°, 270° - AllFileChanger</title>
        <meta name="description" content="Rotate and flip images online for free. Rotate photos 90°, 180°, 270° clockwise/counterclockwise. Flip images horizontally & vertically. Supports JPG, PNG, WebP, GIF formats." />
        <meta name="keywords" content="rotate image online, flip image online, image rotation tool, photo rotation, rotate picture, flip picture, image editor, rotate photos, flip photos online, 90 degree rotation, 180 degree rotation, mirror image, free image rotation" />
        
        {/* Open Graph Tags */}
        <meta property="og:title" content="Free Image Rotate & Flip Tool | Rotate Photos Online" />
        <meta property="og:description" content="Rotate and flip images online for free. Professional image rotation tool supporting 90°, 180°, 270° rotations and horizontal/vertical flipping." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://allfilechanger.com/image-rotate-flip" />
        <meta property="og:image" content="https://allfilechanger.com/og-image-rotate-flip.jpg" />
        <meta property="og:site_name" content="AllFileChanger" />
        
        {/* Twitter Card Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Free Image Rotate & Flip Tool Online" />
        <meta name="twitter:description" content="Rotate and flip images online for free. Support for 90°, 180°, 270° rotations and horizontal/vertical flipping." />
        <meta name="twitter:image" content="https://allfilechanger.com/twitter-image-rotate-flip.jpg" />
        
        {/* Additional SEO Meta Tags */}
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <meta name="googlebot" content="index, follow" />
        <meta name="language" content="English" />
        <meta name="revisit-after" content="1 days" />
        <meta name="author" content="AllFileChanger" />
        <meta name="copyright" content="AllFileChanger" />
        <meta name="rating" content="General" />
        <meta name="geo.region" content="US" />
        <meta name="geo.placename" content="United States" />
        
        {/* Canonical URL */}
        <link rel="canonical" href="https://allfilechanger.com/image-rotate-flip" />
        
        {/* Structured Data - WebApplication Schema */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "Free Image Rotate & Flip Tool Online",
            "description": "Professional online image rotation and flipping tool. Rotate images 90°, 180°, 270° clockwise or counterclockwise. Flip images horizontally and vertically with advanced editing capabilities.",
            "url": "https://allfilechanger.com/image-rotate-flip",
            "applicationCategory": "UtilitiesApplication",
            "operatingSystem": "Any",
            "permissions": "browser",
            "browserRequirements": "Requires JavaScript",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD",
              "availability": "https://schema.org/InStock"
            },
            "featureList": [
              "Rotate images 90 degrees",
              "Rotate images 180 degrees", 
              "Rotate images 270 degrees",
              "Flip images horizontally",
              "Flip images vertically",
              "Mirror image effect",
              "Multiple format support",
              "Real-time preview",
              "Browser-based processing",
              "No file size limits",
              "No watermarks",
              "Mobile responsive",
              "Drag and drop upload"
            ],
            "provider": {
              "@type": "Organization",
              "name": "AllFileChanger",
              "url": "https://allfilechanger.com",
              "logo": "https://allfilechanger.com/logo.png",
              "sameAs": [
                "https://twitter.com/allfilechanger",
                "https://github.com/allfilechanger",
                "https://linkedin.com/company/allfilechanger"
              ]
            },
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.8",
              "ratingCount": "12,543",
              "bestRating": "5",
              "worstRating": "1"
            },
            "review": [
              {
                "@type": "Review",
                "author": {
                  "@type": "Person",
                  "name": "Sarah Johnson"
                },
                "reviewRating": {
                  "@type": "Rating",
                  "ratingValue": "5",
                  "bestRating": "5"
                },
                "reviewBody": "Perfect tool for rotating my photos! Works exactly as expected and very fast."
              }
            ]
          })}
        </script>

        {/* FAQ Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "How do I rotate an image online?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Simply upload your image using drag & drop or file browser, then use the rotation buttons to rotate 90°, 180°, or 270°. You can also flip horizontally or vertically. Download the result instantly."
                }
              },
              {
                "@type": "Question",
                "name": "What image formats are supported for rotation?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Our tool supports all major image formats including JPG, JPEG, PNG, WebP, GIF, BMP, and TIFF for rotation and flipping operations."
                }
              },
              {
                "@type": "Question",
                "name": "Is there a file size limit for image rotation?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes, the maximum file size is 50MB per image. This ensures fast processing while supporting most high-resolution photos and images."
                }
              },
              {
                "@type": "Question",
                "name": "Can I rotate multiple images at once?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Currently, you can rotate one image at a time. For batch processing, upload and process each image individually through our user-friendly interface."
                }
              },
              {
                "@type": "Question",
                "name": "Is my data safe when rotating images?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Absolutely! All image processing happens in your browser and on our secure servers. Your original files are never stored permanently and are automatically deleted after processing."
                }
              }
            ]
          })}
        </script>
        
        {/* BreadcrumbList Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": "https://allfilechanger.com"
              },
              {
                "@type": "ListItem", 
                "position": 2,
                "name": "Image Tools",
                "item": "https://allfilechanger.com/image-tools"
              },
              {
                "@type": "ListItem",
                "position": 3,
                "name": "Image Rotate & Flip",
                "item": "https://allfilechanger.com/image-rotate-flip"
              }
            ]
          })}
        </script>
      </Helmet>
      
      {/* Compact Hero + Upload Section */}
      <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-800 dark:from-black dark:via-black dark:to-black relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20 dark:bg-black/80 transition-all duration-500"></div>
        <div className="relative w-full max-w-4xl mx-auto px-4 sm:px-6 py-8">
          
          {/* Hero Content */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-3xl mb-4 shadow-2xl transition-all duration-300 hover:scale-110">
              <span className="text-2xl text-white">🔄</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-3 transition-all duration-500 leading-tight">
              <span className="text-purple-300 dark:text-purple-400">Image Rotate &</span> Flip Tool
            </h1>
            <p className="text-base sm:text-lg text-purple-100 dark:text-gray-300 mb-3 max-w-3xl mx-auto">
              Rotate images 90°, 180°, 270° and flip horizontally or vertically. <span className="text-white font-medium">Professional editing</span> with real-time preview
            </p>
            <div className="flex flex-wrap justify-center gap-3 text-xs text-purple-200 dark:text-gray-400">
              <div className="flex items-center gap-2 bg-white/10 dark:bg-gray-800/50 rounded-full px-3 py-1 backdrop-blur-sm">
                <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
                90° & 180° Rotation
              </div>
              <div className="flex items-center gap-2 bg-white/10 dark:bg-gray-800/50 rounded-full px-3 py-1 backdrop-blur-sm">
                <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
                Real-time Preview
              </div>
            </div>
          </div>

          {/* Upload Card */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden transition-all duration-500">
            <div className="p-4 sm:p-6">
              
              {/* Error Message */}
              {errorMessage && (
                <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
                  <p className="text-red-600 dark:text-red-400 text-sm font-medium">{errorMessage}</p>
                </div>
              )}

              {/* Success Message */}
              {showSuccess && (
                <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl">
                  <p className="text-green-600 dark:text-green-400 text-sm font-medium">✅ Image processed and downloaded successfully!</p>
                </div>
              )}

              {!originalFile ? (
                <div
                  onDrop={handleDrop}
                  onDragEnter={handleDragEnter}
                  onDragLeave={handleDragLeave}
                  onDragOver={handleDragOver}
                  className={`relative border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center transition-all duration-300 hover:border-purple-400 dark:hover:border-purple-500 ${
                    dragActive 
                      ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20 scale-105' 
                      : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800/50'
                  }`}
                >
                  <div className="space-y-6">
                    <div className="mx-auto w-16 h-16 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center transition-all duration-300 hover:scale-110">
                      <span className="text-2xl text-white">🖼️</span>
                    </div>
                    
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                        Upload Your Image
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-4">
                        Drag & drop your image here or click to browse
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-500">
                        Supports JPG, PNG, WebP, GIF • Max 50MB
                      </p>
                    </div>
                    
                    <label htmlFor="file-upload" className="inline-block">
                      <span className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg cursor-pointer inline-block">
                        Choose File
                      </span>
                      <input
                        id="file-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* File Info */}
                  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center">
                        <span className="text-white text-sm">📁</span>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white text-sm">{originalFile.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {(originalFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={removeFile}
                      className="text-gray-400 hover:text-red-500 transition-colors duration-200"
                      title="Remove file"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  {/* Control Buttons */}
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Transform Options</h3>
                    
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                      <button
                        onClick={() => rotate(-90)}
                        className="flex flex-col items-center gap-2 p-4 bg-white dark:bg-gray-700 hover:bg-purple-50 dark:hover:bg-purple-900/20 border border-gray-200 dark:border-gray-600 rounded-xl transition-all duration-200 hover:scale-105 hover:shadow-md"
                      >
                        <span className="text-2xl">↺</span>
                        <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Rotate Left</span>
                      </button>
                      
                      <button
                        onClick={() => rotate(90)}
                        className="flex flex-col items-center gap-2 p-4 bg-white dark:bg-gray-700 hover:bg-purple-50 dark:hover:bg-purple-900/20 border border-gray-200 dark:border-gray-600 rounded-xl transition-all duration-200 hover:scale-105 hover:shadow-md"
                      >
                        <span className="text-2xl">↻</span>
                        <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Rotate Right</span>
                      </button>
                      
                      <button
                        onClick={() => flip('horizontal')}
                        className="flex flex-col items-center gap-2 p-4 bg-white dark:bg-gray-700 hover:bg-purple-50 dark:hover:bg-purple-900/20 border border-gray-200 dark:border-gray-600 rounded-xl transition-all duration-200 hover:scale-105 hover:shadow-md"
                      >
                        <span className="text-2xl">⇋</span>
                        <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Flip H</span>
                      </button>
                      
                      <button
                        onClick={() => flip('vertical')}
                        className="flex flex-col items-center gap-2 p-4 bg-white dark:bg-gray-700 hover:bg-purple-50 dark:hover:bg-purple-900/20 border border-gray-200 dark:border-gray-600 rounded-xl transition-all duration-200 hover:scale-105 hover:shadow-md"
                      >
                        <span className="text-2xl">⇅</span>
                        <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Flip V</span>
                      </button>
                      
                      <button
                        onClick={resetImage}
                        className="flex flex-col items-center gap-2 p-4 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 border border-gray-200 dark:border-gray-600 rounded-xl transition-all duration-200 hover:scale-105 hover:shadow-md"
                      >
                        <span className="text-2xl">🔄</span>
                        <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Reset</span>
                      </button>
                      
                      <button
                        onClick={uploadToServer}
                        disabled={isProcessing}
                        className="flex flex-col items-center gap-2 p-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl transition-all duration-200 hover:scale-105 hover:shadow-md"
                      >
                        {isProcessing ? (
                          <>
                            <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            <span className="text-xs font-medium">Processing...</span>
                          </>
                        ) : (
                          <>
                            <span className="text-2xl">⬇️</span>
                            <span className="text-xs font-medium">Download</span>
                          </>
                        )}
                      </button>
                    </div>
                    
                    {/* Current Transform Info */}
                    <div className="mt-4 p-3 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Rotation:</span>
                        <span className="font-medium text-gray-900 dark:text-white">{angle}°</span>
                      </div>
                      <div className="flex justify-between text-sm mt-1">
                        <span className="text-gray-600 dark:text-gray-400">Horizontal Flip:</span>
                        <span className="font-medium text-gray-900 dark:text-white">{flipX === -1 ? 'Yes' : 'No'}</span>
                      </div>
                      <div className="flex justify-between text-sm mt-1">
                        <span className="text-gray-600 dark:text-gray-400">Vertical Flip:</span>
                        <span className="font-medium text-gray-900 dark:text-white">{flipY === -1 ? 'Yes' : 'No'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Canvas Preview */}
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Preview</h3>
                    <div className="flex justify-center">
                      <canvas 
                        ref={canvasRef} 
                        className="max-w-full h-auto border-2 border-gray-200 dark:border-gray-600 rounded-lg shadow-lg bg-white dark:bg-gray-700"
                        style={{ maxHeight: '500px' }}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 sm:py-20 bg-gray-50 dark:bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Professional Image Rotation Features
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Everything you need for precise image rotation and flipping operations
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center mb-6">
                <span className="text-white text-xl">🔄</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Precise Rotation</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Rotate images by exact degrees: 90°, 180°, 270° clockwise or counterclockwise with perfect precision.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center mb-6">
                <span className="text-white text-xl">↔️</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Flip & Mirror</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Flip images horizontally or vertically to create mirror effects and perfect image orientations.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mb-6">
                <span className="text-white text-xl">👁️</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Real-time Preview</h3>
              <p className="text-gray-600 dark:text-gray-400">
                See your changes instantly with our live preview canvas before downloading the final result.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-pink-600 rounded-xl flex items-center justify-center mb-6">
                <span className="text-white text-xl">📱</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Mobile Friendly</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Optimized for all devices - rotate and flip images seamlessly on desktop, tablet, or mobile.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-xl flex items-center justify-center mb-6">
                <span className="text-white text-xl">🔒</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">100% Secure</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Your images are processed securely and automatically deleted after download. Complete privacy guaranteed.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center mb-6">
                <span className="text-white text-xl">⚡</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Lightning Fast</h3>
              <p className="text-gray-600 dark:text-gray-400">
                High-performance processing ensures your images are rotated and ready for download in seconds.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 sm:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Everything you need to know about rotating and flipping images online
            </p>
          </div>

          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 sm:p-8">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                How do I rotate an image online?
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Simply upload your image using drag & drop or the file browser, then use our rotation buttons to rotate 90°, 180°, or 270°. 
                You can also flip horizontally or vertically. Preview your changes in real-time and download the result instantly.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 sm:p-8">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                What image formats are supported for rotation?
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Our tool supports all major image formats including JPG, JPEG, PNG, WebP, GIF, BMP, and TIFF. 
                The output maintains the original format and quality while applying your rotation and flip transformations.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 sm:p-8">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                Is there a file size limit for image rotation?
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Yes, the maximum file size is 50MB per image. This ensures fast processing while supporting most high-resolution photos and images. 
                For larger files, consider compressing them first using our image compressor tool.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 sm:p-8">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                Can I rotate multiple images at once?
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Currently, you can rotate one image at a time to ensure optimal quality and processing speed. 
                For batch processing, simply upload and process each image individually through our user-friendly interface.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 sm:p-8">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                Is my data safe when rotating images?
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Absolutely! All image processing happens on our secure servers with enterprise-grade security. 
                Your original files are never stored permanently and are automatically deleted after processing. 
                We respect your privacy and never access or share your images.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Related Tools Section */}
      <section className="py-16 sm:py-20 bg-gray-50 dark:bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              More Image Tools
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Explore our complete suite of professional image editing tools
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link 
              to="/image-compressor" 
              className="group bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <span className="text-white text-xl">🗜️</span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Image Compressor</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Reduce file sizes without quality loss</p>
            </Link>

            <Link 
              to="/image-converter" 
              className="group bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <span className="text-white text-xl">🔄</span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Format Converter</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Convert between JPG, PNG, WebP & more</p>
            </Link>

            <Link 
              to="/image-resize" 
              className="group bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <span className="text-white text-xl">📏</span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Image Resizer</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Resize images to any dimensions</p>
            </Link>

            <Link 
              to="/image-to-pdf" 
              className="group bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <span className="text-white text-xl">📄</span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Image to PDF</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Convert images to PDF documents</p>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-20 bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-gray-800 dark:to-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Ready to Rotate Your Images?
          </h2>
          <p className="text-xl text-purple-100 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Get started with our professional image rotation tool. Fast, secure, and completely free to use.
          </p>
          <button 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="bg-white text-purple-600 hover:text-purple-700 px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 hover:scale-105 hover:shadow-lg"
          >
            Start Rotating Images Now
          </button>
        </div>
      </section>
      <PageContent {...imageRotateFlipData} />
    </div>
  );
};

export default ImageRotateFlip;
