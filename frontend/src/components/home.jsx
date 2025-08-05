import React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  const imageTools = [
    { name: 'Image to PDF', desc: 'Convert JPG, PNG to PDF instantly', icon: '📄', path: '/image-to-pdf', popular: true },
    { name: 'Image Compressor', desc: 'Reduce image file size without quality loss', icon: '🗜️', path: '/image-compressor' },
    { name: 'Image Converter', desc: 'Convert between JPG, PNG, WebP formats', icon: '🔄', path: '/image-converter' },
    { name: 'Resize Images', desc: 'Resize by dimensions or percentage', icon: '📏', path: '/image-resize' },
    { name: 'Rotate/Flip Images', desc: 'Rotate and flip images easily', icon: '🔄', path: '/image-rotate' },
    { name: 'Crop Images', desc: 'Crop images to perfect dimensions', icon: '✂️', path: '/image-crop' },
    { name: 'Add Watermark', desc: 'Add text or image watermarks', icon: '💧', path: '/image-watermark' },
    { name: 'Remove Background', desc: 'Remove background from images', icon: '🖼️', path: '/remove-background' },
    { name: 'Image Editor', desc: 'Basic editing tools for images', icon: '🎨', path: '/image-editor' }
  ];

  const pdfTools = [
    { name: 'PDF Merger', desc: 'Combine multiple PDFs into one', icon: '📑', path: '/pdf-merge', popular: true },
    { name: 'PDF Splitter', desc: 'Split PDF into separate pages', icon: '✂️', path: '/pdf-split' },
    { name: 'PDF Compressor', desc: 'Reduce PDF file size', icon: '🗜️', path: '/pdf-compress' },
    { name: 'PDF to Word', desc: 'Convert PDF to editable Word document', icon: '📝', path: '/pdf-to-word', popular: true },
    { name: 'Word to PDF', desc: 'Convert Word documents to PDF', icon: '📄', path: '/word-to-pdf' },
    { name: 'PDF to Excel', desc: 'Extract tables from PDF to Excel', icon: '📊', path: '/pdf-to-excel' },
    { name: 'PDF to PowerPoint', desc: 'Convert PDF to PowerPoint slides', icon: '📊', path: '/pdf-to-ppt' },
    { name: 'Protect PDF', desc: 'Add password protection to PDFs', icon: '🔒', path: '/pdf-protect' },
    { name: 'Unlock PDF', desc: 'Remove password from PDFs', icon: '🔓', path: '/pdf-unlock' }
  ];

  const documentTools = [
    { name: 'Word Converter', desc: 'Convert Word to various formats', icon: '📝', path: '/word-converter' },
    { name: 'Excel Converter', desc: 'Convert Excel spreadsheets', icon: '📊', path: '/excel-converter' },
    { name: 'PowerPoint Converter', desc: 'Convert presentations', icon: '📊', path: '/ppt-converter' },
    { name: 'Text Extractor', desc: 'Extract text from documents', icon: '📄', path: '/text-extractor' },
    { name: 'OCR Scanner', desc: 'Convert images to editable text', icon: '🔍', path: '/ocr-scanner' },
    { name: 'Document Merger', desc: 'Merge multiple documents', icon: '📑', path: '/doc-merge' },
    { name: 'Format Converter', desc: 'Convert between document formats', icon: '🔄', path: '/format-converter' }
  ];

  const ToolCard = ({ tool }) => (
    <Link 
      to={tool.path}
      className="group relative bg-white dark:bg-black rounded-xl shadow-md hover:shadow-xl dark:shadow-gray-800/50 transition-all duration-500 p-4 sm:p-6 border border-gray-100 dark:border-gray-800 hover:border-blue-200 dark:hover:border-blue-600 hover:-translate-y-1 transform-gpu"
    >
      {tool.popular && (
        <div className="absolute -top-2 -right-2 bg-gradient-to-r from-orange-400 to-red-500 text-white text-xs font-bold px-2 sm:px-3 py-1 rounded-full shadow-lg transition-all duration-300">
          Popular
        </div>
      )}
      <div className="flex items-start space-x-3 sm:space-x-4">
        <div className="text-2xl sm:text-3xl flex-shrink-0 transition-transform duration-300 group-hover:scale-110">{tool.icon}</div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-sm sm:text-base text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300 mb-1 sm:mb-2 leading-tight">
            {tool.name}
          </h3>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed transition-colors duration-500">{tool.desc}</p>
        </div>
        <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
          <svg className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </Link>
  );

  return (
    <div className="min-h-screen bg-white dark:bg-black transition-all duration-500">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-800 dark:from-black dark:via-gray-900 dark:to-black">
        <div className="absolute inset-0 bg-black/20 dark:bg-black/60 transition-all duration-500"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24 lg:py-32">
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6 transition-all duration-500 leading-tight">
              All-in-One <span className="text-yellow-300 dark:text-yellow-400">File Converter</span>
            </h1>
            <p className="text-lg sm:text-xl lg:text-2xl text-blue-100 dark:text-gray-200 max-w-3xl mx-auto mb-6 sm:mb-8 transition-all duration-500 px-4">
              Convert, compress, merge, and edit your files instantly. 
              <strong className="text-white"> 25+ tools</strong> in one powerful platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center px-4">
              <button 
                onClick={() => {
                  const imageToolsSection = document.getElementById('image-tools-section');
                  if (imageToolsSection) {
                    imageToolsSection.scrollIntoView({ 
                      behavior: 'smooth',
                      block: 'start'
                    });
                  }
                }}
                className="group inline-flex items-center px-6 sm:px-8 py-3 sm:py-4 bg-yellow-400 hover:bg-yellow-300 dark:bg-yellow-500 dark:hover:bg-yellow-400 text-gray-900 font-bold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 w-full sm:w-auto justify-center cursor-pointer"
              >
                <span className="mr-2 text-lg sm:text-xl">🚀</span>
                Start Converting Now
                <svg className="ml-2 w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
              <div className="text-blue-100 dark:text-gray-300 text-xs sm:text-sm transition-colors duration-500 text-center">
                ✓ Free Forever  ✓ No Registration  ✓ Secure Processing
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-white dark:bg-black border-b border-gray-100 dark:border-gray-800 transition-all duration-500">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8 text-center">
            <div className="group">
              <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-blue-600 dark:text-blue-400 mb-1 sm:mb-2 group-hover:scale-110 transition-all duration-300">25+</div>
              <div className="text-xs sm:text-sm lg:text-base text-gray-600 dark:text-gray-300 font-medium transition-colors duration-500">Conversion Tools</div>
            </div>
            <div className="group">
              <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-green-600 dark:text-green-400 mb-1 sm:mb-2 group-hover:scale-110 transition-all duration-300">1M+</div>
              <div className="text-xs sm:text-sm lg:text-base text-gray-600 dark:text-gray-300 font-medium transition-colors duration-500">Files Converted</div>
            </div>
            <div className="group">
              <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-purple-600 dark:text-purple-400 mb-1 sm:mb-2 group-hover:scale-110 transition-all duration-300">100%</div>
              <div className="text-xs sm:text-sm lg:text-base text-gray-600 dark:text-gray-300 font-medium transition-colors duration-500">Free to Use</div>
            </div>
            <div className="group">
              <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-red-600 dark:text-red-400 mb-1 sm:mb-2 group-hover:scale-110 transition-all duration-300">24/7</div>
              <div className="text-xs sm:text-sm lg:text-base text-gray-600 dark:text-gray-300 font-medium transition-colors duration-500">Always Available</div>
            </div>
          </div>
        </div>
      </section>

      {/* Image Tools Section */}
      <section id="image-tools-section" className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-blue-50 dark:bg-black transition-all duration-500">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-2xl mb-6 shadow-lg transition-all duration-300 hover:scale-110">
              <span className="text-2xl text-white">🖼️</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4 transition-colors duration-500">Image Tools</h2>
            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto transition-colors duration-500 px-4">
              Transform your images with professional-grade tools. Convert, compress, resize, and enhance with ease.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {imageTools.map((tool, index) => (
              <ToolCard key={index} tool={tool} />
            ))}
          </div>
        </div>
      </section>

      {/* PDF Tools Section */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-red-50 dark:bg-black transition-all duration-500">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-red-500 to-pink-600 rounded-2xl mb-6 shadow-lg transition-all duration-300 hover:scale-110">
              <span className="text-2xl text-white">📄</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4 transition-colors duration-500">PDF Tools</h2>
            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto transition-colors duration-500 px-4">
              Powerful PDF utilities for all your document needs. Merge, split, compress, and secure your PDFs.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {pdfTools.map((tool, index) => (
              <ToolCard key={index} tool={tool} />
            ))}
          </div>
        </div>
      </section>

      {/* Document Tools Section */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-green-50 dark:bg-black transition-all duration-500">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-500 to-teal-600 rounded-2xl mb-6 shadow-lg transition-all duration-300 hover:scale-110">
              <span className="text-2xl text-white">📝</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4 transition-colors duration-500">Document Tools</h2>
            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto transition-colors duration-500 px-4">
              Convert and manage Office documents. Word, Excel, PowerPoint - we've got you covered.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {documentTools.map((tool, index) => (
              <ToolCard key={index} tool={tool} />
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-purple-700 dark:from-black dark:to-gray-900 transition-all duration-500">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-16 transition-all duration-500">Why Choose AllFileChanger?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white/10 dark:bg-black/30 backdrop-blur-sm rounded-xl p-6 text-white transition-all duration-500 hover:bg-white/20 dark:hover:bg-black/40 hover:-translate-y-2 transform cursor-pointer">
              <div className="text-4xl mb-4 transition-transform duration-300 hover:scale-110">🚀</div>
              <h3 className="text-xl font-semibold mb-2">Lightning Fast</h3>
              <p className="text-blue-100 dark:text-gray-300 transition-colors duration-500">Convert files in seconds with our optimized servers</p>
            </div>
            <div className="bg-white/10 dark:bg-black/30 backdrop-blur-sm rounded-xl p-6 text-white transition-all duration-500 hover:bg-white/20 dark:hover:bg-black/40 hover:-translate-y-2 transform cursor-pointer">
              <div className="text-4xl mb-4 transition-transform duration-300 hover:scale-110">🔒</div>
              <h3 className="text-xl font-semibold mb-2">100% Secure</h3>
              <p className="text-blue-100 dark:text-gray-300 transition-colors duration-500">Your files are processed securely and deleted automatically</p>
            </div>
            <div className="bg-white/10 dark:bg-black/30 backdrop-blur-sm rounded-xl p-6 text-white transition-all duration-500 hover:bg-white/20 dark:hover:bg-black/40 hover:-translate-y-2 transform cursor-pointer">
              <div className="text-4xl mb-4 transition-transform duration-300 hover:scale-110">💯</div>
              <h3 className="text-xl font-semibold mb-2">Always Free</h3>
              <p className="text-blue-100 dark:text-gray-300 transition-colors duration-500">No hidden fees, no subscriptions, no limits</p>
            </div>
            <div className="bg-white/10 dark:bg-black/30 backdrop-blur-sm rounded-xl p-6 text-white transition-all duration-500 hover:bg-white/20 dark:hover:bg-black/40 hover:-translate-y-2 transform cursor-pointer">
              <div className="text-4xl mb-4 transition-transform duration-300 hover:scale-110">📱</div>
              <h3 className="text-xl font-semibold mb-2">Any Device</h3>
              <p className="text-blue-100 dark:text-gray-300 transition-colors duration-500">Works perfectly on mobile, tablet, and desktop</p>
            </div>
          </div>
        </div>
      </section>

      {/* SEO Content Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-black transition-all duration-500">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-8 sm:p-12 transition-all duration-500 border border-gray-200 dark:border-gray-800">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center transition-colors duration-500">
              The Ultimate File Conversion Platform
            </h2>
            <div className="prose prose-lg max-w-none text-gray-700 dark:text-gray-300 transition-colors duration-500">
              <p className="text-xl leading-relaxed mb-6">
                <strong>AllFileChanger.shop</strong> is your go-to solution for all file conversion needs. 
                Whether you need to <strong>convert images to PDF</strong>, <strong>compress images</strong>, 
                <strong>merge PDF files</strong>, or <strong>convert documents</strong>, we provide fast, 
                secure, and free tools that work instantly in your browser.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-12">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 transition-colors duration-500">🎯 Most Popular Tools</h3>
                  <ul className="space-y-2 text-gray-600 dark:text-gray-400 transition-colors duration-500">
                    <li>• Image to PDF Converter</li>
                    <li>• PDF to Word Converter</li>
                    <li>• Image Compressor</li>
                    <li>• PDF Merger</li>
                    <li>• Image Resizer</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 transition-colors duration-500">✨ Key Features</h3>
                  <ul className="space-y-2 text-gray-600 dark:text-gray-400 transition-colors duration-500">
                    <li>• No registration required</li>
                    <li>• Process files instantly</li>
                    <li>• Maximum file security</li>
                    <li>• Mobile-friendly design</li>
                    <li>• Unlimited conversions</li>
                  </ul>
                </div>
              </div>

              <p className="leading-relaxed">
                Our platform supports all major file formats including <strong>JPG, PNG, PDF, Word, Excel, PowerPoint</strong>, 
                and many more. With over 25 specialized tools, you can handle any file conversion task efficiently. 
                All processing happens securely in the cloud, ensuring your files remain private and are automatically 
                deleted after conversion.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Additional SEO Content Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-black transition-all duration-500">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Left Column - SEO Rich Content */}
            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 transition-colors duration-500">
                  🚀 Best Online File Converter 2025
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed transition-colors duration-500">
                  AllFileChanger.shop is the <strong>most trusted online file converter</strong> with over 1 million files converted daily. 
                  Our <strong>free file conversion tools</strong> support all popular formats and deliver professional results instantly. 
                  No software downloads required - everything works directly in your browser.
                </p>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 transition-colors duration-500">
                  📄 PDF Conversion Specialists
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed transition-colors duration-500">
                  Convert <strong>images to PDF</strong>, <strong>PDF to Word</strong>, <strong>PDF to Excel</strong>, and more. 
                  Our advanced PDF tools handle complex documents while maintaining perfect formatting. 
                  Merge multiple PDFs, split large files, or compress without quality loss.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 transition-colors duration-500">
                  🖼️ Image Processing Excellence
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed transition-colors duration-500">
                  Professional <strong>image compression</strong>, <strong>format conversion</strong>, and <strong>resizing tools</strong>. 
                  Convert between JPG, PNG, WebP, and other formats. Remove backgrounds, add watermarks, 
                  or edit images with our comprehensive suite of tools.
                </p>
              </div>
            </div>

            {/* Right Column - Features & Benefits */}
            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 transition-colors duration-500">
                  ⭐ Why Users Choose Us
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white transition-colors duration-500">Lightning Fast Processing</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-500">Convert files in under 10 seconds with our optimized servers</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white transition-colors duration-500">Bank-Level Security</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-500">SSL encryption and automatic file deletion after 24 hours</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white transition-colors duration-500">100% Free Forever</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-500">No hidden costs, premium features, or usage limits</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white transition-colors duration-500">Mobile Optimized</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-500">Perfect experience on phones, tablets, and desktop</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 rounded-xl p-6 transition-all duration-500">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 transition-colors duration-500">
                  🏆 Trusted by Professionals
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-300 transition-colors duration-500">
                  "AllFileChanger has become our go-to tool for all document conversions. 
                  The speed and quality are unmatched, and the fact that it's completely free makes it incredible value."
                </p>
                <div className="flex items-center mt-3 space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                  <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">5.0 from 10k+ users</span>
                </div>
              </div>
            </div>
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
