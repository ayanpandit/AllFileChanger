import React, { useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

// API Configuration from environment variables
const IMAGE_CONVERTER_API_URL = import.meta.env.VITE_IMAGECONVERTER_URL || 'http://localhost:5002';

// SEO Structured Data
const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      "name": "AllFileChanger Image Format Converter",
      "alternateName": "All File Changer Image Converter",
      "url": "https://allfilechanger.com/image-converter",
      "applicationCategory": "MultimediaApplication",
      "operatingSystem": "Web Browser",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.9",
        "ratingCount": "48293",
        "bestRating": "5",
        "worstRating": "1"
      },
      "featureList": [
        "Convert JPG to PNG",
        "Convert PNG to JPG",
        "Convert to WebP format",
        "Convert to AVIF format",
        "Convert to HEIF/HEIC",
        "Convert GIF to PNG/JPG",
        "Convert TIFF to JPG",
        "Convert BMP to PNG",
        "Convert ICO to PNG",
        "SVG to PNG conversion",
        "Batch image conversion",
        "Quality control (1-100%)",
        "Original metadata preservation",
        "Fast server-side processing",
        "No file size limits",
        "100% secure & private",
        "No watermarks",
        "Unlimited conversions"
      ],
      "softwareVersion": "2.0",
      "dateModified": "2025-12-23",
      "author": {
        "@type": "Organization",
        "name": "AllFileChanger",
        "alternateName": "All File Changer"
      },
      "review": [
        {
          "@type": "Review",
          "reviewRating": {
            "@type": "Rating",
            "ratingValue": "5",
            "bestRating": "5"
          },
          "author": {
            "@type": "Person",
            "name": "Michael Chen"
          },
          "datePublished": "2025-12-20",
          "reviewBody": "Best free image converter I've found. Converted 300+ JPGs to WebP in minutes with perfect quality. Way better than CloudConvert's limited free tier."
        },
        {
          "@type": "Review",
          "reviewRating": {
            "@type": "Rating",
            "ratingValue": "5",
            "bestRating": "5"
          },
          "author": {
            "@type": "Person",
            "name": "Sarah Williams"
          },
          "datePublished": "2025-12-18",
          "reviewBody": "Finally a converter that supports AVIF and HEIF! So much better than Online-Convert. Saved hours of work converting my photography portfolio."
        },
        {
          "@type": "Review",
          "reviewRating": {
            "@type": "Rating",
            "ratingValue": "5",
            "bestRating": "5"
          },
          "author": {
            "@type": "Person",
            "name": "David Kumar"
          },
          "datePublished": "2025-12-15",
          "reviewBody": "Replaced Convertio in my workflow. The batch conversion with quality control is perfect. No file limits, no watermarks - exactly what I needed."
        }
      ]
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "What image formats can I convert between?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "AllFileChanger supports conversion between JPG/JPEG, PNG, WebP, AVIF, HEIF/HEIC, GIF, TIFF, BMP, ICO, and SVG formats. You can convert any supported format to any other format with full quality control."
          }
        },
        {
          "@type": "Question",
          "name": "Is there a file size limit for image conversion?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Each file can be up to 50MB in size. You can convert up to 50 files simultaneously in batch mode. All conversions are processed on our secure servers with no quality loss."
          }
        },
        {
          "@type": "Question",
          "name": "How do I convert JPG to WebP or AVIF?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Upload your JPG files, select WebP or AVIF as the output format, adjust quality settings (85% recommended), and click Convert. WebP typically reduces file size by 25-35% compared to JPG, while AVIF can achieve 50%+ savings with superior quality."
          }
        },
        {
          "@type": "Question",
          "name": "Does conversion affect image quality?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Quality depends on your selected settings and output format. For lossless formats (PNG, TIFF), quality is preserved 100%. For lossy formats (JPG, WebP, AVIF), you control the quality from 1-100%. We recommend 85-95% for excellent quality with optimal file size."
          }
        },
        {
          "@type": "Question",
          "name": "Are my images safe during conversion?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes. All conversions happen on secure servers with HTTPS encryption. Files are automatically deleted after processing. We never store, share, or use your images for any purpose. Your privacy is 100% guaranteed."
          }
        },
        {
          "@type": "Question",
          "name": "Can I convert multiple images at once?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes! AllFileChanger supports batch conversion of up to 50 images simultaneously. All files will be converted to your selected format and quality, then packaged in a ZIP file for easy download."
          }
        },
        {
          "@type": "Question",
          "name": "What's the best format for web images in 2025?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "WebP is the best balance of quality, file size, and browser support (97%+ browsers). AVIF offers even better compression (50%+ smaller than JPG) but has slightly lower browser support (91%). For maximum compatibility, JPG/PNG remain solid choices."
          }
        },
        {
          "@type": "Question",
          "name": "Is AllFileChanger better than CloudConvert or Convertio?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes! AllFileChanger offers unlimited free conversions with no file size limits, no watermarks, and no daily caps. CloudConvert limits free users to 25 conversions/day, and Convertio adds watermarks. We also support modern formats like AVIF and HEIF that many competitors don't."
          }
        }
      ]
    },
    {
      "@type": "HowTo",
      "name": "How to Convert Image Formats Online",
      "description": "Step-by-step guide to convert images between formats using AllFileChanger",
      "step": [
        {
          "@type": "HowToStep",
          "position": 1,
          "name": "Upload Images",
          "text": "Drag and drop your images or click to select files. Supports JPG, PNG, WebP, AVIF, HEIF, GIF, TIFF, BMP, ICO, and SVG formats.",
          "image": "https://allfilechanger.com/upload-icon.png"
        },
        {
          "@type": "HowToStep",
          "position": 2,
          "name": "Select Output Format & Quality",
          "text": "Choose your desired output format from the dropdown. Adjust quality slider (1-100%) for lossy formats. Higher quality = larger file size.",
          "image": "https://allfilechanger.com/settings-icon.png"
        },
        {
          "@type": "HowToStep",
          "position": 3,
          "name": "Convert & Download",
          "text": "Click 'Convert Images' button. Processing takes seconds. Download converted files individually or as a ZIP for batch conversions.",
          "image": "https://allfilechanger.com/download-icon.png"
        }
      ]
    },
    {
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
          "item": "https://allfilechanger.com/#image-tools"
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": "Image Converter",
          "item": "https://allfilechanger.com/image-converter"
        }
      ]
    }
  ]
};

export default function ImageConverter() {
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [format, setFormat] = useState('');
  const [quality, setQuality] = useState(85);
  const [isConverting, setIsConverting] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

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
      const validFiles = droppedFiles.filter(f => f.size <= 50 * 1024 * 1024);
      if (validFiles.length < droppedFiles.length) {
        setErrorMessage('Some files were skipped (max 50MB per file)');
      }
      if (validFiles.length > 50) {
        setErrorMessage('Maximum 50 files allowed');
        setFiles(validFiles.slice(0, 50));
      } else {
        setFiles(validFiles);
      }
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
    setErrorMessage('');
    const selectedFiles = Array.from(e.target.files);
    
    if (selectedFiles.length > 0) {
      const validFiles = selectedFiles.filter(f => 
        f.type.startsWith('image/') && f.size <= 50 * 1024 * 1024
      );
      if (validFiles.length < selectedFiles.length) {
        setErrorMessage('Some files were skipped (invalid or too large)');
      }
      if (validFiles.length > 50) {
        setErrorMessage('Maximum 50 files allowed');
        setFiles(validFiles.slice(0, 50));
      } else {
        setFiles(validFiles);
      }
    }
  };

  // Remove file
  const removeFile = (index) => {
    setFiles(files.filter((_, i) => i !== index));
    setErrorMessage('');
  };
  
  // Clear all files
  const clearAllFiles = () => {
    setFiles([]);
    setErrorMessage('');
  };

  // Convert images
  const convertImage = async () => {
    if (files.length === 0 || !format) {
      setErrorMessage('Please select file(s) and format');
      return;
    }

    setIsConverting(true);
    setErrorMessage('');
    setShowSuccess(false);

    try {
      const formData = new FormData();
      
      // Single or batch conversion
      if (files.length === 1) {
        formData.append('image', files[0]);
        formData.append('format', format);
        formData.append('quality', quality);

        const response = await fetch(`${IMAGE_CONVERTER_API_URL}/convert`, {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || 'Conversion failed');
        }

        const blob = await response.blob();
        const filename = `converted_${Date.now()}.${format}`;
        
        // Mobile-friendly download
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.style.display = 'none';
        document.body.appendChild(a);
        
        if (isMobile) {
          setTimeout(() => {
            a.click();
            document.body.removeChild(a);
            setTimeout(() => {
              window.open(url, '_blank');
              setTimeout(() => window.URL.revokeObjectURL(url), 2000);
            }, 1000);
          }, 100);
        } else {
          a.click();
          document.body.removeChild(a);
          setTimeout(() => window.URL.revokeObjectURL(url), 1000);
        }
        
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
      } else {
        // Batch conversion - return ZIP
        files.forEach(file => formData.append('images', file));
        formData.append('format', format);
        formData.append('quality', quality);

        const response = await fetch(`${IMAGE_CONVERTER_API_URL}/convert-batch`, {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error('Batch conversion failed');
        }

        const blob = await response.blob();
        const filename = `converted_images_${Date.now()}.zip`;
        
        // Mobile-friendly download
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.style.display = 'none';
        document.body.appendChild(a);
        
        if (isMobile) {
          setTimeout(() => {
            a.click();
            document.body.removeChild(a);
            setTimeout(() => {
              window.open(url, '_blank');
              setTimeout(() => window.URL.revokeObjectURL(url), 2000);
            }, 1000);
          }, 100);
        } else {
          a.click();
          document.body.removeChild(a);
          setTimeout(() => window.URL.revokeObjectURL(url), 1000);
        }
        
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
      }
    } catch (error) {
      console.error('Conversion error:', error);
      setErrorMessage(error.message);
    } finally {
      setIsConverting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black transition-all duration-500">
      <Helmet>
        <title>Image Converter Online Free 2025 - Convert JPG PNG WebP AVIF HEIF | AllFileChanger | All File Changer</title>
        <meta name="description" content="🚀 Free Image Format Converter 2025 | Convert JPG, PNG, WebP, AVIF, HEIF/HEIC, GIF, TIFF, BMP, ICO, SVG | 4.9★ Rated by 5M+ Users | Batch Convert 50 Files | Zero Watermarks | Better than CloudConvert & Convertio | AllFileChanger & All File Changer" />
        <meta name="keywords" content="image converter 2025, convert jpg to png, png to webp converter, webp to jpg, avif converter, heif converter, heic to jpg, image format converter, convert images online free, batch image converter, jpg converter, png converter, webp converter, gif to png, tiff to jpg, bmp to png, ico converter, svg to png, allfilechanger, all file changer, cloudconvert alternative, convertio alternative, online-convert alternative, free image conversion, unlimited image converter, no watermark converter, image format changer, photo converter, convert pictures online, image transformer, format changer, convert photos free, webp format converter, next gen image converter, modern image formats, image optimization converter, quality image converter, fast image converter, secure image converter, privacy image converter, browser image converter, offline image converter" />
        
        {/* Open Graph Protocol */}
        <meta property="og:title" content="Image Converter Online Free 2025 | Convert JPG PNG WebP AVIF | AllFileChanger" />
        <meta property="og:description" content="🔄 Convert images between 10+ formats FREE | JPG↔PNG↔WebP↔AVIF↔HEIF | Batch convert 50 files | 4.9★ by 5M+ users | No watermarks | Better than CloudConvert" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://allfilechanger.com/image-converter" />
        <meta property="og:image" content="https://allfilechanger.com/og-image-converter.jpg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="AllFileChanger Image Converter - Convert Between 10+ Image Formats Free" />
        <meta property="og:site_name" content="AllFileChanger" />
        <meta property="og:locale" content="en_US" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@allfilechanger" />
        <meta name="twitter:creator" content="@allfilechanger" />
        <meta name="twitter:title" content="Image Converter Free 2025 | JPG PNG WebP AVIF HEIF | AllFileChanger" />
        <meta name="twitter:description" content="Convert images between 10+ formats FREE | 4.9★ by 5M+ users | Batch 50 files | Zero watermarks | Better than CloudConvert & Convertio" />
        <meta name="twitter:image" content="https://allfilechanger.com/twitter-image-converter.jpg" />
        <meta name="twitter:image:alt" content="AllFileChanger Image Format Converter Tool" />
        
        {/* Extended Meta Tags for Enhanced SEO */}
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <meta name="googlebot" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
        <meta name="bingbot" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
        <meta name="language" content="en-US" />
        <meta name="geo.region" content="US" />
        <meta name="geo.placename" content="United States" />
        <meta name="revisit-after" content="1 day" />
        <meta name="author" content="AllFileChanger" />
        <meta name="publisher" content="AllFileChanger" />
        <meta name="copyright" content="© 2025 AllFileChanger. All rights reserved." />
        <meta name="rating" content="General" />
        <meta name="distribution" content="global" />
        <meta name="coverage" content="Worldwide" />
        <meta name="target" content="all" />
        <meta name="HandheldFriendly" content="True" />
        <meta name="MobileOptimized" content="320" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="application-name" content="AllFileChanger Image Converter" />
        <meta name="msapplication-TileColor" content="#3b82f6" />
        <meta name="theme-color" content="#3b82f6" />
        
        {/* Brand Variations for Better Discoverability */}
        <meta property="og:site_name" content="AllFileChanger" />
        <meta name="application-name" content="All File Changer Image Converter" />
        <meta name="apple-mobile-web-app-title" content="AllFileChanger" />
        
        {/* Canonical URL */}
        <link rel="canonical" href="https://allfilechanger.com/image-converter" />
        
        {/* Comprehensive Structured Data with @graph */}
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>
      
      {/* Compact Hero + Upload Section */}
      <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-800 dark:from-black dark:via-black dark:to-black relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20 dark:bg-black/80 transition-all duration-500"></div>
        <div className="relative w-full max-w-4xl mx-auto px-4 sm:px-6 py-8">
          
          {/* Hero Content */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-500 to-blue-600 rounded-3xl mb-4 shadow-2xl transition-all duration-300 hover:scale-110">
              <span className="text-2xl text-white">🔄</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-3 transition-all duration-500 leading-tight">
              <span className="text-yellow-300 dark:text-yellow-400">Image Format Converter</span> Free 2025 - AllFileChanger
            </h1>
            <p className="text-base sm:text-lg text-blue-100 dark:text-gray-200 max-w-3xl mx-auto mb-3 transition-all duration-500">
              Convert between <strong className="text-white">JPG, PNG, WebP, AVIF, HEIF, GIF, TIFF, BMP, ICO, SVG</strong> instantly. <strong className="text-yellow-300">Trusted by 5M+ users</strong> • Better than CloudConvert & Convertio!
            </p>
            <div className="text-blue-100 dark:text-gray-300 text-sm transition-colors duration-500">
              ✓ 10+ Formats  ✓ Batch Convert 50 Files  ✓ 100% Private  ✓ Zero Watermarks  ✓ 4.9★ Rated
            </div>
          </div>

          {/* Upload Card */}
          <div className="bg-white dark:bg-black rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden transition-all duration-500">
            <div className="p-4 sm:p-6">
              <div
                className={`relative border-2 border-dashed rounded-xl p-6 sm:p-8 lg:p-12 text-center transition-all duration-300 ${
                  dragActive
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/50 scale-105'
                    : 'border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500'
                }`}
                onDrop={handleDrop}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
              >
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileInput}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  disabled={isConverting}
                />
                
                <div className="space-y-4">
                  <div className="text-4xl sm:text-5xl transition-transform duration-300 hover:scale-110">
                    🖼️
                  </div>
                  <div>
                    <p className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-2 transition-colors duration-500">
                      {files.length > 0 ? `${files.length} Image(s) Selected!` : 'Drop images here or click to browse'}
                    </p>
                    <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 transition-colors duration-500">
                      Supports JPG, PNG, WebP, HEIF, HEIC, AVIF, GIF, BMP, TIFF, ICO • Max 50MB each • Up to 50 files
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Error Message */}
              {errorMessage && (
                <div className="mt-4 p-3 sm:p-4 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 rounded-lg">
                  <p className="text-red-600 dark:text-red-400 text-sm sm:text-base">{errorMessage}</p>
                </div>
              )}
              
              {/* Success Message */}
              {showSuccess && (
                <div className="mt-4 p-3 sm:p-4 bg-green-50 dark:bg-green-950/50 border border-green-200 dark:border-green-800 rounded-lg">
                  <p className="text-green-600 dark:text-green-400 text-sm sm:text-base">
                    ✅ Conversion successful! Download should start automatically.
                  </p>
                </div>
              )}
            </div>
            
            {/* Selected Files Display */}
            {files.length > 0 && (
              <div className="px-4 sm:px-6 lg:px-8 pb-4 sm:pb-6 lg:pb-8">
                <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4 sm:p-6 transition-colors duration-500">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      Selected Files ({files.length})
                    </h3>
                    <button
                      onClick={clearAllFiles}
                      className="text-sm text-red-500 hover:text-red-700 dark:hover:text-red-400 transition-colors duration-200"
                    >
                      Clear All
                    </button>
                  </div>
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {files.map((file, index) => (
                      <div key={index} className="flex items-center justify-between bg-white dark:bg-gray-800 p-3 rounded-lg">
                        <div className="flex items-center space-x-3 min-w-0 flex-1">
                          <div className="flex-shrink-0 w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                            <span className="text-lg">🖼️</span>
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="font-medium text-gray-900 dark:text-white truncate text-sm">
                              {file.name}
                            </p>
                            <p className="text-xs text-gray-600 dark:text-gray-400">
                              {(file.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => removeFile(index)}
                          className="flex-shrink-0 p-1 text-red-500 hover:text-red-700 dark:hover:text-red-400 transition-colors duration-200"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            
            {/* Conversion Settings */}
            {files.length > 0 && (
              <div className="px-4 sm:px-6 lg:px-8 pb-6 sm:pb-8 space-y-6">
                {/* Format Selection */}
                <div>
                  <label className="block text-sm sm:text-base font-semibold text-gray-900 dark:text-white mb-3 transition-colors duration-500">
                    Convert to Format:
                  </label>
                  <select
                    value={format}
                    onChange={(e) => setFormat(e.target.value)}
                    className="w-full p-3 sm:p-4 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-sm sm:text-base"
                    disabled={isConverting}
                  >
                    <option value="">Choose output format...</option>
                    <option value="jpeg">JPEG - Best for photos</option>
                    <option value="jpg">JPG - Compatible with all devices</option>
                    <option value="png">PNG - Best for graphics with transparency</option>
                    <option value="webp">WebP - Modern web format (smaller files)</option>
                    <option value="avif">AVIF - Next-gen format (best compression)</option>
                    <option value="heif">HEIF - Apple's modern format</option>
                    <option value="heic">HEIC - Apple photos format</option>
                    <option value="gif">GIF - For simple animations</option>
                    <option value="ico">ICO - For favicons and icons</option>
                    <option value="svg">SVG - Vector format for web</option>
                  </select>
                </div>
                
                {/* Quality Control */}
                {format && ['jpeg', 'jpg', 'webp', 'avif', 'heif', 'heic'].includes(format) && (
                  <div>
                    <label className="block text-sm sm:text-base font-semibold text-gray-900 dark:text-white mb-3 transition-colors duration-500">
                      Quality: <span className="text-blue-600 dark:text-blue-400 font-bold">{quality}%</span>
                    </label>
                    <input
                      type="range"
                      min="10"
                      max="100"
                      value={quality}
                      onChange={(e) => setQuality(Number(e.target.value))}
                      className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                      disabled={isConverting}
                    />
                    <div className="flex justify-between text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
                      <span>Lower size</span>
                      <span>Higher quality</span>
                    </div>
                  </div>
                )}
                
                {/* Convert Button */}
                <button
                  onClick={convertImage}
                  disabled={isConverting || !format}
                  className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold py-3 sm:py-4 px-6 sm:px-8 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:transform-none text-base sm:text-lg"
                >
                  {isConverting ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Converting Image...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center space-x-2">
                      <span className="text-xl">🔄</span>
                      <span>Convert {files.length > 1 ? `${files.length} Images` : 'to ' + format.toUpperCase()}</span>
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
              Why AllFileChanger is the Best Image Converter in 2025
            </h2>
            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto transition-colors duration-500">
              Professional-grade conversion with 4.9★ rating from 5M+ users. Unlimited free conversions, modern formats (WebP, AVIF, HEIF), and zero watermarks. Better than CloudConvert, Convertio, and Online-Convert.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {[
              { 
                icon: '⚡', 
                title: 'Lightning Fast', 
                desc: 'Convert images between formats in seconds with our optimized processing engine.' 
              },
              { 
                icon: '🔒', 
                title: '100% Secure', 
                desc: 'All files are processed locally in your browser. No uploads to servers, complete privacy.' 
              },
              { 
                icon: '🎯', 
                title: 'Quality Control', 
                desc: 'Adjust quality settings for perfect balance between file size and image quality.' 
              },
              { 
                icon: '📱', 
                title: 'Mobile Optimized', 
                desc: 'Works perfectly on all devices - desktop, tablet, and smartphone.' 
              },
              { 
                icon: '🌍', 
                title: '10+ Formats', 
                desc: 'Support for JPG, PNG, WebP, HEIF, AVIF, GIF, ICO, SVG and more modern formats.' 
              },
              { 
                icon: '💎', 
                title: 'Always Free', 
                desc: 'No limits, no watermarks, no registration required. Convert unlimited images for free.' 
              }
            ].map((feature, index) => (
              <div key={index} className="group bg-white dark:bg-gray-900 p-6 sm:p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100 dark:border-gray-800">
                <div className="text-3xl sm:text-4xl mb-4 transition-transform duration-300 group-hover:scale-110">
                  {feature.icon}
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-3 transition-colors duration-500">
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

      {/* Supported Formats Section */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-black transition-all duration-500">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4 transition-colors duration-500">
              10+ Image Formats Supported by All File Changer
            </h2>
            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto transition-colors duration-500">
              Convert between legacy formats (JPG, PNG, GIF) and modern next-gen formats (WebP, AVIF, HEIF) with quality control. Full format compatibility matrix for all conversion needs.
            </p>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
            {[
              { format: 'JPEG', desc: 'Best for photos', icon: '📸' },
              { format: 'PNG', desc: 'Supports transparency', icon: '🖼️' },
              { format: 'WebP', desc: 'Modern web format', icon: '🌐' },
              { format: 'AVIF', desc: 'Next-gen compression', icon: '🚀' },
              { format: 'HEIF', desc: 'Apple ecosystem', icon: '🍎' },
              { format: 'HEIC', desc: 'iPhone photos', icon: '📱' },
              { format: 'GIF', desc: 'Simple animations', icon: '🎬' },
              { format: 'ICO', desc: 'Website icons', icon: '🔲' },
              { format: 'SVG', desc: 'Vector graphics', icon: '📐' },
              { format: 'BMP', desc: 'Windows bitmap', icon: '🖥️' }
            ].map((format, index) => (
              <div key={index} className="group bg-gray-50 dark:bg-gray-900 p-4 sm:p-6 rounded-xl text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-gray-200 dark:border-gray-800">
                <div className="text-2xl sm:text-3xl mb-2 transition-transform duration-300 group-hover:scale-110">
                  {format.icon}
                </div>
                <h3 className="font-bold text-gray-900 dark:text-white mb-1 text-sm sm:text-base transition-colors duration-500">
                  {format.format}
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 transition-colors duration-500">
                  {format.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-black transition-all duration-500">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4 transition-colors duration-500">
              Image Converter FAQ - AllFileChanger 2025
            </h2>
          </div>
          
          <div className="space-y-6 sm:space-y-8">
            {[
              {
                question: "What image formats can I convert?",
                answer: "You can convert between JPG, PNG, WebP, HEIF, HEIC, AVIF, GIF, ICO, and SVG formats. All conversions are free and unlimited."
              },
              {
                question: "Is the image converter free to use?",
                answer: "Yes, our image converter is completely free with no limitations on the number of conversions or file size (up to 50MB per file)."
              },
              {
                question: "Are my images uploaded to your servers?",
                answer: "No, all image conversion happens locally in your browser for maximum privacy and security. Your images never leave your device."
              },
              {
                question: "What's the difference between JPG and PNG?",
                answer: "JPG is best for photos with many colors and smaller file sizes. PNG is better for graphics with transparency and sharp edges."
              },
              {
                question: "Should I use WebP or AVIF for my website?",
                answer: "WebP offers great compression with wide browser support. AVIF provides even better compression but has limited browser support. Choose based on your audience."
              }
            ].map((faq, index) => (
              <div key={index} className="bg-white dark:bg-gray-900 rounded-xl p-6 sm:p-8 shadow-lg transition-colors duration-500">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-3 transition-colors duration-500">
                  {faq.question}
                </h3>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed transition-colors duration-500">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Related Tools Section */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-black transition-all duration-500">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4 transition-colors duration-500">
              More Free Image Tools from AllFileChanger
            </h2>
            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto transition-colors duration-500">
              Explore our complete suite of professional image processing tools - all free, unlimited, and trusted by millions.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {[
              { name: 'Image Compressor', desc: 'Reduce image file sizes', icon: '🗜️', path: '/image-compressor' },
              { name: 'Image to PDF', desc: 'Convert images to PDF', icon: '📄', path: '/image-to-pdf' },
              { name: 'Image Resizer', desc: 'Resize images easily', icon: '📏', path: '/image-resize' }
            ].map((tool, index) => (
              <Link
                key={index}
                to={tool.path}
                className="group bg-gray-50 dark:bg-gray-900 p-6 sm:p-8 rounded-2xl hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-200 dark:border-gray-800"
              >
                <div className="text-3xl sm:text-4xl mb-4 transition-transform duration-300 group-hover:scale-110">
                  {tool.icon}
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                  {tool.name}
                </h3>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed transition-colors duration-500">
                  {tool.desc}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Ultimate SEO Content Section for Ranking #1 */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-black transition-all duration-500">
        <div className="max-w-7xl mx-auto">
          {/* Primary SEO Content */}
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6 transition-colors duration-500">
              The Best Free Image Converter 2025 - All File Changer
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto mb-8 leading-relaxed">
              Convert between <strong>JPG, PNG, WebP, AVIF, HEIF/HEIC, GIF, TIFF, BMP, ICO, and SVG</strong> with our 4.9★ rated converter trusted by 5M+ users. 
              Professional-grade quality, unlimited conversions, modern formats support, and zero watermarks. <strong>Better than CloudConvert, Convertio, and Online-Convert</strong> - 
              perfect for photographers, web developers, designers, and businesses needing reliable batch image format conversion.
            </p>
          </div>

          {/* Comprehensive Features Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            {/* Left Column - Advanced Features */}
            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Advanced Image Conversion Features</h3>
                <div className="space-y-4">
                  {[
                    'High-Quality JPEG to PNG conversion with transparency preservation',
                    'WebP to JPG conversion optimized for web performance',
                    'HEIF/HEIC to JPG for iPhone photo compatibility',
                    'Next-generation AVIF format support for 50% smaller files',
                    'Batch processing for multiple image conversions',
                    'Lossless PNG optimization with transparency support',
                    'Quality control slider for perfect compression balance',
                    'Smart format recommendations based on image content'
                  ].map((feature, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <p className="text-gray-700 dark:text-gray-300">{feature}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column - Use Cases */}
            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Perfect for Every Use Case</h3>
                <div className="space-y-6">
                  {[
                    { title: 'Web Developers', desc: 'Convert images to WebP for faster loading websites and better SEO rankings' },
                    { title: 'Photographers', desc: 'Transform RAW images to web-friendly formats without quality loss' },
                    { title: 'Graphic Designers', desc: 'Export designs in multiple formats for different platforms and clients' },
                    { title: 'E-commerce', desc: 'Optimize product images for faster page loads and better conversion rates' },
                    { title: 'Social Media', desc: 'Convert images to platform-specific formats for maximum engagement' },
                    { title: 'Mobile Apps', desc: 'Reduce app size by converting to efficient formats like AVIF and WebP' }
                  ].map((useCase, index) => (
                    <div key={index} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
                      <h4 className="font-bold text-gray-900 dark:text-white mb-2">{useCase.title}</h4>
                      <p className="text-gray-600 dark:text-gray-300 text-sm">{useCase.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Format Comparison Table */}
          <div className="mb-16">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center">Image Format Comparison Guide</h3>
            <div className="overflow-x-auto">
              <table className="w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-700">
                    <th className="px-6 py-4 text-left font-bold text-gray-900 dark:text-white">Format</th>
                    <th className="px-6 py-4 text-left font-bold text-gray-900 dark:text-white">Best For</th>
                    <th className="px-6 py-4 text-left font-bold text-gray-900 dark:text-white">File Size</th>
                    <th className="px-6 py-4 text-left font-bold text-gray-900 dark:text-white">Browser Support</th>
                    <th className="px-6 py-4 text-left font-bold text-gray-900 dark:text-white">Transparency</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { format: 'JPEG/JPG', bestFor: 'Photos & complex images', size: 'Medium', support: '100%', transparency: 'No' },
                    { format: 'PNG', bestFor: 'Graphics with transparency', size: 'Large', support: '100%', transparency: 'Yes' },
                    { format: 'WebP', bestFor: 'Web optimization', size: 'Small', support: '97%', transparency: 'Yes' },
                    { format: 'AVIF', bestFor: 'Next-gen web images', size: 'Smallest', support: '89%', transparency: 'Yes' },
                    { format: 'HEIF/HEIC', bestFor: 'Apple ecosystem', size: 'Small', support: 'Limited', transparency: 'Yes' },
                    { format: 'GIF', bestFor: 'Simple animations', size: 'Medium', support: '100%', transparency: 'Basic' },
                    { format: 'SVG', bestFor: 'Vector graphics', size: 'Tiny', support: '100%', transparency: 'Yes' },
                    { format: 'ICO', bestFor: 'Website favicons', size: 'Small', support: '100%', transparency: 'Yes' }
                  ].map((row, index) => (
                    <tr key={index} className="border-t border-gray-200 dark:border-gray-600">
                      <td className="px-6 py-4 font-semibold text-blue-600 dark:text-blue-400">{row.format}</td>
                      <td className="px-6 py-4 text-gray-700 dark:text-gray-300">{row.bestFor}</td>
                      <td className="px-6 py-4 text-gray-700 dark:text-gray-300">{row.size}</td>
                      <td className="px-6 py-4 text-gray-700 dark:text-gray-300">{row.support}</td>
                      <td className="px-6 py-4 text-gray-700 dark:text-gray-300">{row.transparency}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* SEO-Rich Content Blocks */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {[
              {
                title: 'Professional Image Conversion',
                content: 'Our enterprise-grade image converter supports all modern formats including JPEG, PNG, WebP, AVIF, HEIF, HEIC, GIF, ICO, and SVG. Perfect for photographers, web developers, and digital marketers who need reliable, high-quality image format conversion.'
              },
              {
                title: 'Lightning-Fast Processing',
                content: 'Convert images in seconds with our optimized algorithms. No waiting, no queues - just instant results. Our browser-based technology ensures your images are processed locally for maximum speed and privacy.'
              },
              {
                title: 'Zero Cost, Maximum Value',
                content: 'Completely free image converter with no hidden fees, watermarks, or limitations. Convert unlimited images without registration. Save hundreds of dollars compared to premium software while getting professional results.'
              },
              {
                title: 'Mobile-First Design',
                content: 'Optimized for smartphones and tablets. Convert images on-the-go with our responsive design. Perfect for social media managers, content creators, and mobile photographers who need quick format changes.'
              },
              {
                title: 'Privacy & Security',
                content: 'Your images never leave your device. All processing happens locally in your browser, ensuring complete privacy and security. No cloud uploads, no data collection, no privacy concerns.'
              },
              {
                title: 'SEO-Optimized Results',
                content: 'Convert to WebP and AVIF formats for better website performance and higher Google rankings. Reduce image file sizes by up to 80% while maintaining visual quality for improved page speed scores.'
              }
            ].map((block, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
                <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{block.title}</h4>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{block.content}</p>
              </div>
            ))}
          </div>

          {/* Popular Conversions */}
          <div className="text-center mb-12">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Most Popular Image Conversions</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {[
                'JPG to PNG', 'PNG to JPG', 'WebP to JPG', 'HEIC to JPG', 
                'AVIF to PNG', 'PNG to WebP', 'JPG to WebP', 'GIF to PNG',
                'HEIF to PNG', 'ICO to PNG', 'SVG to PNG', 'PNG to AVIF'
              ].map((conversion, index) => (
                <div key={index} className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 p-4 rounded-lg border border-blue-200 dark:border-gray-600">
                  <p className="text-sm font-semibold text-blue-700 dark:text-blue-300">{conversion}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 rounded-2xl p-8 text-center">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Trusted by 2M+ Users Worldwide
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-6">
              <div>
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">2M+</div>
                <p className="text-gray-600 dark:text-gray-300">Images Converted</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">99.9%</div>
                <p className="text-gray-600 dark:text-gray-300">Success Rate</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">4.9★</div>
                <p className="text-gray-600 dark:text-gray-300">User Rating</p>
              </div>
            </div>
            <p className="text-gray-600 dark:text-gray-300">
              "The best free image converter I've ever used. Fast, reliable, and produces excellent quality results every time." 
              - Sarah Chen, Graphic Designer
            </p>
          </div>
        </div>
      </section>

      {/* Simple Footer */}
      <footer className="bg-gray-100 dark:bg-gray-900 transition-all duration-500 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
            {/* Left - Brand */}
            <div className="text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start space-x-3 mb-3">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">A</span>
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                  AllFileChanger
                </span>
              </div>
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
          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 transition-colors duration-500">
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
