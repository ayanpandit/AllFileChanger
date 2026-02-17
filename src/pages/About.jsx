import React from 'react';
import SEO from '../components/SEO';
import { Link } from 'react-router-dom';

export default function About() {
  const aboutSchema = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "name": "About AllFileChanger",
    "url": "https://www.allfilechanger.shop/about",
    "mainEntity": {
      "@type": "Organization",
      "name": "AllFileChanger",
      "url": "https://www.allfilechanger.shop",
      "description": "AllFileChanger provides free, secure, and fast online file conversion tools for images, PDFs, and documents.",
      "foundingDate": "2024",
      "sameAs": [],
      "knowsAbout": [
        "File Conversion",
        "Image Processing",
        "PDF Tools",
        "Document Conversion",
        "OCR Technology",
        "Image Compression"
      ]
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black transition-colors duration-500">
      <SEO
        title="About AllFileChanger - Free Online File Conversion Platform"
        description="Learn about AllFileChanger, the free online file conversion platform with 25+ tools. Convert images, PDFs, and documents securely and instantly."
        keywords="about allfilechanger, file converter, online tools, who we are, free conversion tools"
        schema={aboutSchema}
        breadcrumbs={[
          { name: 'Home', url: '/' },
          { name: 'About', url: '/about' }
        ]}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            About AllFileChanger
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            We built AllFileChanger because file conversion should be simple, free, and secure. No downloads,
            no sign-ups — just fast results.
          </p>
        </div>

        {/* Mission */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Our Mission</h2>
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 rounded-2xl p-8 border border-gray-200 dark:border-gray-700">
            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
              We believe everyone should have access to professional-quality file conversion tools without
              paying for expensive software or uploading personal files to shady services. AllFileChanger was
              created to provide a <strong>free, fast, and privacy-focused</strong> alternative that anyone can
              use from any device.
            </p>
          </div>
        </section>

        {/* What We Offer */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">What We Offer</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800">
              <span className="text-3xl mb-3 block">🖼️</span>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Image Tools</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Convert between JPG, PNG, WebP, and more. Compress, resize, crop, rotate, add watermarks,
                remove backgrounds, and edit images — all in your browser.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800">
              <span className="text-3xl mb-3 block">📄</span>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">PDF Tools</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Merge, split, compress PDFs. Convert between PDF and Word, Excel, or PowerPoint.
                Protect PDFs with passwords or unlock existing ones.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800">
              <span className="text-3xl mb-3 block">📝</span>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Document Tools</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Convert Word, Excel, and PowerPoint files. Extract text from documents, use OCR to scan
                images for text, and merge multiple documents.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800">
              <span className="text-3xl mb-3 block">🔒</span>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Privacy First</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Files are processed in memory and automatically deleted. We never store, view, or share your
                data. All transfers are encrypted with SSL.
              </p>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="mb-16">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
            <h2 className="text-2xl font-bold text-center mb-8">AllFileChanger by the Numbers</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold">25+</div>
                <div className="text-blue-200 text-sm">Conversion Tools</div>
              </div>
              <div>
                <div className="text-3xl font-bold">10+</div>
                <div className="text-blue-200 text-sm">File Formats</div>
              </div>
              <div>
                <div className="text-3xl font-bold">100%</div>
                <div className="text-blue-200 text-sm">Free to Use</div>
              </div>
              <div>
                <div className="text-3xl font-bold">0</div>
                <div className="text-blue-200 text-sm">Registration Required</div>
              </div>
            </div>
          </div>
        </section>

        {/* Technology */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Our Technology</h2>
          <div className="prose prose-lg max-w-none text-gray-700 dark:text-gray-300">
            <p>
              AllFileChanger is built with modern web technologies to ensure speed, reliability, and security:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4 mt-4">
              <li><strong>React</strong> — for a fast, responsive user interface</li>
              <li><strong>Node.js & Python</strong> — dual-backend architecture for optimal processing</li>
              <li><strong>Sharp & Pillow</strong> — industry-standard image processing libraries</li>
              <li><strong>SSL/TLS Encryption</strong> — all data transfers are fully encrypted</li>
              <li><strong>Vercel & Cloud Infrastructure</strong> — for global availability and low latency</li>
            </ul>
          </div>
        </section>

        {/* CTA */}
        <section className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Ready to Get Started?</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            No sign-up required. Just pick a tool and start converting.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/"
              className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-300"
            >
              Browse All Tools
            </Link>
            <Link
              to="/contact"
              className="px-8 py-3 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white font-semibold rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-300"
            >
              Contact Us
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
