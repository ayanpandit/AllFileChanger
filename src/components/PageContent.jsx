import React, { useState } from 'react';
import { Link } from 'react-router-dom';

/* ════════════════════════════════════════════════════════════════════════════
   PageContent – Reusable rich-content sections for every tool page.
   Renders: How-It-Works ➜ Features ➜ SEO Prose ➜ FAQ ➜ Related Tools ➜ Footer
   All sections are fully responsive (mobile + desktop) and dark-mode aware.
   ════════════════════════════════════════════════════════════════════════════ */

export default function PageContent({
  /* ── How It Works ──────────────────────────────────────────────────── */
  howItWorks = [],           // [{ step: '1', title: '', desc: '' }, …]

  /* ── Features ──────────────────────────────────────────────────────── */
  features = [],             // [{ icon: '⚡', title: '', desc: '' }, …]

  /* ── Long-form SEO prose ───────────────────────────────────────────── */
  contentTitle = '',
  contentSections = [],      // [{ heading: '', text: '' }, …]

  /* ── FAQ ────────────────────────────────────────────────────────────── */
  faqs = [],                 // [{ q: '', a: '' }, …]

  /* ── Related Tools ─────────────────────────────────────────────────── */
  relatedTools = [],         // [{ name: '', desc: '', icon: '', path: '' }, …]
}) {
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <>
      {/* ═══════════════════════  HOW IT WORKS  ═══════════════════════ */}
      {howItWorks.length > 0 && (
        <section className="py-12 sm:py-16 lg:py-20 bg-gray-50 dark:bg-gray-950 transition-colors duration-500">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center text-gray-900 dark:text-white mb-3 sm:mb-4">
              How It Works
            </h2>
            <p className="text-center text-gray-600 dark:text-gray-400 mb-10 sm:mb-14 max-w-2xl mx-auto text-sm sm:text-base">
              Get your files converted in just a few simple steps — no sign-up, no software to install.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {howItWorks.map((item, i) => (
                <div key={i} className="relative bg-white dark:bg-gray-900 rounded-2xl p-6 sm:p-8 shadow-md hover:shadow-xl border border-gray-100 dark:border-gray-800 transition-all duration-300 hover:-translate-y-1">
                  <div className="flex items-center gap-4 mb-4">
                    <span className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white font-bold text-lg sm:text-xl shadow-lg">
                      {item.step}
                    </span>
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">{item.title}</h3>
                  </div>
                  <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════════════  FEATURES  ═══════════════════════════ */}
      {features.length > 0 && (
        <section className="py-12 sm:py-16 lg:py-20 bg-white dark:bg-black transition-colors duration-500">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center text-gray-900 dark:text-white mb-3 sm:mb-4">
              Why Choose Our Tool
            </h2>
            <p className="text-center text-gray-600 dark:text-gray-400 mb-10 sm:mb-14 max-w-2xl mx-auto text-sm sm:text-base">
              Trusted by thousands of users worldwide for fast, secure, and reliable file conversions.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {features.map((feat, i) => (
                <div key={i} className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-6 sm:p-8 border border-gray-100 dark:border-gray-800 hover:border-blue-200 dark:hover:border-blue-700 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                  <div className="text-3xl sm:text-4xl mb-4">{feat.icon}</div>
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-2">{feat.title}</h3>
                  <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 leading-relaxed">{feat.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════════════  SEO PROSE  ══════════════════════════ */}
      {contentSections.length > 0 && (
        <section className="py-12 sm:py-16 lg:py-20 bg-gray-50 dark:bg-gray-950 transition-colors duration-500">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            {contentTitle && (
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center text-gray-900 dark:text-white mb-10 sm:mb-14">
                {contentTitle}
              </h2>
            )}
            <div className="space-y-8 sm:space-y-10">
              {contentSections.map((sec, i) => (
                <article key={i}>
                  <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4">{sec.heading}</h3>
                  <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed sm:leading-loose">{sec.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════════════  FAQ  ════════════════════════════════ */}
      {faqs.length > 0 && (
        <section className="py-12 sm:py-16 lg:py-20 bg-white dark:bg-black transition-colors duration-500">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center text-gray-900 dark:text-white mb-3 sm:mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-center text-gray-600 dark:text-gray-400 mb-10 sm:mb-14 max-w-2xl mx-auto text-sm sm:text-base">
              Got questions? We&apos;ve got answers.
            </p>
            <div className="space-y-3 sm:space-y-4">
              {faqs.map((faq, i) => (
                <div
                  key={i}
                  className="border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden transition-all duration-300 hover:border-blue-200 dark:hover:border-blue-700"
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between p-4 sm:p-6 text-left bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200 cursor-pointer"
                  >
                    <span className="text-sm sm:text-base font-medium text-gray-900 dark:text-white pr-4">{faq.q}</span>
                    <svg
                      className={`w-5 h-5 text-gray-500 dark:text-gray-400 flex-shrink-0 transition-transform duration-300 ${openFaq === i ? 'rotate-180' : ''}`}
                      fill="none" stroke="currentColor" viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  <div className={`transition-all duration-300 ${openFaq === i ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'} overflow-hidden`}>
                    <p className="px-4 sm:px-6 pb-4 sm:pb-6 text-sm sm:text-base text-gray-600 dark:text-gray-400 leading-relaxed">
                      {faq.a}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FAQ Schema JSON-LD for SEO */}
      {faqs.length > 0 && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": faqs.map(faq => ({
            "@type": "Question",
            "name": faq.q,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": faq.a
            }
          }))
        })}} />
      )}

      {/* ═══════════════════════  RELATED TOOLS  ═════════════════════ */}
      {relatedTools.length > 0 && (
        <section className="py-12 sm:py-16 lg:py-20 bg-gray-50 dark:bg-gray-950 transition-colors duration-500">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center text-gray-900 dark:text-white mb-3 sm:mb-4">
              Explore More Tools
            </h2>
            <p className="text-center text-gray-600 dark:text-gray-400 mb-10 sm:mb-14 max-w-2xl mx-auto text-sm sm:text-base">
              Discover our full suite of free online file conversion tools.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {relatedTools.map((tool, i) => (
                <Link
                  key={i}
                  to={tool.path}
                  className="group bg-white dark:bg-gray-900 rounded-xl p-5 sm:p-6 border border-gray-100 dark:border-gray-800 hover:border-blue-200 dark:hover:border-blue-700 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="text-2xl sm:text-3xl mb-3">{tool.icon}</div>
                  <h3 className="font-semibold text-sm sm:text-base text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-1">
                    {tool.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">{tool.desc}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════════════  FOOTER  ════════════════════════════ */}
      <footer className="bg-gray-900 dark:bg-black border-t border-gray-800 transition-colors duration-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10">
            {/* Brand */}
            <div className="sm:col-span-2 lg:col-span-1">
              <h3 className="text-lg sm:text-xl font-bold text-white mb-3">AllFileChanger</h3>
              <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
                The ultimate free online platform for converting, compressing, merging, and editing your files. Fast, private, and always free.
              </p>
            </div>

            {/* Image Tools */}
            <div>
              <h4 className="text-sm font-semibold text-gray-200 uppercase tracking-wider mb-3">Image Tools</h4>
              <ul className="space-y-2">
                {[
                  { name: 'Image Compressor', path: '/image-compressor' },
                  { name: 'Image Converter', path: '/image-converter' },
                  { name: 'Image to PDF', path: '/image-to-pdf' },
                  { name: 'Resize Images', path: '/image-resize' },
                  { name: 'Crop Images', path: '/image-crop' },
                  { name: 'Remove Background', path: '/image-background-remove' },
                ].map((l, i) => (
                  <li key={i}><Link to={l.path} className="text-xs sm:text-sm text-gray-400 hover:text-blue-400 transition-colors">{l.name}</Link></li>
                ))}
              </ul>
            </div>

            {/* PDF Tools */}
            <div>
              <h4 className="text-sm font-semibold text-gray-200 uppercase tracking-wider mb-3">PDF Tools</h4>
              <ul className="space-y-2">
                {[
                  { name: 'PDF Merger', path: '/pdf-merge' },
                  { name: 'PDF Splitter', path: '/pdf-split' },
                  { name: 'PDF to Word', path: '/pdf-to-word' },
                  { name: 'Word to PDF', path: '/word-to-pdf' },
                  { name: 'PDF Compressor', path: '/pdf-compressor' },
                  { name: 'Protect PDF', path: '/pdf-protect' },
                ].map((l, i) => (
                  <li key={i}><Link to={l.path} className="text-xs sm:text-sm text-gray-400 hover:text-blue-400 transition-colors">{l.name}</Link></li>
                ))}
              </ul>
            </div>

            {/* Document Tools */}
            <div>
              <h4 className="text-sm font-semibold text-gray-200 uppercase tracking-wider mb-3">Document Tools</h4>
              <ul className="space-y-2">
                {[
                  { name: 'Word Converter', path: '/word-converter' },
                  { name: 'Excel Converter', path: '/excel-converter' },
                  { name: 'OCR Scanner', path: '/ocr-scanner' },
                  { name: 'Text Extractor', path: '/text-extractor' },
                  { name: 'Document Merger', path: '/doc-merge' },
                  { name: 'Format Converter', path: '/format-converter' },
                ].map((l, i) => (
                  <li key={i}><Link to={l.path} className="text-xs sm:text-sm text-gray-400 hover:text-blue-400 transition-colors">{l.name}</Link></li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="mt-10 pt-6 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-gray-500 text-center sm:text-left">
              © {new Date().getFullYear()} AllFileChanger. All rights reserved. Your files are processed securely and never stored on our servers.
            </p>
            <div className="flex gap-6">
              <Link to="/" className="text-xs text-gray-500 hover:text-gray-300 transition-colors">Home</Link>
              <Link to="/about" className="text-xs text-gray-500 hover:text-gray-300 transition-colors">About</Link>
              <Link to="/privacy" className="text-xs text-gray-500 hover:text-gray-300 transition-colors">Privacy</Link>
              <Link to="/terms" className="text-xs text-gray-500 hover:text-gray-300 transition-colors">Terms</Link>
              <Link to="/contact" className="text-xs text-gray-500 hover:text-gray-300 transition-colors">Contact</Link>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
