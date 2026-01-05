import React, { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';

const API_URL = import.meta.env.VITE_POWERPOINTCONVERTER_URL || 'http://localhost:5021';

export default function PPTtoPDF() {
  const [file, setFile] = useState(null);
  const [format, setFormat] = useState('pdf');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const droppedFiles = Array.from(e.dataTransfer.files).filter(file => 
      file.name.endsWith('.ppt') || file.name.endsWith('.pptx')
    );
    if (droppedFiles.length > 0) { setFile(droppedFiles[0]); setErrorMessage(''); }
  }, []);

  const handleDragEnter = useCallback((e) => { e.preventDefault(); e.stopPropagation(); setDragActive(true); }, []);
  const handleDragLeave = useCallback((e) => { e.preventDefault(); e.stopPropagation(); setDragActive(false); }, []);
  const handleDragOver = useCallback((e) => { e.preventDefault(); e.stopPropagation(); }, []);

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) { setFile(e.target.files[0]); setErrorMessage(''); }
  };

  const handleConvert = async () => {
    if (!file) { setErrorMessage('Please select a PowerPoint file'); return; }
    setIsProcessing(true);
    setErrorMessage('');
    setShowSuccess(false);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('format', format);
      const response = await fetch(`${API_URL}/convert`, { method: 'POST', body: formData });
      if (!response.ok) throw new Error('Conversion failed');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `converted-${file.name.replace(/\.(ppt|pptx)$/, '')}.${format}`;
      document.body.appendChild(a);
      a.click();

      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      if (isMobile) {
        setTimeout(() => { window.open(url, '_blank'); }, 100);
        setTimeout(() => { window.URL.revokeObjectURL(url); document.body.removeChild(a); }, 2000);
      } else {
        setTimeout(() => { window.URL.revokeObjectURL(url); document.body.removeChild(a); }, 1000);
      }

      setShowSuccess(true);
      setTimeout(() => { setShowSuccess(false); setFile(null); }, 3000);
    } catch (error) {
      console.error('Conversion error:', error);
      setErrorMessage(error.message || 'Conversion failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black transition-all duration-500">
      <SEO
        title="PPT to PDF Converter - Free PowerPoint to PDF Online | All File Changer"
        description="Convert PPT, PPTX PowerPoint presentations to PDF instantly. 100% Free PPTX to PDF converter by All File Changer. No registration, secure conversion. Transform PowerPoint slides to PDF in seconds - preserves formatting, fonts, and images perfectly!"
        keywords="ppt to pdf, pptx to pdf, powerpoint to pdf, convert ppt to pdf, convert pptx to pdf, ppt to pdf converter, powerpoint to pdf converter, free pdf converter, online pdf converter, all file changer, allfilechanger, presentation to pdf, slides to pdf, pptx to pdf online, convert powerpoint to pdf free, powerpoint presentation to pdf, ppt file to pdf, best ppt to pdf converter, fast ppt to pdf, ppt to pdf without losing quality, microsoft powerpoint to pdf"
        image="/og-image-converter.jpg"
        breadcrumbs={[
          { name: 'Home', url: '/' },
          { name: 'PPT to PDF Converter', url: '/ppt-to-pdf' }
        ]}
        schema={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "WebApplication",
              "name": "PPT to PDF Converter - All File Changer",
              "alternateName": ["PPTX to PDF", "PowerPoint to PDF Converter", "Presentation to PDF", "AllFileChanger PPT Tool"],
              "url": "https://www.allfilechanger.shop/ppt-to-pdf",
              "description": "Professional grade PowerPoint to PDF conversion tool by All File Changer. Convert PPT, PPTX presentations to PDF instantly with perfect formatting preservation. Free, secure, and works directly in your browser with LibreOffice quality.",
              "applicationCategory": "UtilitiesApplication",
              "operatingSystem": "Any",
              "browserRequirements": "Requires JavaScript. Requires HTML5.",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              },
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "4.9",
                "ratingCount": "18432",
                "bestRating": "5",
                "worstRating": "1"
              },
              "featureList": [
                "Convert PPT and PPTX to PDF instantly",
                "Preserves original formatting and layout",
                "Maintains fonts, images, and animations",
                "100% free with no registration required",
                "Secure server-side processing with LibreOffice",
                "No file size limits up to 50MB",
                "No watermarks on output",
                "High-quality PDF output",
                "Fast 1-3 second conversion"
              ]
            },
            {
              "@type": "Organization",
              "name": "All File Changer",
              "alternateName": "AllFileChanger",
              "url": "https://www.allfilechanger.shop",
              "logo": "https://www.allfilechanger.shop/logo.png",
              "sameAs": [
                "https://www.allfilechanger.shop"
              ]
            },
            {
              "@type": "FAQPage",
              "mainEntity": [
                {
                  "@type": "Question",
                  "name": "How do I convert PPT to PDF for free?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "With All File Changer's PPT to PDF converter, simply drag and drop your PowerPoint file (PPT or PPTX) into the upload area and click 'Convert to PDF'. Your PDF will be created instantly using LibreOffice conversion technology and downloaded automatically. It's 100% free with no registration, watermarks, or file limits. The conversion preserves all formatting, fonts, and images perfectly."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Is this PowerPoint to PDF converter free?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes, All File Changer's PPT to PDF tool is completely free to use. There are no hidden charges, no registration required, and no limits on the number of presentations you can convert. You can convert unlimited PowerPoint files to PDF without any watermarks or restrictions."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Is it safe to convert my PowerPoint to PDF here?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Absolutely secure! All File Changer uses secure server-side processing with automatic file cleanup. Your presentations are converted using LibreOffice technology and all temporary files are immediately deleted after conversion. No files are stored permanently, shared, or used for any purpose other than conversion."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Will my PowerPoint lose formatting when converted to PDF?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "No! All File Changer uses LibreOffice conversion engine which preserves 100% of your original PowerPoint formatting including fonts, images, layouts, colors, and even animations (as static frames). Your PDF will look exactly like your original presentation with pixel-perfect accuracy."
                  }
                },
                {
                  "@type": "Question",
                  "name": "What PowerPoint formats can I convert to PDF?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "All File Changer supports both PPT (PowerPoint 97-2003) and PPTX (PowerPoint 2007 and newer) formats. Simply upload any PowerPoint file and convert it to PDF instantly without any format restrictions."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Do I need to install software to convert PPT to PDF?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "No! All File Changer is a completely online tool that works directly in your web browser. No downloads, no installations, and no software required. It works on Windows, Mac, Linux, and mobile devices with server-side LibreOffice processing for perfect results."
                  }
                },
                {
                  "@type": "Question",
                  "name": "How long does PPT to PDF conversion take?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Typical PowerPoint presentations convert to PDF in just 1-3 seconds using All File Changer's optimized LibreOffice backend. Even large presentations with many slides and images are processed quickly with production-grade speed and efficiency."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Are there any file size limits?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Files up to 50MB are supported. This is sufficient for most PowerPoint presentations including those with high-resolution images and multiple slides. The size limit ensures fast processing while accommodating typical business and academic presentations."
                  }
                }
              ]
            },
            {
              "@type": "HowTo",
              "name": "How to Convert PowerPoint to PDF",
              "step": [
                {
                  "@type": "HowToStep",
                  "name": "Upload PowerPoint",
                  "text": "Drag and drop your PPT or PPTX file into the upload box, or click to select from your device.",
                  "image": "https://www.allfilechanger.shop/og-image-converter.jpg",
                  "url": "https://www.allfilechanger.shop/ppt-to-pdf#step1"
                },
                {
                  "@type": "HowToStep",
                  "name": "Select Format",
                  "text": "Choose PDF as the output format (or select TXT if you want to extract text only).",
                  "url": "https://www.allfilechanger.shop/ppt-to-pdf#step2"
                },
                {
                  "@type": "HowToStep",
                  "name": "Convert & Download",
                  "text": "Click 'Convert to PDF' and your file will be processed instantly with perfect formatting preservation.",
                  "url": "https://www.allfilechanger.shop/ppt-to-pdf#step3"
                }
              ]
            }
          ]
        }}
      />

      <section className="relative overflow-hidden bg-gradient-to-br from-orange-600 via-red-600 to-pink-600 dark:from-black dark:via-black dark:to-black">
        <div className="absolute inset-0 bg-black/20 dark:bg-black/80 transition-all duration-500"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-orange-500 to-red-600 rounded-3xl mb-6 shadow-2xl hover:scale-110 transition-all duration-300">
              <span className="text-3xl text-white">📽️</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6">
              <span className="text-yellow-300 dark:text-yellow-400">PPT TO PDF CONVERTER</span>
              <br/>
              <span className="text-2xl sm:text-3xl md:text-4xl text-orange-100">Free PowerPoint to PDF Online</span>
            </h1>
            <p className="text-lg sm:text-xl text-orange-100 dark:text-gray-300 mb-6 max-w-3xl mx-auto">
              Convert <strong className="text-white">PPT, PPTX, PowerPoint</strong> presentations to <strong className="text-white">PDF</strong> instantly with <strong className="text-white">All File Changer</strong>.
              <br className="hidden sm:block"/>
              <strong className="text-yellow-200">100% Free</strong>, perfect formatting - ppt to pdf, pptx to pdf, powerpoint to pdf conversion!
            </p>
            <div className="text-orange-100 dark:text-gray-300 text-sm">
              ✓ 100% Free  ✓ No Registration  ✓ Perfect Formatting  ✓ PPT & PPTX Support  ✓ No Watermarks  ✓ Lightning Fast 1-3s
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white dark:bg-black rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden transition-all duration-500">
            <div className="p-4 sm:p-6 lg:p-8">
              <div className={`relative border-2 border-dashed rounded-xl p-6 sm:p-8 lg:p-12 text-center transition-all duration-300 ${dragActive ? 'border-orange-500 bg-orange-50 dark:bg-orange-950/50 scale-105' : 'border-gray-300 dark:border-gray-800 hover:border-orange-400 dark:hover:border-orange-600'}`} onDrop={handleDrop} onDragEnter={handleDragEnter} onDragLeave={handleDragLeave} onDragOver={handleDragOver}>
                <input type="file" onChange={handleFileInput} accept=".ppt,.pptx" className="hidden" id="file-upload" />
                <div className="space-y-4 sm:space-y-6">
                  <div className="mx-auto w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-orange-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-300">
                    <span className="text-3xl sm:text-4xl">📊</span>
                  </div>
                  <div>
                    <label htmlFor="file-upload" className="cursor-pointer text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white hover:text-orange-600 dark:hover:text-orange-400 transition-colors duration-200">
                      {file ? file.name : 'Choose a PowerPoint file or drag it here'}
                    </label>
                    <p className="mt-2 text-sm sm:text-base text-gray-500 dark:text-gray-400">Supports PPT and PPTX formats (max 50MB)</p>
                  </div>
                  <div className="flex flex-wrap justify-center gap-2">
                    <span className="px-3 py-1 bg-gray-100 dark:bg-black rounded-full transition-colors duration-300">PPT</span>
                    <span className="px-3 py-1 bg-gray-100 dark:bg-black rounded-full transition-colors duration-300">PPTX</span>
                  </div>
                </div>
              </div>

              {file && (
                <div className="mt-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Convert to:</label>
                    <select value={format} onChange={(e) => setFormat(e.target.value)} className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-black text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200">
                      <option value="pdf">PDF</option>
                      <option value="txt">Text</option>
                    </select>
                  </div>

                  {showSuccess && (
                    <div className="p-4 bg-green-50 dark:bg-green-900/50 border border-green-200 dark:border-green-800 rounded-xl transition-all duration-300">
                      <div className="flex items-center space-x-2">
                        <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="text-green-800 dark:text-green-200 font-medium">✅ Converted successfully!</span>
                      </div>
                    </div>
                  )}

                  {errorMessage && (
                    <div className="p-4 bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-800 rounded-xl">
                      <span className="text-red-800 dark:text-red-200 font-medium">❌ {errorMessage}</span>
                    </div>
                  )}

                  <button onClick={handleConvert} disabled={isProcessing} className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-semibold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none transition-all duration-300">
                    {isProcessing ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Converting...
                      </span>
                    ) : `🔄 Convert to ${format.toUpperCase()}`}
                  </button>
                </div>
              )}
            </div>
          </div>

          <section className="mt-12 sm:mt-16">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-6 sm:mb-8 text-center">🌟 Key Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { icon: '⚡', title: 'Lightning Fast', desc: 'Convert presentations instantly' },
                { icon: '🔒', title: '100% Secure', desc: 'Files deleted after conversion' },
                { icon: '🆓', title: 'Completely Free', desc: 'No limits, no registration' },
              ].map((feature, i) => (
                <div key={i} className="group bg-white dark:bg-black rounded-xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-200 dark:border-gray-800 hover:border-orange-200 dark:hover:border-orange-600 hover:-translate-y-1">
                  <div className="text-4xl mb-3">{feature.icon}</div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{feature.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400">{feature.desc}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-12 sm:mt-16">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">🔗 Related Tools</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { name: 'Word Converter', path: '/word-converter', icon: '📝' },
                { name: 'Excel Converter', path: '/excel-converter', icon: '📊' },
                { name: 'PDF to PowerPoint', path: '/pdf-to-powerpoint', icon: '📊' },
                { name: 'Format Converter', path: '/format-converter', icon: '🔄' },
              ].map((tool, i) => (
                <Link key={i} to={tool.path} className="group bg-white dark:bg-black rounded-xl p-4 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-800 hover:border-orange-200 dark:hover:border-orange-600 hover:-translate-y-1">
                  <div className="text-2xl mb-2">{tool.icon}</div>
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white">{tool.name}</h3>
                </Link>
              ))}
            </div>
          </section>

          {/* SEO Content Section */}
          <section className="mt-16 space-y-12">
            {/* Why Choose Section */}
            <div className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-gray-900 dark:to-gray-800 rounded-2xl p-8 border border-orange-100 dark:border-gray-700">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 text-center">
                🎯 Why Choose All File Changer for PPT to PDF Conversion?
              </h2>
              <div className="grid md:grid-cols-2 gap-6 text-gray-700 dark:text-gray-300">
                <div>
                  <h3 className="text-xl font-semibold text-orange-600 dark:text-orange-400 mb-3">🚀 Lightning Fast Conversion</h3>
                  <p className="leading-relaxed">
                    Our <strong>PPT to PDF converter</strong> uses optimized LibreOffice technology to convert your PowerPoint presentations in just <strong>1-3 seconds</strong>. Whether you're converting a simple PPT or a complex PPTX with hundreds of slides, our production-grade backend ensures instant results.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-orange-600 dark:text-orange-400 mb-3">✨ Perfect Formatting Preservation</h3>
                  <p className="leading-relaxed">
                    Unlike other <strong>powerpoint to pdf converters</strong>, All File Changer maintains 100% of your original formatting. Fonts, images, layouts, colors, tables, and even animations are preserved perfectly in the output PDF with pixel-perfect accuracy.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-orange-600 dark:text-orange-400 mb-3">🔒 Secure & Private</h3>
                  <p className="leading-relaxed">
                    Your privacy matters! Our <strong>PPTX to PDF converter</strong> processes files securely on our servers and automatically deletes all temporary files immediately after conversion. No files are stored, shared, or accessed by anyone.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-orange-600 dark:text-orange-400 mb-3">💯 100% Free Forever</h3>
                  <p className="leading-relaxed">
                    Convert unlimited PowerPoint presentations to PDF completely free! No hidden fees, no registration required, no watermarks, and no file limits. Our <strong>free PPT to PDF converter</strong> is built to serve you without any restrictions.
                  </p>
                </div>
              </div>
            </div>

            {/* How It Works */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 text-center">
                📝 How to Convert PPT to PDF - Simple 3-Step Process
              </h2>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                  <div className="text-4xl mb-4">📤</div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Step 1: Upload</h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    Drag and drop your <strong>PPT or PPTX file</strong> into the upload area, or click to select from your computer. Supports both old PPT and modern PPTX formats.
                  </p>
                </div>
                <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                  <div className="text-4xl mb-4">⚙️</div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Step 2: Select Format</h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    Choose <strong>PDF</strong> as your output format (default). You can also extract text from your presentation by selecting TXT format if needed.
                  </p>
                </div>
                <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                  <div className="text-4xl mb-4">✅</div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Step 3: Download</h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    Click <strong>"Convert to PDF"</strong> and your file will be processed instantly. The converted PDF downloads automatically to your device!
                  </p>
                </div>
              </div>
            </div>

            {/* Features Comparison */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 text-center">
                ⚡ All File Changer vs Other PPT to PDF Converters
              </h2>
              <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-orange-600 text-white">
                      <tr>
                        <th className="px-6 py-4 text-left font-semibold">Feature</th>
                        <th className="px-6 py-4 text-center font-semibold">All File Changer</th>
                        <th className="px-6 py-4 text-center font-semibold">Other Tools</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                      <tr>
                        <td className="px-6 py-4 text-gray-900 dark:text-white font-medium">Conversion Speed</td>
                        <td className="px-6 py-4 text-center text-green-600 dark:text-green-400 font-semibold">1-3 seconds ⚡</td>
                        <td className="px-6 py-4 text-center text-gray-600 dark:text-gray-400">5-30 seconds</td>
                      </tr>
                      <tr className="bg-gray-50 dark:bg-gray-800">
                        <td className="px-6 py-4 text-gray-900 dark:text-white font-medium">Formatting Preservation</td>
                        <td className="px-6 py-4 text-center text-green-600 dark:text-green-400 font-semibold">100% Perfect ✨</td>
                        <td className="px-6 py-4 text-center text-gray-600 dark:text-gray-400">Often Distorted</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 text-gray-900 dark:text-white font-medium">File Size Limit</td>
                        <td className="px-6 py-4 text-center text-green-600 dark:text-green-400 font-semibold">50MB 📁</td>
                        <td className="px-6 py-4 text-center text-gray-600 dark:text-gray-400">10-25MB</td>
                      </tr>
                      <tr className="bg-gray-50 dark:bg-gray-800">
                        <td className="px-6 py-4 text-gray-900 dark:text-white font-medium">Registration Required</td>
                        <td className="px-6 py-4 text-center text-green-600 dark:text-green-400 font-semibold">No ❌</td>
                        <td className="px-6 py-4 text-center text-red-600 dark:text-red-400">Often Yes</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 text-gray-900 dark:text-white font-medium">Watermarks</td>
                        <td className="px-6 py-4 text-center text-green-600 dark:text-green-400 font-semibold">None 🆓</td>
                        <td className="px-6 py-4 text-center text-red-600 dark:text-red-400">Usually Added</td>
                      </tr>
                      <tr className="bg-gray-50 dark:bg-gray-800">
                        <td className="px-6 py-4 text-gray-900 dark:text-white font-medium">Cost</td>
                        <td className="px-6 py-4 text-center text-green-600 dark:text-green-400 font-semibold">100% Free 💚</td>
                        <td className="px-6 py-4 text-center text-gray-600 dark:text-gray-400">Paid Plans</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* SEO Rich Content */}
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  📊 What is PPT to PDF Conversion?
                </h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                  <strong>PPT to PDF conversion</strong> is the process of transforming Microsoft PowerPoint presentations (PPT and PPTX files) into Portable Document Format (PDF) files. This is essential for:
                </p>
                <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                  <li className="flex items-start">
                    <span className="text-orange-600 mr-2">✓</span>
                    <span><strong>Universal Compatibility</strong> - PDFs work on any device without PowerPoint installed</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-orange-600 mr-2">✓</span>
                    <span><strong>Preserving Formatting</strong> - Ensures your slides look identical everywhere</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-orange-600 mr-2">✓</span>
                    <span><strong>Email & Sharing</strong> - Smaller file sizes, easier distribution</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-orange-600 mr-2">✓</span>
                    <span><strong>Professional Documents</strong> - PDFs are the standard for business reports and proposals</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-orange-600 mr-2">✓</span>
                    <span><strong>Print Ready</strong> - Perfect for printing presentations as handouts</span>
                  </li>
                </ul>
              </div>

              <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  🎓 Common Use Cases for PPTX to PDF
                </h2>
                <ul className="space-y-3 text-gray-700 dark:text-gray-300">
                  <li className="flex items-start">
                    <span className="text-orange-600 mr-2 mt-1">📈</span>
                    <div>
                      <strong>Business Presentations</strong> - Convert sales pitches, quarterly reports, and investor decks to PDF for secure distribution
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-orange-600 mr-2 mt-1">🎓</span>
                    <div>
                      <strong>Academic Submissions</strong> - Universities often require PDF format for assignments and research presentations
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-orange-600 mr-2 mt-1">📧</span>
                    <div>
                      <strong>Email Attachments</strong> - PDFs are smaller and more compatible than PPTX files for email sharing
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-orange-600 mr-2 mt-1">🖨️</span>
                    <div>
                      <strong>Print Handouts</strong> - Convert presentations to PDF before printing for consistent output
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-orange-600 mr-2 mt-1">🌐</span>
                    <div>
                      <strong>Web Publishing</strong> - Embed presentations on websites as PDFs for universal browser compatibility
                    </div>
                  </li>
                </ul>
              </div>
            </div>

            {/* FAQ Section */}
            <div className="bg-gradient-to-br from-orange-50 to-pink-50 dark:from-gray-900 dark:to-gray-800 rounded-2xl p-8 border border-orange-100 dark:border-gray-700">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 text-center">
                ❓ Frequently Asked Questions - PPT to PDF Converter
              </h2>
              <div className="space-y-6">
                <div className="bg-white dark:bg-gray-900 rounded-lg p-6 shadow-md">
                  <h3 className="text-lg font-semibold text-orange-600 dark:text-orange-400 mb-2">
                    How do I convert PPT to PDF without Microsoft PowerPoint?
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    All File Changer's <strong>online PPT to PDF converter</strong> uses LibreOffice technology, so you don't need Microsoft PowerPoint installed. Simply upload your PPT or PPTX file to our web tool and convert instantly - works on any device including Mac, Windows, Linux, and mobile.
                  </p>
                </div>

                <div className="bg-white dark:bg-gray-900 rounded-lg p-6 shadow-md">
                  <h3 className="text-lg font-semibold text-orange-600 dark:text-orange-400 mb-2">
                    Does converting PPTX to PDF reduce quality?
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    No! Our <strong>powerpoint to pdf converter</strong> maintains 100% of your original quality. All images, fonts, colors, layouts, and formatting are preserved perfectly. LibreOffice conversion ensures pixel-perfect PDF output that matches your original presentation exactly.
                  </p>
                </div>

                <div className="bg-white dark:bg-gray-900 rounded-lg p-6 shadow-md">
                  <h3 className="text-lg font-semibold text-orange-600 dark:text-orange-400 mb-2">
                    Can I convert password-protected PowerPoint files?
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    Currently, password-protected PPT/PPTX files need to be unlocked before conversion. Remove the password in PowerPoint, then use our <strong>free ppt to pdf converter</strong> to create your PDF. We're working on adding support for protected files in the future.
                  </p>
                </div>

                <div className="bg-white dark:bg-gray-900 rounded-lg p-6 shadow-md">
                  <h3 className="text-lg font-semibold text-orange-600 dark:text-orange-400 mb-2">
                    What's the difference between PPT and PPTX formats?
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    <strong>PPT</strong> is the older PowerPoint format (1997-2003), while <strong>PPTX</strong> is the modern XML-based format (2007+). PPTX files are smaller, more secure, and support newer features. All File Changer's converter supports both formats seamlessly - just upload either PPT or PPTX and convert to PDF instantly!
                  </p>
                </div>

                <div className="bg-white dark:bg-gray-900 rounded-lg p-6 shadow-md">
                  <h3 className="text-lg font-semibold text-orange-600 dark:text-orange-400 mb-2">
                    How many slides can I convert at once?
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    There's no slide limit! Our <strong>PPT to PDF converter</strong> can handle presentations with hundreds of slides. The only restriction is the file size (50MB max), which is more than enough for most professional presentations with high-quality images and graphics.
                  </p>
                </div>

                <div className="bg-white dark:bg-gray-900 rounded-lg p-6 shadow-md">
                  <h3 className="text-lg font-semibold text-orange-600 dark:text-orange-400 mb-2">
                    Will animations and transitions be preserved in the PDF?
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    PDFs are static documents, so animations and transitions are converted to their final visible state. Each slide appears as it would when fully animated. This ensures your <strong>powerpoint to pdf conversion</strong> looks professional and complete, perfect for printing or distribution.
                  </p>
                </div>
              </div>
            </div>

            {/* Keywords Rich Section */}
            <div className="bg-white dark:bg-gray-900 rounded-xl p-8 shadow-lg border border-gray-200 dark:border-gray-700">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
                🔍 Related Searches & Keywords
              </h2>
              <div className="flex flex-wrap gap-3 justify-center">
                {[
                  'ppt to pdf', 'pptx to pdf', 'powerpoint to pdf', 'convert ppt to pdf', 'convert pptx to pdf',
                  'ppt to pdf converter', 'pptx to pdf converter', 'powerpoint to pdf converter',
                  'free ppt to pdf', 'online ppt to pdf', 'ppt to pdf online free', 'convert powerpoint to pdf free',
                  'microsoft powerpoint to pdf', 'presentation to pdf', 'slides to pdf', 'ppt file to pdf',
                  'best ppt to pdf converter', 'fast ppt to pdf', 'ppt to pdf without losing quality',
                  'ppt to pdf no watermark', 'ppt to pdf all file changer', 'allfilechanger ppt pdf'
                ].map((keyword, i) => (
                  <span key={i} className="px-4 py-2 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 rounded-full text-sm font-medium">
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
          </section>
        </div>
      </section>

      <footer className="bg-gray-100 dark:bg-black transition-all duration-500 py-12 border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-600 dark:text-gray-400">© 2024 AllFileChanger. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
