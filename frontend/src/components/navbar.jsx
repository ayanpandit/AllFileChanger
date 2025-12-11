import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Navbar({ darkMode, toggleDarkMode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Image Tools', path: '/image-tools', dropdown: [
      { name: '📄 Image to PDF', path: '/image-to-pdf' },
      { name: '🗜️ Image Compressor', path: '/image-compressor' },
      { name: '🔄 Image Converter', path: '/image-converter' },
      { name: '📏 Resize Images', path: '/image-resize' },
      { name: '🌀 Rotate & Flip', path: '/image-rotate-flip' },
      { name: '✂️ Crop Images', path: '/image-crop' },
      { name: '💧 Add Watermark', path: '/image-watermark' },
      { name: '🖼️ Remove Background', path: '/image-background-remove' },
      { name: '🎨 Image Editor', path: '/image-editor' },
    ]},
    { name: 'PDF Tools', path: '/pdf-tools', dropdown: [
      { name: '📑 PDF Merger', path: '/pdf-merge' },
      { name: '✂️ PDF Splitter', path: '/pdf-split' },
      { name: '🗜️ PDF Compressor', path: '/pdf-compressor' },
      { name: '📝 PDF to Word', path: '/pdf-to-word' },
      { name: '📄 Word to PDF', path: '/word-to-pdf' },
      { name: '📊 PDF to Excel', path: '/pdf-to-excel' },
      { name: '📊 PDF to PowerPoint', path: '/pdf-to-powerpoint' },
      { name: '🔒 Protect PDF', path: '/pdf-protect' },
      { name: '🔓 Unlock PDF', path: '/pdf-unlock' },
    ]},
    { name: 'Document Tools', path: '/document-tools', dropdown: [
      { name: '📝 Word Converter', path: '/word-converter' },
      { name: '📊 Excel Converter', path: '/excel-converter' },
      { name: '📊 PowerPoint Converter', path: '/powerpoint-converter' },
      { name: '📄 Text Extractor', path: '/text-extractor' },
      { name: '🔍 OCR Scanner', path: '/ocr-scanner' },
      { name: '📑 Document Merger', path: '/document-merger' },
      { name: '🔄 Format Converter', path: '/format-converter' },
    ]},
  ];

  const isActivePath = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <>      
      <nav className={`fixed top-4 left-4 right-4 z-50 transition-all duration-500 ${
        isScrolled 
          ? 'bg-white/95 dark:bg-black/95 backdrop-blur-lg shadow-2xl' 
          : 'bg-white/90 dark:bg-black/90 backdrop-blur-md shadow-lg'
      } rounded-2xl border border-gray-200/50 dark:border-gray-800/50`}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center transform group-hover:scale-110 transition-transform duration-200">
                  <span className="text-white font-bold text-xl">A</span>
                </div>
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl opacity-30 group-hover:opacity-50 transition-opacity duration-200 -z-10"></div>
              </div>
              <div className="hidden sm:block">
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                  AllFileChanger
                </span>
                <div className="text-sm text-gray-500 dark:text-gray-400 -mt-1">File Converter</div>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-1">
              {navItems.map((item) => (
                <div key={item.name} className="relative group">
                  <Link
                    to={item.path}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 flex items-center space-x-1 ${
                      isActivePath(item.path)
                        ? 'bg-blue-600 text-white shadow-lg'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
                    }`}
                  >
                    <span>{item.name}</span>
                    {item.dropdown && (
                      <svg className="w-4 h-4 transition-transform duration-200 group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m19 9-7 7-7-7" />
                      </svg>
                    )}
                  </Link>
                  
                  {/* Dropdown Menu */}
                  {item.dropdown && (
                    <div className="absolute top-full left-0 mt-2 w-56 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0">
                      <div className="bg-white dark:bg-black rounded-xl shadow-2xl border border-gray-200 dark:border-gray-800 py-2 backdrop-blur-lg">
                        {item.dropdown.map((dropdownItem) => (
                          <Link
                            key={dropdownItem.name}
                            to={dropdownItem.path}
                            className={`block px-4 py-3 text-sm transition-colors duration-200 ${
                              location.pathname === dropdownItem.path
                                ? 'bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400'
                                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900'
                            }`}
                          >
                            {dropdownItem.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Right side controls */}
            <div className="flex items-center space-x-3">
              {/* Dark Mode Toggle */}
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 group"
                aria-label="Toggle dark mode"
              >
                <div className="relative w-5 h-5">
                  <svg
                    className={`absolute inset-0 w-5 h-5 transition-all duration-300 ${
                      darkMode ? 'opacity-0 rotate-90' : 'opacity-100 rotate-0'
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  <svg
                    className={`absolute inset-0 w-5 h-5 transition-all duration-300 ${
                      darkMode ? 'opacity-100 rotate-0' : 'opacity-0 -rotate-90'
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                </div>
              </button>

              {/* CTA Button */}
              <Link
                to="/image-to-pdf"
                className="hidden sm:inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-medium rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <span className="mr-2">🚀</span>
                Convert Now
              </Link>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="lg:hidden p-2 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
                aria-label="Toggle mobile menu"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {isOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`lg:hidden transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-[80vh] opacity-100' : 'max-h-0 opacity-0'
        } overflow-hidden`}>
          <div className="bg-gray-50/95 dark:bg-gray-900/95 backdrop-blur-lg rounded-b-2xl border-t border-gray-200/50 dark:border-gray-800/50">
            <div className="max-h-[70vh] overflow-y-auto px-6 py-4 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
              {navItems.map((item) => (
                <div key={item.name} className="space-y-2 mb-4">
                  <Link
                    to={item.path}
                    className={`block px-4 py-3 rounded-xl text-sm font-medium transition-colors duration-200 ${
                      isActivePath(item.path)
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    {item.name}
                  </Link>
                  {item.dropdown && (
                    <div className="ml-4 space-y-1">
                      {item.dropdown.map((dropdownItem) => (
                        <Link
                          key={dropdownItem.name}
                          to={dropdownItem.path}
                          className={`block px-4 py-2 rounded-lg text-xs transition-colors duration-200 ${
                            location.pathname === dropdownItem.path
                              ? 'bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400'
                              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                          }`}
                          onClick={() => setIsOpen(false)}
                        >
                          {dropdownItem.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            {/* Mobile CTA */}
            <div className="px-6 pb-4 border-t border-gray-200 dark:border-gray-800 bg-gray-50/95 dark:bg-gray-900/95">
              <div className="pt-4">
                <Link
                  to="/image-to-pdf"
                  className="w-full inline-flex items-center justify-center px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-medium rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
                  onClick={() => setIsOpen(false)}
                >
                  <span className="mr-2">🚀</span>
                  Convert Now
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
