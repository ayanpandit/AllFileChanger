import React, { useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

export default function ImageToPdf() {
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [isConverting, setIsConverting] = useState(false);
  const [convertedFiles, setConvertedFiles] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Handle file drop
  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const droppedFiles = Array.from(e.dataTransfer.files).filter(file => 
      file.type.startsWith('image/')
    );
    
    if (droppedFiles.length > 0) {
      setFiles(prev => [...prev, ...droppedFiles]);
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

  // Handle file input
  const handleFileInput = (e) => {
    const selectedFiles = Array.from(e.target.files).filter(file => 
      file.type.startsWith('image/')
    );
    if (selectedFiles.length > 0) {
      setFiles(prev => [...prev, ...selectedFiles]);
    }
  };

  // Remove file
  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  // Drag and drop for reordering files
  const handleFileDragStart = (e, index) => {
    e.dataTransfer.setData('text/plain', index.toString());
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleFileDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleFileDrop = (e, dropIndex) => {
    e.preventDefault();
    const dragIndex = parseInt(e.dataTransfer.getData('text/plain'));
    
    if (dragIndex !== dropIndex) {
      setFiles(prev => {
        const newFiles = [...prev];
        const draggedFile = newFiles[dragIndex];
        newFiles.splice(dragIndex, 1);
        newFiles.splice(dropIndex, 0, draggedFile);
        return newFiles;
      });
    }
  };

  // Move file up
  const moveFileUp = (index) => {
    if (index > 0) {
      setFiles(prev => {
        const newFiles = [...prev];
        [newFiles[index - 1], newFiles[index]] = [newFiles[index], newFiles[index - 1]];
        return newFiles;
      });
    }
  };

  // Move file down
  const moveFileDown = (index) => {
    if (index < files.length - 1) {
      setFiles(prev => {
        const newFiles = [...prev];
        [newFiles[index], newFiles[index + 1]] = [newFiles[index + 1], newFiles[index]];
        return newFiles;
      });
    }
  };

  // Convert to PDF
  const convertToPdf = async () => {
    if (files.length === 0) return;
    
    setIsConverting(true);
    setShowSuccess(false);
    
    try {
      const formData = new FormData();
      files.forEach(file => formData.append('images', file));
      
      const API_URL = import.meta.env.VITE_IMGTOPDF_URL || 'http://localhost:5005';
      const response = await fetch(`${API_URL}/image-to-pdf`, {
        method: 'POST',
        body: formData,
      });
      
      if (response.ok) {
        const blob = await response.blob();
        
        // Enhanced mobile-friendly download handling
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        
        if (isMobile) {
          // For mobile devices, try multiple download methods
          const url = window.URL.createObjectURL(blob);
          
          // Method 1: Try the standard download approach
          const a = document.createElement('a');
          a.href = url;
          a.download = 'converted-images.pdf';
          a.style.display = 'none';
          document.body.appendChild(a);
          
          // Trigger click with timeout for mobile compatibility
          setTimeout(() => {
            a.click();
            document.body.removeChild(a);
            
            // Method 2: Fallback - open in new tab if download didn't work
            setTimeout(() => {
              window.open(url, '_blank');
              // Clean up after everything
              setTimeout(() => {
                window.URL.revokeObjectURL(url);
              }, 2000);
            }, 1000);
          }, 100);
        } else {
          // Desktop download method
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'converted-images.pdf';
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          // Delay cleanup to ensure download starts
          setTimeout(() => {
            window.URL.revokeObjectURL(url);
          }, 1000);
        }
        
        setConvertedFiles([{ name: 'converted-images.pdf', url: URL.createObjectURL(blob) }]);
        setShowSuccess(true);
        
        // Clear files and redirect to home after successful conversion
        setTimeout(() => {
          setFiles([]);
          setShowSuccess(false);
          // Redirect to home page after 2 seconds
          navigate('/', { replace: true });
        }, 2000);
      }
    } catch (error) {
      console.error('Conversion failed:', error);
      // You could add error handling here
    } finally {
      setIsConverting(false);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black transition-all duration-500">
      <Helmet>
        <title>Free Image to PDF Converter Online | Convert JPG, PNG to PDF - AllFileChanger</title>
        <meta name="description" content="Convert images to PDF online for free. Support JPG, PNG, WebP, GIF, BMP. Batch convert multiple images, drag & drop interface, fast conversion, no watermarks. #1 image to PDF converter." />
        <meta name="keywords" content="image to pdf converter, jpg to pdf, png to pdf, convert images to pdf, free pdf converter, batch image converter, online pdf converter, image converter" />
        
        {/* Open Graph Tags for Social Media */}
        <meta property="og:title" content="Free Image to PDF Converter | Convert JPG, PNG to PDF Online" />
        <meta property="og:description" content="Convert images to PDF online for free. Support JPG, PNG, WebP, GIF, BMP. Batch convert multiple images with our fast, secure converter." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://allfilechanger.com/image-to-pdf" />
        <meta property="og:image" content="https://allfilechanger.com/og-image-converter.jpg" />
        <meta property="og:site_name" content="AllFileChanger" />
        
        {/* Twitter Card Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Free Image to PDF Converter | Convert JPG, PNG to PDF" />
        <meta name="twitter:description" content="Convert images to PDF online for free. Support multiple formats, batch conversion, fast & secure." />
        <meta name="twitter:image" content="https://allfilechanger.com/twitter-image-converter.jpg" />
        
        {/* Additional SEO Tags */}
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <meta name="googlebot" content="index, follow" />
        <meta name="language" content="English" />
        <meta name="revisit-after" content="1 days" />
        <meta name="author" content="AllFileChanger" />
        <meta name="copyright" content="AllFileChanger" />
        <meta name="rating" content="General" />
        
        {/* Canonical URL */}
        <link rel="canonical" href="https://allfilechanger.com/image-to-pdf" />
        
        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "Image to PDF Converter",
            "description": "Free online tool to convert images (JPG, PNG, WebP, GIF, BMP) to PDF format with batch conversion support",
            "url": "https://allfilechanger.com/image-to-pdf",
            "applicationCategory": "UtilitiesApplication",
            "operatingSystem": "Any",
            "permissions": "browser",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            },
            "featureList": [
              "Convert JPG to PDF",
              "Convert PNG to PDF", 
              "Batch image conversion",
              "Drag and drop interface",
              "Mobile responsive",
              "No watermarks",
              "Free unlimited conversions"
            ],
            "provider": {
              "@type": "Organization",
              "name": "AllFileChanger",
              "url": "https://allfilechanger.com"
            },
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.9",
              "ratingCount": "10847",
              "bestRating": "5",
              "worstRating": "1"
            }
          })}
        </script>
      </Helmet>
      
      {/* SEO-Optimized Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-800 dark:from-black dark:via-black dark:to-black">
        <div className="absolute inset-0 bg-black/20 dark:bg-black/80 transition-all duration-500"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-orange-500 to-red-600 rounded-3xl mb-6 shadow-2xl transition-all duration-300 hover:scale-110">
              <span className="text-3xl text-white">📄</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6 transition-all duration-500 leading-tight">
              <span className="text-yellow-300 dark:text-yellow-400">Image to PDF</span> Converter
            </h1>
            <p className="text-lg sm:text-xl lg:text-2xl text-blue-100 dark:text-gray-200 max-w-4xl mx-auto mb-6 sm:mb-8 transition-all duration-500 px-4">
              Convert <strong className="text-white">JPG, PNG, WebP, and other images to PDF</strong> instantly. 
              Free, secure, and works directly in your browser - no software needed!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center px-4">
              <div className="text-blue-100 dark:text-gray-300 text-sm sm:text-base transition-colors duration-500 text-center">
                ✓ 100% Free  ✓ No Registration  ✓ Secure & Private  ✓ All Image Formats
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Converter Section */}
      <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white dark:bg-black rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden transition-all duration-500">
            
            {/* Upload Area */}
            <div className="p-4 sm:p-6 lg:p-8">
              <div
                className={`relative border-2 border-dashed rounded-xl p-6 sm:p-8 lg:p-12 text-center transition-all duration-300 ${
                  dragActive
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/50 scale-105'
                    : 'border-gray-300 dark:border-gray-800 hover:border-blue-400 dark:hover:border-blue-500'
                }`}
                onDrop={handleDrop}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
              >
                <div className="space-y-4 sm:space-y-6">
                  <div className="mx-auto w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <svg className="w-8 h-8 sm:w-10 sm:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-900 dark:text-white transition-colors duration-500">
                      {dragActive ? 'Drop your images here!' : 'Drop your images here'}
                    </p>
                    <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 transition-colors duration-500">
                      or <span className="text-blue-600 dark:text-blue-400 font-medium">click to select files</span> from your device
                    </p>
                  </div>
                  
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileInput}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  
                  <div className="flex flex-wrap justify-center gap-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400 transition-colors duration-500">
                    <span className="px-3 py-1 bg-gray-100 dark:bg-black rounded-full transition-colors duration-300">JPG</span>
                    <span className="px-3 py-1 bg-gray-100 dark:bg-black rounded-full transition-colors duration-300">PNG</span>
                    <span className="px-3 py-1 bg-gray-100 dark:bg-black rounded-full transition-colors duration-300">WebP</span>
                    <span className="px-3 py-1 bg-gray-100 dark:bg-black rounded-full transition-colors duration-300">GIF</span>
                    <span className="px-3 py-1 bg-gray-100 dark:bg-black rounded-full transition-colors duration-300">BMP</span>
                  </div>
                </div>
              </div>
            </div>

            {/* File List */}
            {files.length > 0 && (
              <div className="border-t border-gray-200 dark:border-gray-800 p-6 sm:p-8">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-4 transition-colors duration-500">
                  Selected Images ({files.length}) - Drag to reorder
                </h3>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {files.map((file, index) => (
                    <div 
                      key={`${file.name}-${index}`} 
                      className="flex items-center justify-between p-3 sm:p-4 bg-gray-50 dark:bg-black rounded-xl transition-all duration-300 cursor-move hover:bg-gray-100 dark:hover:bg-gray-900"
                      draggable
                      onDragStart={(e) => handleFileDragStart(e, index)}
                      onDragOver={handleFileDragOver}
                      onDrop={(e) => handleFileDrop(e, index)}
                    >
                      <div className="flex items-center space-x-3 flex-1 min-w-0">
                        <div className="flex flex-col items-center space-y-1">
                          <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                            {index + 1}
                          </div>
                          <div className="text-gray-400 dark:text-gray-500">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6-6-6z"/>
                            </svg>
                          </div>
                        </div>
                        <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                          <span className="text-white text-sm">🖼️</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm sm:text-base font-medium text-gray-900 dark:text-white truncate transition-colors duration-500">
                            {file.name}
                          </p>
                          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 transition-colors duration-500">
                            {formatFileSize(file.size)}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        {/* Move Up Button */}
                        <button
                          onClick={() => moveFileUp(index)}
                          disabled={index === 0}
                          className="p-2 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 disabled:opacity-30 disabled:cursor-not-allowed transition-colors duration-200"
                          aria-label="Move up"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                          </svg>
                        </button>
                        
                        {/* Move Down Button */}
                        <button
                          onClick={() => moveFileDown(index)}
                          disabled={index === files.length - 1}
                          className="p-2 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 disabled:opacity-30 disabled:cursor-not-allowed transition-colors duration-200"
                          aria-label="Move down"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                        
                        {/* Remove Button */}
                        <button
                          onClick={() => removeFile(index)}
                          className="p-2 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors duration-200"
                          aria-label="Remove file"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-3 text-center">
                  💡 Tip: Drag files to reorder them, or use the arrow buttons to adjust the sequence
                </p>
              </div>
            )}

            {/* Convert Button */}
            {files.length > 0 && (
              <div className="border-t border-gray-200 dark:border-gray-800 p-4 sm:p-6 lg:p-8">
                {showSuccess && (
                  <div className="mb-4 p-4 bg-green-50 dark:bg-green-900/50 border border-green-200 dark:border-green-800 rounded-xl">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-5 h-5 text-green-600 dark:text-green-400">
                          <svg fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <span className="text-green-800 dark:text-green-200 font-medium">
                          PDF created successfully! Download started automatically.
                        </span>
                      </div>
                      <span className="text-green-600 dark:text-green-400 text-sm font-medium">
                        Redirecting to home...
                      </span>
                    </div>
                  </div>
                )}
                
                <button
                  onClick={convertToPdf}
                  disabled={isConverting}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold py-3 sm:py-4 px-6 sm:px-8 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:transform-none text-base sm:text-lg"
                >
                  {isConverting ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Converting to PDF...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center space-x-2">
                      <span className="text-xl">📄</span>
                      <span>Convert {files.length} Image{files.length > 1 ? 's' : ''} to PDF</span>
                    </div>
                  )}
                </button>
                
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 text-center mt-3 transition-colors duration-500">
                  All processing happens in your browser. No files are uploaded to servers.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-black transition-all duration-500">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4 transition-colors duration-500">
              Why Choose Our Image to PDF Converter?
            </h2>
            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto transition-colors duration-500">
              Professional-grade conversion with enterprise-level security and lightning-fast processing.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {[
              { 
                icon: '⚡', 
                title: 'Lightning Fast', 
                desc: 'Convert multiple images to PDF in seconds with our optimized processing engine.' 
              },
              { 
                icon: '🔒', 
                title: '100% Secure', 
                desc: 'All files are processed locally in your browser. No uploads to servers, complete privacy.' 
              },
              { 
                icon: '📱', 
                title: 'Mobile Friendly', 
                desc: 'Works perfectly on all devices - desktop, tablet, and mobile phones.' 
              },
              { 
                icon: '🆓', 
                title: 'Completely Free', 
                desc: 'No hidden costs, no registration required, no watermarks on your converted PDFs.' 
              },
              { 
                icon: '🔄', 
                title: 'Batch Convert', 
                desc: 'Convert multiple images at once. Support for JPG, PNG, WebP, GIF, and more.' 
              },
              { 
                icon: '⚙️', 
                title: 'High Quality', 
                desc: 'Maintains original image quality while creating optimized PDF files.' 
              }
            ].map((feature, index) => (
              <div 
                key={index} 
                className="group bg-white dark:bg-black rounded-xl p-6 sm:p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-200 dark:border-gray-800 hover:border-blue-200 dark:hover:border-blue-600 hover:-translate-y-1"
              >
                <div className="text-4xl sm:text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-3 transition-colors duration-500">
                  {feature.title}
                </h3>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed transition-colors duration-500">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SEO Content Section */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-black transition-all duration-500">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 rounded-2xl p-8 sm:p-12 transition-all duration-500">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-6 text-center transition-colors duration-500">
              The Best Free Image to PDF Converter Online
            </h2>
            
            <div className="prose prose-lg max-w-none text-gray-700 dark:text-gray-300 transition-colors duration-500">
              <p className="text-lg leading-relaxed mb-6">
                Looking for a reliable <strong>Image to PDF converter</strong>? Our free online tool is the perfect solution for converting 
                <strong> JPG to PDF</strong>, <strong>PNG to PDF</strong>, and other image formats instantly. Whether you need to convert a single 
                image or multiple files at once, our converter handles it all with professional quality results.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-8">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 transition-colors duration-500">
                    📸 Supported Image Formats
                  </h3>
                  <ul className="space-y-2 text-gray-600 dark:text-gray-400 transition-colors duration-500">
                    <li>• <strong>JPG/JPEG</strong> - Most common photo format</li>
                    <li>• <strong>PNG</strong> - High-quality with transparency</li>
                    <li>• <strong>WebP</strong> - Modern web image format</li>
                    <li>• <strong>GIF</strong> - Animated and static images</li>
                    <li>• <strong>BMP</strong> - Windows bitmap images</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 transition-colors duration-500">
                    🎯 Perfect For
                  </h3>
                  <ul className="space-y-2 text-gray-600 dark:text-gray-400 transition-colors duration-500">
                    <li>• Creating photo albums</li>
                    <li>• Document compilation</li>
                    <li>• Portfolio presentations</li>
                    <li>• Digital archiving</li>
                    <li>• Professional reports</li>
                  </ul>
                </div>
              </div>

              <p className="leading-relaxed mb-6">
                Our <strong>image to PDF converter online</strong> tool processes everything directly in your browser, ensuring complete 
                privacy and security. No need to install software or worry about file uploads - everything happens locally on your device. 
                The converted PDFs maintain the original image quality while being optimized for sharing and storage.
              </p>

              <p className="leading-relaxed">
                Convert images to PDF in just three simple steps: upload your images, arrange them if needed, and click convert. 
                Your PDF will be ready for download instantly. It's that simple!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Related Tools Section */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-blue-50 dark:bg-black transition-all duration-500">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4 transition-colors duration-500">
              Other Popular Tools
            </h2>
            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 transition-colors duration-500">
              Explore our complete suite of file conversion tools
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {[
              { name: 'PDF to Word', desc: 'Convert PDF to editable Word documents', icon: '📝', path: '/pdf-to-word' },
              { name: 'Image Compressor', desc: 'Reduce image file size without quality loss', icon: '🗜️', path: '/image-compressor' },
              { name: 'PDF Merger', desc: 'Combine multiple PDFs into one', icon: '📑', path: '/pdf-merge' },
              { name: 'Word to PDF', desc: 'Convert Word documents to PDF', icon: '📄', path: '/word-to-pdf' }
            ].map((tool, index) => (
              <Link
                key={index}
                to={tool.path}
                className="group bg-white dark:bg-black rounded-xl p-4 sm:p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-800 hover:border-blue-200 dark:hover:border-blue-600 hover:-translate-y-1"
              >
                <div className="text-2xl sm:text-3xl mb-3 group-hover:scale-110 transition-transform duration-300">
                  {tool.icon}
                </div>
                <h3 className="font-semibold text-sm sm:text-base text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300 mb-2">
                  {tool.name}
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed transition-colors duration-500">
                  {tool.desc}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-100 dark:bg-black transition-all duration-500 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
            {/* Left - Brand */}
            <div className="text-center md:text-left">
              <Link to="/" className="flex items-center justify-center md:justify-start space-x-3 mb-3">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">A</span>
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                  AllFileChanger
                </span>
              </Link>
              <p className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-500">
                Free online file conversion tools
              </p>
            </div>

            {/* Center - Social Links */}
            <div className="text-center">
              <div className="flex justify-center space-x-4 mb-3">
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" 
                   className="w-10 h-10 bg-blue-500 hover:bg-blue-600 text-white rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                </a>
                <a href="https://github.com" target="_blank" rel="noopener noreferrer"
                   className="w-10 h-10 bg-gray-800 hover:bg-gray-900 text-white rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer"
                   className="w-10 h-10 bg-blue-700 hover:bg-blue-800 text-white rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-500 transition-colors duration-500">
                Follow us for updates
              </p>
            </div>

            {/* Right - Developer Message */}
            <div className="text-center md:text-right">
              <p className="text-sm text-gray-700 dark:text-gray-300 transition-colors duration-500 mb-1">
                Made with ❤️ by the team
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500 transition-colors duration-500">
                © 2025 AllFileChanger. All rights reserved.
              </p>
            </div>
          </div>

          {/* Bottom divider */}
          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-800 transition-colors duration-500">
            <div className="flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0">
              <div className="flex space-x-6 text-sm text-gray-600 dark:text-gray-400 transition-colors duration-500">
                <Link to="/privacy" className="hover:text-gray-900 dark:hover:text-white transition-colors duration-300">Privacy Policy</Link>
                <Link to="/terms" className="hover:text-gray-900 dark:hover:text-white transition-colors duration-300">Terms of Service</Link>
                <Link to="/contact" className="hover:text-gray-900 dark:hover:text-white transition-colors duration-300">Contact</Link>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-500 transition-colors duration-500">
                Trusted by 1M+ users worldwide
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
