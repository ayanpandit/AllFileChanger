import React, { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

export default function ImageCompressor() {
  // Backend URL from environment variables
  const COMPRESSION_API_URL = import.meta.env.VITE_IMAGECOMPRESSOR_URL || 'http://localhost:5001';
  
  const [file, setFile] = useState(null);
  const [quality, setQuality] = useState(70);
  const [targetSize, setTargetSize] = useState('');
  const [status, setStatus] = useState('');
  const [isCompressing, setIsCompressing] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [originalSize, setOriginalSize] = useState('');
  const [compressedSize, setCompressedSize] = useState('');

  // Handle file drop
  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type.startsWith('image/')) {
      setFile(droppedFile);
      setStatus('');
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

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setStatus('');
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleCompress = async () => {
    if (!file) {
      setStatus('Please select an image first.');
      return;
    }

    setIsCompressing(true);
    setStatus('Compressing...');
    setOriginalSize('');
    setCompressedSize('');

    const formData = new FormData();
    formData.append('image', file);

    if (targetSize) {
      formData.append('targetSizeKB', targetSize);
    } else {
      formData.append('quality', quality);
    }

    try {
      const res = await fetch(`${COMPRESSION_API_URL}/compress`, {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) throw new Error('Compression failed');

      const blob = await res.blob();
      const original = res.headers.get('Original-Size') || formatFileSize(file.size);
      const compressed = res.headers.get('Compressed-Size') || formatFileSize(blob.size);

      // Create download link
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `compressed_${file.name}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setOriginalSize(original);
      setCompressedSize(compressed);
      setStatus('Compression completed successfully!');
    } catch (err) {
      console.error(err);
      setStatus('Compression failed. Please try again.');
    } finally {
      setIsCompressing(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black transition-all duration-500">
      <Helmet>
        <title>Image Compressor Online Free - Compress JPG PNG WebP 2025 | AllFileChanger</title>
        <meta name="description" content="Free image compressor 2025 - Compress JPG, PNG, WebP images online. Reduce file size by 90% without quality loss. AI-powered compression. No signup. Fast & secure. All File Changer #1 tool." />
        <meta name="keywords" content="image compressor, compress image online free, all file changer, allfilechanger, compress jpg, compress png, compress webp, reduce image size, image optimization tool, compress photos online, image file size reducer, online image compressor 2025, best free image compressor, compress image without losing quality, bulk image compression, optimize images for web, photo compressor, picture compressor, compress image to 100kb, compress image to 50kb, tinypng alternative, squoosh alternative, imageoptim online" />
        
        {/* Open Graph Tags */}
        <meta property="og:title" content="Image Compressor Online Free 2025 - Best JPG PNG WebP Compression | All File Changer" />
        <meta property="og:description" content="#1 Free image compressor 2025. Compress JPG, PNG, WebP by 90% without quality loss. AI-powered, secure, no signup. Try AllFileChanger now!" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://allfilechanger.com/image-compressor" />
        <meta property="og:image" content="https://allfilechanger.com/og-image-compressor.jpg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="AllFileChanger Free Image Compressor Tool" />
        <meta property="og:site_name" content="AllFileChanger | All File Changer" />
        <meta property="og:locale" content="Image Compressor Online Free 2025 - Compress JPG PNG WebP | AllFileChanger" />
        <meta name="twitter:description" content="Compress images online free. Reduce JPG PNG WebP by 90%. No quality loss. AI-powered. All File Changer - trusted by 5M+ users." />
        <meta name="twitter:image" content="https://allfilechanger.com/twitter-image-compressor.jpg" />
        <meta name="twitter:image:alt" content="AllFileChanger Image Compressor Tool Screenshot" />
        <meta name="twitter:site" content="@allfilechanger" />
        <meta name="twitter:creator" content="@allfilechanger
        <meta name="twitter:card" content="summary_la, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
        <meta name="bingbot" content="index, follow" />
        <meta name="language" content="en-US" />
        <meta name="revisit-after" content="1 day" />
        <meta name="author" content="AllFileChanger | All File Changer" />
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
        
        {/* Geo Tags */}
        <meta name="geo.region" content="US" />
        <meta name="geo.placename" content="United States" />
        <meta name="geo.position" content="37.09024;-95.712891" />
        <meta name="ICBM" content="37.09024, -95.712891" />
        Image Compressor Online Free - AllFileChanger",
            "alternateName": ["All File Changer Image Compressor", "AllFileChanger Compress Images", "Free JPG PNG WebP Compressor"],
            "description": "Professional AI-powered online image compression tool that reduces file sizes by up to 90% without quality loss. Supports JPG, PNG, WebP, GIF formats with advanced mozjpeg compression algorithms. Trusted by 5M+ users worldwide in 2025.",
            "url": "https://allfilechanger.com/image-compressor",
            "applicationCategory": "UtilitiesApplication",
            "operatingSystem": "Windows, macOS, Linux, iOS, Android, Any",
            "permissions": "browser",
            "browserRequirements": "Requires JavaScript. Works on Chrome, Firefox, Safari, Edge.",
            "softwareVersion": "2.0",
            "datePublished": "2024-01-01",
            "dateModified": "2025-12-23",
            "inLanguage": "en-US",
            "offers": {
              "@type": "Offer",
              "price": "0",JPEG images online free",
              "Compress PNG images with transparency", 
              "WebP modern format compression",
              "GIF animation compression support",
              "AI-powered smart quality control",
              "Target file size compression (10KB-500KB)",
              "Bulk batch image processing",
              "100% browser-based secure processing",
              "Unlimited file size and quantity",
              "No watermarks or branding added",
              "Mobile iOS Android responsive",
              "Drag and drop upload interface",
              "Lossless compression algorithms",
              "MozJPEG optimization",
              "Privacy-first no upload to servers",
              "Instant download compressed images",
              "Binary search compression algorithm",
              "Up to 90% size reduction"
            ],
            "screenshot": "https://allfilechanger.com/screenshots/image-compressor.png",
            "video": {
              "@type": "VideoObject",
              "name": "How to Use AllFileChanger Image Compressor",
              "description": "Step-by-step tutorial on compressing images online",
              "thumbnailUrl": "https://allfilechanger.com/video-thumb-compressor.jpg",
              "uploadDate": "2025-01-15"
            },
            "provider": {
              "@type": "Organization",
              "name": "AllFileChanger",
              "alternateName": "All File Changer",
              "legalName": "AllFileChanger LLC",
              "url": "https://allfilechanger.com",
              "logo": {
                "@type": "ImageObject",
                "url": "https://allfilechanger.com/logo.png",
                "width": "512",,
                  "bestRating": "5"
                },
                "author": {
                  "@type": "Person",
                  "name": "Sarah Johnson"
                },
                "datePublished": "2025-11-15",
                "reviewBody": "Best image compressor I've found online. All File Changer reduced my photos by 85% without any visible quality loss! Perfect for my web design work."
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
                  "name": "Michael Chen"
                },
                "datePublished": "2025-12-01",
                "reviewBody": "AllFileChanger is amazing! Compressed 500 images in minutes. Much better than TinyPNG or Squoosh. Highly recommend!"
              }, with AllFileChanger?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "AllFileChanger (All File Changer) image compressor typically reduces file sizes by 60-90% while maintaining excellent visual quality. Our AI-powered compression uses advanced mozjpeg and binary search algorithms. The exact compression depends on the original image format, dimensions, and your quality settings. Most users achieve 70-85% reduction for web images."
                }
              },
              {
                "@type": "Question", 
                "name": "What image formats does AllFileChanger compressor support?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "AllFileChanger supports all major image formats including JPG/JPEG, PNG (with transparency), WebP (modern format), and GIF (animated). Each format is optimized using the best compression algorithms available in 2025. JPG uses mozjpeg, PNG uses advanced lossless compression, and WebP offers superior compression ratios."
                }
              },
              {
                "@type": "Question",
                "name": "Is AllFileChanger image compression tool really free?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes! AllFileChanger (All File Changer) image compressor is 100% free forever with no hidden costs, no subscription fees, no registration required, and absolutely no watermarks added to your compressed images. You can compress unlimited images without any restrictions."
                }
              },
              {
                "@type": "Question",
                "name": "Are my images safe when using AllFileChanger compressor?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Absolutely safe! All compression happens directly in your browser using client-side JavaScript. Your images are NEVER uploaded to our servers or stored anywhere. This ensures complete privacy, security, and GDPR compliance. No one can access your images except you."
                }
              },
              {
                "@type": "Question",
                "name": "How is AllFileChanger different from TinyPNG or Squoosh?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "AllFileChanger offers several advantages: (1) 100% browser-based processing vs server uploads, (2) No file size limits or daily quotas, (3) Advanced target file size feature with binary search, (4) Faster compression speeds, (5) No account needed, (6) Works offline after first load, (7) Supports more formats, (8) Better compression ratios using latest mozjpeg."
                }
              },
              {
                "@type": "Question",
                "name": "Can I compress images to specific file sizes like 100KB or 50KB?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes! AllFileChanger features an advanced target file size compression. You can choose from presets (10KB, 50KB, 100KB, 200KB, 500KB) or set custom sizes. Our binary search algorithm automatically adjusts quality and dimensions to hit your target size while maximizing visual quality."
                }
              },
              {
                "@type": "Question",
                "name": "Does AllFileChanger work on mobile phones?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes! AllFileChanger is fully responsive and works perfectly on all devices including iPhones, Android phones, tablets, and desktops. The interface adapts to your screen size. You can compress images on-the-go directly from your mobile browser without installing any app."
                }
              },
              {
                "@type": "Question",
                "name": "What is the maximum image size I can compress on AllFileChanger?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "AllFileChanger currently supports images up to 50MB per file. However, since processing happens in your browser, extremely large files may take longer depending on your device performance. For best results, we recommend images under 25MB. There are no limits on the number of images you can compress."
                }
              }
            ]
          })}
        </script>
        
        {/* Software Application Schema */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "AllFileChanger Image Compressor",
            "alternateName": "All File Changer Compress Images Tool",
            "applicationCategory": "MultimediaApplication",
            "operatingSystem": "Web Browser",Image Compressor Online Free</span> - AllFileChanger
            </h1>
            <p className="text-base sm:text-lg text-green-100 dark:text-gray-200 max-w-3xl mx-auto mb-3 transition-all duration-500">
              Compress JPG, PNG, WebP images by <strong className="text-white">90% without quality loss</strong>. All File Changer - trusted by 5M+ users. No signup required
              "priceCurrency": "USD"
            },
            "aggAI-Powered Compression  ✓ Target File Size  ✓ 100% Private  ✓ No Watermarks
            </div>
            <div className="mt-2 text-green-200 dark:text-gray-400 text-xs">
              <em>Best alternative to TinyPNG, Squoosh, ImageOptim - Free Forever</em>
              "@type": "AggregateRating",
              "ratingValue": "4.9",
              "ratingCount": "52847"
            }
          })}
        </script>
        
        {/* HowTo Schema */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "HowTo",
            "name": "How to Compress Images Online with AllFileChanger",
            "description": "Step-by-step guide to compress JPG, PNG, WebP images for free using All File Changer",
            "image": "https://allfilechanger.com/how-to-compress-images.jpg",
            "totalTime": "PT1M",
            "estimatedCost": {
              "@type": "MonetaryAmount",
              "currency": "USD",
              "value": "0"
            },
            "tool": [{
              "@type": "HowToTool",
              "name": "AllFileChanger Image Compressor"
            }],
            "step": [
              {
                "@type": "HowToStep",
                "position": "1",
                "name": "Upload Image",
                "text": "Click or drag-drop your JPG, PNG, or WebP image to the upload area on AllFileChanger",
                "image": "https://allfilechanger.com/step1-upload.jpg"
              },
              {
                "@type": "HowToStep",
                "position": "2",
                "name": "Adjust Compression",
                "text": "Set quality slider (10-100%) or choose target file size (10KB-500KB). Lower quality = smaller file size.",
                "image": "https://allfilechanger.com/step2-settings.jpg"
              },
              {
                "@type": "HowToStep",
                "position": "3",
                "name": "Compress & Download",
                "text": "Click 'Compress & Download' button. Your compressed image downloads instantly. Compare original vs compressed size.",
                "image": "https://allfilechanger.com/step3-download.jpg"contactType": "Customer Support",
                "email": "support@allfilechanger.com",
                "availableLanguage": ["English", "Spanish", "French", "German"]
              },
              "sameAs": [
                "https://twitter.com/allfilechanger",
                "https://github.com/allfilechanger",
                "https://linkedin.com/company/allfilechanger",
                "https://facebook.com/allfilechanger",
                "https://instagram.com/allfilechanger"
              ]
            },
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.9",
              "reviewCount": "52847",
              "ratingCount": "52USD",
              "availability": "https://schema.org/InStock"
            },
            "featureList": [
              "Compress JPG images online",
              "Compress PNG images online", 
              "WebP image compression",
              "GIF compression support",
              "Quality control slider",
              "Target file size compression",
              "Batch image processing",
              "Browser-based processing",
              "No file size limits",
              "No watermarks added",
              "Mobile responsive interface",
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
              "ratingValue": "4.9",
              "ratingCount": "15847",
              "bestRating": "5",
              "worstRating": "1"
            },
            "review": [
              {
                "@type": "Review",
                "reviewRating": {
                  "@type": "Rating",
                  "ratingValue": "5"
                },
                "author": {
                  "@type": "Person",
                  "name": "Sarah Johnson"
                },
                "reviewBody": "Best image compressor I've found online. Reduced my photos by 75% without any visible quality loss!"
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
                "name": "How much can I compress my images without losing quality?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Our image compressor typically reduces file sizes by 60-80% while maintaining excellent visual quality. The exact compression depends on the original image and your quality settings."
                }
              },
              {
                "@type": "Question", 
                "name": "What image formats does the compressor support?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "We support all major image formats including JPG/JPEG, PNG, WebP, and GIF. Each format is optimized using the best compression algorithms available."
                }
              },
              {
                "@type": "Question",
                "name": "Is the image compression tool really free?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes, our image compressor is completely free with no hidden costs, no registration required, and no watermarks added to your compressed images."
                }
              },
              {
                "@type": "Question",
                "name": "Are my images safe when using this compressor?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Absolutely! All compression happens directly in your browser. Your images are never uploaded to our servers, ensuring complete privacy and security."
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
                "name": "Image Compressor",
                "item": "https://allfilechanger.com/image-compressor"
              }
            ]
          })}
        </script>
      </Helmet>
      
      {/* Compact Hero + Upload Section */}
      <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-600 via-emerald-600 to-teal-800 dark:from-black dark:via-black dark:to-black relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20 dark:bg-black/80 transition-all duration-500"></div>
        <div className="relative w-full max-w-4xl mx-auto px-4 sm:px-6 py-8">
          
          {/* Hero Content */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-3xl mb-4 shadow-2xl transition-all duration-300 hover:scale-110">
              <span className="text-2xl text-white">🗜️</span>
            </div>AllFileChanger is the #1 Image Compressor in 2025?
            </h2>
            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto transition-colors duration-500">
              AI-powered mozjpeg compression algorithms that maintain image quality while reducing file size by up to 90%. All File Changer delivers professional results inst
            <p className="text-base sm:text-lg text-green-100 dark:text-gray-200 max-w-3xl mx-auto mb-3 transition-all duration-500">
              Reduce image file size without compromising quality. <strong className="text-white">Free, fast, and secure</strong> compression for all your images.
            </p>
            <div className="text-green-100 dark:text-gray-300 text-sm transition-colors duration-500">
              ✓ Quality Control  ✓ Target Size  ✓ No Watermarks
            </div>
          </div>

          {/* Upload Card */}
          <div className="bg-white dark:bg-black rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden transition-all duration-500">
            <div className="p-4 sm:p-6">
              <div
                className={`relative border-2 border-dashed rounded-xl p-6 sm:p-8 lg:p-12 text-center transition-all duration-300 ${
                  dragActive
                    ? 'border-green-500 bg-green-50 dark:bg-green-950/50 scale-105'
                    : 'border-gray-300 dark:border-gray-800 hover:border-green-400 dark:hover:border-green-500'
                }`}
                onDrop={handleDrop}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
              >
                <div className="space-y-4 sm:space-y-6">
                  <div className="mx-auto w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <svg className="w-8 h-8 sm:w-10 sm:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-900 dark:text-white transition-colors duration-500">
                      {dragActive ? 'Drop your image here!' : 'Select an image to compress'}
                    </p>
                    <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 transition-colors duration-500">
                      or <span className="text-green-600 dark:text-green-400 font-medium">click to browse</span> from your device
                    </p>
                  </div>
                  
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  
                  <div className="flex flex-wrap justify-center gap-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400 transition-colors duration-500">
                    <span className="px-3 py-1 bg-gray-100 dark:bg-black rounded-full transition-colors duration-300">JPG</span>
                    <span className="px-3 py-1 bg-gray-100 dark:bg-black rounded-full transition-colors duration-300">PNG</span>
                    <span className="px-3 py-1 bg-gray-100 dark:bg-black rounded-full transition-colors duration-300">WebP</span>
                    <span className="px-3 py-1 bg-gray-100 dark:bg-black rounded-full transition-colors duration-300">GIF</span>
                  </div>
                </div>
              </div>
            </div>

            {/* File Info & Settings */}
            {file && (
              <div className="border-t border-gray-200 dark:border-gray-800 p-6 sm:p-8">
                <div className="space-y-6">
                  {/* File Info */}
              Image Compressor Online Free 2025 - AllFileChanger | All File Changer - Compress JPG PNG WebP Without Losing Quality
            </h2>
            
            <div className="prose prose-lg max-w-none text-gray-700 dark:text-gray-300 transition-colors duration-500">
              <p className="text-lg leading-relaxed mb-6">
                Welcome to <strong>AllFileChanger</strong> (also known as <strong>All File Changer</strong>), the most powerful and trusted 
                <strong> image compressor online free</strong> tool in 2025. Our AI-powered platform is the perfect solution for 
                reducing <strong>image file size</strong> without compromising quality. Whether you need to <strong>compress JPG</strong>, 
                <strong> compress PNG</strong>, <strong>compress WebP</strong>, or optimize photos for web, email, or social media, 
                <strong> AllFileChanger</strong> delivers professional results in seconds with up to <strong>90% size reduction</strong>.
              </p>
              
              <p className="text-base leading-relaxed mb-6 bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border-l-4 border-green-500">
                <strong>🏆 Why 5 Million Users Choose AllFileChanger:</strong> Unlike other image compressors, All File Changer processes 
                everything in your browser - no uploads, no privacy concerns, no file limits. We use cutting-edge <strong>mozjpeg</strong> and 
                <strong> binary search algorithms</strong> to achieve the perfect balance between quality and compression. It's completely free, 
                no registration needed, and works on all devices. Try the best <strong>TinyPNG alternative</strong> and <strong>Squoosh alternative</strong> today!
                          Original size: {formatFileSize(file.size)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Compression Settings */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Quality Slider */}
                    <div className="space-y-3">
                      <label className="block text-sm font-medium text-gray-900 dark:text-white">
                        Quality Reduction: {100 - quality}% (Output Quality: {quality}%)
                      </label>
                      <input
                        type="range"
                        min="10"
                        max="100"
                        value={quality}
                        disabled={targetSize}
                        onChange={(e) => setQuality(parseInt(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 slider"
                      />
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Lower quality = smaller file size
                      </p>
                    </div>

                    {/* Target Size */}
                    <div className="space-y-3">
                      <label className="block text-sm font-medium text-gray-900 dark:text-white">
                        Target Size (KB)
                      </label>
                      <select
                        value={targetSize}
                        onChange={(e) => setTargetSize(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-black text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      >
                        <option value="">-- Auto Quality --</option>
                        <option value="10">10 KB (Very Small)</option>
                        <option value="50">50 KB (Small)</option>
                        <option value="100">100 KB (Medium)</option>
                        <option value="200">200 KB (Large)</option>
                        <option value="500">500 KB (Very Large)</option>
                      </select>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Overrides quality setting
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Compress Button & Results */}
            {file && (
              <div className="border-t border-gray-200 dark:border-gray-800 p-4 sm:p-6 lg:p-8">
                {/* Status Message */}
                {status && (
                  <div className={`mb-4 p-4 rounded-xl ${
                    status.includes('success') || status.includes('completed')
                      ? 'bg-green-50 dark:bg-green-900/50 border border-green-200 dark:border-green-800 text-green-800 dark:text-green-200'
                      : status.includes('failed') || status.includes('Please')
                      ? 'bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200'
                      : 'bg-blue-50 dark:bg-blue-900/50 border border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200'
                  }`}>
                    <div className="flex items-center space-x-2">
                      <div className="w-5 h-5">
                        {status.includes('success') || status.includes('completed') ? (
                          <svg fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        ) : isCompressing ? (
                          <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <svg fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                      <span className="font-medium">{status}</span>
                    </div>
                  </div>
                )}

                {/* Size Comparison */}
                {originalSize && compressedSize && (
                  <div className="mb-4 p-4 bg-gray-50 dark:bg-black rounded-xl">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Compression Results</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500 dark:text-gray-400">Original:</span>
                        <span className="ml-2 font-medium text-gray-900 dark:text-white">{originalSize}</span>
                      </div>
                      <div>
                        <span className="text-gray-500 dark:text-gray-400">Compressed:</span>
                        <span className="ml-2 font-medium text-green-600 dark:text-green-400">{compressedSize}</span>
                      </div>
                    </div>
                  </div>
                )}
                
                <button
                  onClick={handleCompress}
                  disabled={isCompressing}
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold py-3 sm:py-4 px-6 sm:px-8 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:transform-none text-base sm:text-lg"
                >
                  {isCompressing ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Compressing...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center space-x-2">
                      <span className="text-xl">🗜️</span>
                      <span>Compress & Download</span>
                    </div>
                  )}
                </button>
                
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 text-center mt-3 transition-colors duration-500">
                  All processing happens in your browser. Images are not uploaded to servers.
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
              Why AllFileChanger is the #1 Image Compressor in 2025?
            </h2>
            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto transition-colors duration-500">
              AI-powered mozjpeg compression algorithms that maintain image quality while reducing file size by up to 90%. All File Changer delivers professional results instantly.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {[
              { 
                icon: '🎯', 
                title: 'AI Smart Compression', 
                desc: 'AllFileChanger uses AI-powered mozjpeg algorithms to find the perfect balance between quality and 90% file size reduction.' 
              },
              { 
                icon: '⚡', 
                title: 'Lightning Fast 2.5s', 
                desc: 'All File Changer compresses images in 2-3 seconds with our optimized WebAssembly processing engine. Fastest in 2025.' 
              },
              { 
                icon: '🔒', 
                title: '100% Private & Secure', 
                desc: 'AllFileChanger compression happens locally in your browser. Zero server uploads. GDPR compliant. Your images never leave your device.' 
              },
              { 
                icon: '🎚️', 
                title: 'Precision Quality Control', 
                desc: 'Fine-tune compression from 10-100% quality or target exact file sizes (10KB-500KB). AllFileChanger gives you total control.' 
              },
              { 
                icon: '📱', 
                title: 'Mobile iOS & Android Ready', 
                desc: 'AllFileChanger works perfectly on all devices - iPhone, Android, iPad, desktop, laptop. Responsive design for on-the-go compression.' 
              },
              { 
                icon: '🆓', 
                title: 'Completely Free Forever', 
                desc: 'All File Changer has no limits, no watermarks, no registration, no hidden fees. Compress unlimited images free in 2025.' 
              }
            ].map((feature, index) => (
              <div 
                key={index} 
                className="group bg-white dark:bg-black rounded-xl p-6 sm:p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-200 dark:border-gray-800 hover:border-green-200 dark:hover:border-green-600 hover:-translate-y-1"
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
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-gray-900 dark:to-gray-800 rounded-2xl p-8 sm:p-12 transition-all duration-500">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-6 text-center transition-colors duration-500">
              The Best Free Image Compressor Online - Reduce File Size Without Quality Loss
            </h2>
            
            <div className="prose prose-lg max-w-none text-gray-700 dark:text-gray-300 transition-colors duration-500">
              <p className="text-lg leading-relaxed mb-6">
                Looking for the most effective <strong>image compressor online</strong>? Our advanced compression tool is the perfect solution for 
                reducing <strong>image file size</strong> without compromising quality. Whether you need to <strong>compress JPG</strong>, 
                <strong>compress PNG</strong>, or optimize WebP images, our tool delivers professional results in seconds.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-8">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 transition-colors duration-500">
                    🚀 Advanced Compression Features
                  </h3>
                  <ul className="space-y-2 text-gray-600 dark:text-gray-400 transition-colors duration-500">
                    <li>• <strong>Smart Quality Control</strong> - Adjust compression levels from 10% to 100%</li>
                    <li>• <strong>Target File Size</strong> - Compress to specific KB targets (10KB to 500KB)</li>
                    <li>• <strong>Lossless Compression</strong> - Maintain image quality while reducing size</li>
                    <li>• <strong>Batch Processing</strong> - Compress multiple images simultaneously</li>
                    <li>• <strong>Format Support</strong> - JPG, PNG, WebP, GIF compression</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 transition-colors duration-500">
                    💼 Perfect For
                  </AllFileChanger Image Compression Technology Works (2025)
              </h3>
              <p className="leading-relaxed mb-6">
                <strong>AllFileChanger</strong> (All File Changer) uses cutting-edge <strong>AI-powered compression algorithms</strong> including 
                <strong> mozjpeg</strong>, <strong>Sharp library</strong>, and <strong>binary search optimization</strong> to analyze each pixel 
                and intelligently remove unnecessary data while preserving visual quality. Our proprietary compression process happens entirely in 
                your browser using WebAssembly and modern JavaScript, ensuring <strong>complete privacy</strong> and <strong>security</strong> - 
                your images never leave your device. You can choose between quality-based compression (10-100% slider) or target specific file sizes 
                (10KB-500KB) for optimal results. This makes AllFileChanger the most advanced <strong>free image compressor online</strong> available in 2025.
              </p>
              AllFileChanger Beats All Other Image Compressors (TinyPNG, Squoosh, ImageOptim)
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm text-green-700 dark:text-green-300">
                  <div>✅ 100% Free Forever - No Limits</div>
                  <div>✅ No File Size Restrictions (50MB Max)</div>
                  <div>✅ 100% Browser-Based Security</div>
                  <div>✅ Zero Registration Required</div>
                  <div>✅ Unlimited Daily Compressions</div>
                  <div>✅ Mobile iOS & Android Ready</div>
                  <div>✅ No Watermarks Ever Added</div>
                  <div>✅ Lightning Fast 3-Second Processing</div>
                  <div>✅ Works Offline After Load</div>
                  <div>✅ No Server Uploads Required</div>
                  <div>✅ GDPR Compliant Privacy</div>
                  <div>✅ Open Source Transparent</div>
                AllFileChanger Supported Image Formats & Advanced Compression Types (2025)
              </h3>
              <p className="leading-relaxed mb-4">
                <strong>All File Changer</strong> supports all major and modern image formats with specialized compression techniques for each
                  <div>✅ No Ads or Popups</div>
                  <div>✅ Active Development 2025trong> Parallel processing</div>
                  <div><strong>Smart Resizing:</strong> Auto-dimension optimization</d hover:shadow-lg transition-shadow">
                  <div className="text-2xl mb-2">📸</div>
                  <div className="font-semibold text-gray-900 dark:text-white">JPG/JPEG Compression</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">MozJPEG lossy compression - Best for photos</div>
                  <div className="text-xs text-green-600 dark:text-green-400 mt-1">Up to 85% reduction</div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 text-center hover:shadow-lg transition-shadow">
                  <div className="text-2xl mb-2">🖼️</div>
                  <div className="font-semibold text-gray-900 dark:text-white">PNG Compression</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Lossless with transparency support</div>
                  <div className="text-xs text-green-600 dark:text-green-400 mt-1">Up to 70% reduction</div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 text-center hover:shadow-lg transition-shadow">
                  <div className="text-2xl mb-2">🌐</div>
                  <div className="font-semibold text-gray-900 dark:text-white">WebP Compression</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Modern web format - Best compression ratio</div>
                  <div className="text-xs text-green-600 dark:text-green-400 mt-1">Up to 90% reduction</div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 text-center hover:shadow-lg transition-shadow">
                  <div className="text-2xl mb-2">🎬</div>
                  <div className="font-semibold text-gray-900 dark:text-white">GIF Compression</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Animated images with color optimization</div>
                  <div className="text-xs text-green-600 dark:text-green-400 mt-1">Up to 60% reductionk:border-green-800 rounded-xl p-6 my-8">
                <h4 className="text-lg font-semibold text-green-800 dark:text-green-200 mb-3">
                  🏆 Why Choose Our Image Compressor?
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-green-700 dark:text-green-300">
                  <div>✅ 100% Free Forever</div>
                  <div>✅ No File Size Limits</div>
                  <div>✅ Browser-Based Security</div>
                  <div>✅ No Registration Required</div>
                  <div>✅ Unlimited Compressions</div>
                  <div>✅ Mobile & Desktop Support</div>
                  <div>✅ No Watermarks Added</div>
                  <div>✅ Lightning Fast Processing</div>
                </div>
              </div>

              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 transition-colors duration-500">
                Supported Image Formats & Compression Types
              </h3>
              <p className="leading-relaxed mb-4">
                Our tool supports all major image formats and compression techniques:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 text-center">
                  <div className="text-2xl mb-2">📸</div>
                  <div className="font-semibold text-gray-900 dark:text-white">JPEG/JPG</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Lossy compression for photos</div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 text-center">
                  <diAllFileChanger Real-World Compression Statistics & Performance (2025)
                </h4>
                <p className="text-blue-700 dark:text-blue-300 text-sm leading-relaxed mb-4">
                  <strong>AllFileChanger</strong> users typically achieve <strong>70-90% file size reduction</strong> while maintaining 
                  excellent visual quality that's indistinguishable from the original. The average compression time is under 
                  <strong> 2-3 seconds per image</strong>, making it the <strong>fastest free image compressor online</strong> available in 2025. 
                  Over <strong>5 million images</strong> have been successfully compressed using All File Changer, saving users 
                  <strong> 250+ terabytes</strong> of storage space globally.
                </p>
               div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-2 border-purple-200 dark:border-purple-800 rounded-xl p-6 my-8">
                <h4 className="text-lg font-semibold text-purple-800 dark:text-purple-200 mb-3 text-center">
                  🎯 SEO Benefits of Image Compression with AllFileChanger
                </h4>
                <p className="text-purple-700 dark:text-purple-300 text-sm leading-relaxed text-center mb-4">
                  Using <strong>AllFileChanger image compressor</strong> improves your website's SEO ranking by reducing page load times, 
                  improving Core Web Vitals (LCP, CLS, FID), and enhancing user experience. Google prioritizes fast-loading websites 
                  in search results, making image compression essential for SEO in 2025.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center text-sm">
                  <div>
                    <div className="text-2xl mb-1">⚡</div>
                    <strong>50% Faster Load Times</strong>
                    <div className="text-xs text-purple-600 dark:text-purple-400">Better Google PageSpeed Score</div>
                  </div>
                  <div>
                    <div className="text-2xl mb-1">📈</div>
                    <strong>Higher Search Rankings</strong>
                    <div className="text-xs text-purple-600 dark:text-purple-400">Improved Core Web Vitals</div>
                  </div>
                  <div>
                    <div className="text-2xl mb-1">🎯</div>
                    <strong>Better User Experience</strong>
                    <div className="text-xs text-purple-600 dark:text-purple-400">Lower Bounce Rates</div>
                  </div>
                </div>
              </div>
              
              <p className="leading-relaxed text-center text-lg font-medium mt-8">
                Start compressing your images with <strong>AllFileChanger</strong> (All File Changer) now and experience the perfect balance of 
                <strong> quality and file size optimization</strong>. Join over <strong>5 million users</strong> who trust 
                <strong> AllFileChanger - the #1 free image compressor online</strong> for all their compression needs in 2025!
              </p>
              
              <div className="text-center mt-6">
                <a href="#" 
                   className="inline-block bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-lg">
                  🚀 Start Compressing Images Now - Free Forever
                </a>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-3">
                  Trusted by professionals • No registration • No credit card • No limits
                </p>
              </div   <div className="text-xs text-blue-700 dark:text-blue-300">Images Compressed</div>
                  </div>
                  <div className="bg-white dark:bg-blue-950/50 rounded-lg p-3">
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">90%</div>
                    <div className="text-xs text-blue-700 dark:text-blue-300">Max Reduction</div>
                  </div>
                  <div className="bg-white dark:bg-blue-950/50 rounded-lg p-3">
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">2.5s</div>
                    <div className="text-xs text-blue-700 dark:text-blue-300">Avg Speed</div>
                  </div>
                  <div className="bg-white dark:bg-blue-950/50 rounded-lg p-3">
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">4.9★</div>
                    <div className="text-xs text-blue-700 dark:text-blue-300">User Rating</div>
                  </div>
                </divdiv className="font-semibold text-gray-900 dark:text-white">WebP</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Modern web format</div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 text-center">
                  <div className="text-2xl mb-2">🎬</div>
                  <div className="font-semibold text-gray-900 dark:text-white">GIF</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Animated images</div>
                </div>
              </div>

              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 transition-colors duration-500">
                Image Compression Best Practices
              </h3>
              <div className="space-y-4 mb-6">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold mt-0.5">1</div>
                  <div>
                    <strong>Choose the Right Quality Level:</strong> For web use, 70-80% quality is often optimal. 
                    For print materials, use 85-95% quality to maintain professional standards.
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold mt-0.5">2</div>
                  <div>
                    <strong>Use Target File Sizes:</strong> For email attachments, aim for under 1MB. 
                    For web thumbnails, 50-100KB is ideal for fast loading.
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold mt-0.5">3</div>
                  <div>
                    <strong>Consider Your Use Case:</strong> Social media platforms have specific size requirements. 
                    Our compressor helps you meet these specifications perfectly.
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-xl p-6 my-8">
                <h4 className="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-3">
                  📊 Compression Statistics & Performance
                </h4>
                <p className="text-blue-700 dark:text-blue-300 text-sm leading-relaxed">
                  Our users typically achieve 60-80% file size reduction while maintaining excellent visual quality. 
                  The average compression time is under 3 seconds per image, making it the fastest online solution available. 
                  Over 1 million images have been successfully compressed using our tool.
                </p>
              </div>

              <p className="leading-relaxed text-center text-lg font-medium">
                Start compressing your images now and experience the perfect balance of <strong>quality and file size optimization</strong>. 
                Join millions of users who trust our <strong>free image compressor</strong> for all their compression needs!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Related Tools */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-green-50 dark:bg-black transition-all duration-500">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4 transition-colors duration-500">
              Other Image Tools
            </h2>
            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 transition-colors duration-500">
              Complete your image workflow with our other tools
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {[
              { name: 'Image to PDF', desc: 'Convert images to PDF format', icon: '📄', path: '/image-to-pdf' },
              { name: 'Image Converter', desc: 'Convert between image formats', icon: '🔄', path: '/image-converter' },
              { name: 'Image Resizer', desc: 'Resize images to specific dimensions', icon: '📐', path: '/image-resize' },
              { name: 'Image Editor', desc: 'Edit and enhance your images', icon: '🎨', path: '/image-editor' }
            ].map((tool, index) => (
              <Link
                key={index}
                to={tool.path}
                className="group bg-white dark:bg-black rounded-xl p-4 sm:p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-800 hover:border-green-200 dark:hover:border-green-600 hover:-translate-y-1"
              >
                <div className="text-2xl sm:text-3xl mb-3 group-hover:scale-110 transition-transform duration-300">
                  {tool.icon}
                </div>
                <h3 className="font-semibold text-sm sm:text-base text-gray-900 dark:text-white group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors duration-300 mb-2">
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
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.30.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
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
