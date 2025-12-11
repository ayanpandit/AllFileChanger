import React, { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

const API_URL = import.meta.env.VITE_DOCUMENTMERGER_URL || 'http://localhost:5024';

export default function DocumentMerger() {
  const [files, setFiles] = useState([]);
  const [type, setType] = useState('pdf');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const droppedFiles = Array.from(e.dataTransfer.files).filter(file => {
      const ext = file.name.split('.').pop().toLowerCase();
      return type === 'pdf' ? ext === 'pdf' : ext === 'docx';
    });
    if (droppedFiles.length > 0) { setFiles(prev => [...prev, ...droppedFiles]); setErrorMessage(''); }
  }, [type]);

  const handleDragEnter = useCallback((e) => { e.preventDefault(); e.stopPropagation(); setDragActive(true); }, []);
  const handleDragLeave = useCallback((e) => { e.preventDefault(); e.stopPropagation(); setDragActive(false); }, []);
  const handleDragOver = useCallback((e) => { e.preventDefault(); e.stopPropagation(); }, []);

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files.length > 0) { 
      setFiles(prev => [...prev, ...Array.from(e.target.files)]); 
      setErrorMessage(''); 
    }
  };

  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleMerge = async () => {
    if (files.length < 2) { setErrorMessage('Please select at least 2 files to merge'); return; }
    setIsProcessing(true);
    setErrorMessage('');
    setShowSuccess(false);

    try {
      const formData = new FormData();
      files.forEach(file => formData.append('files', file));
      formData.append('type', type);
      const response = await fetch(`${API_URL}/merge`, { method: 'POST', body: formData });
      if (!response.ok) throw new Error('Merge failed');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `merged_documents.${type}`;
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
      setTimeout(() => { setShowSuccess(false); setFiles([]); }, 3000);
    } catch (error) {
      console.error('Merge error:', error);
      setErrorMessage(error.message || 'Merge failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black transition-all duration-500">
      <Helmet>
        <title>Document Merger - Merge Multiple Documents | AllFileChanger</title>
        <meta name="description" content="Merge multiple PDF or Word documents into one file online for free. Fast, secure document merger." />
      </Helmet>

      <section className="relative overflow-hidden bg-gradient-to-br from-teal-600 via-cyan-600 to-blue-600 dark:from-black dark:via-black dark:to-black">
        <div className="absolute inset-0 bg-black/20 dark:bg-black/80 transition-all duration-500"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-teal-500 to-cyan-600 rounded-3xl mb-6 shadow-2xl hover:scale-110 transition-all duration-300">
              <span className="text-3xl text-white">📑</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6">
              <span className="text-yellow-300 dark:text-yellow-400">Document Merger</span>
            </h1>
            <p className="text-lg sm:text-xl text-teal-100 dark:text-gray-300 mb-6 max-w-3xl mx-auto">Merge multiple PDF or Word documents into one file. Fast, secure, and free.</p>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white dark:bg-black rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden transition-all duration-500">
            <div className="p-4 sm:p-6 lg:p-8">
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Document Type:</label>
                <select value={type} onChange={(e) => { setType(e.target.value); setFiles([]); }} className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-black text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200">
                  <option value="pdf">PDF</option>
                  <option value="docx">Word (DOCX)</option>
                </select>
              </div>

              <div className={`relative border-2 border-dashed rounded-xl p-6 sm:p-8 lg:p-12 text-center transition-all duration-300 ${dragActive ? 'border-teal-500 bg-teal-50 dark:bg-teal-950/50 scale-105' : 'border-gray-300 dark:border-gray-800 hover:border-teal-400 dark:hover:border-teal-600'}`} onDrop={handleDrop} onDragEnter={handleDragEnter} onDragLeave={handleDragLeave} onDragOver={handleDragOver}>
                <input type="file" onChange={handleFileInput} accept={type === 'pdf' ? '.pdf' : '.docx'} multiple className="hidden" id="file-upload" />
                <div className="space-y-4 sm:space-y-6">
                  <div className="mx-auto w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-teal-500 to-cyan-600 rounded-2xl flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-300">
                    <span className="text-3xl sm:text-4xl">📄</span>
                  </div>
                  <div>
                    <label htmlFor="file-upload" className="cursor-pointer text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white hover:text-teal-600 dark:hover:text-teal-400 transition-colors duration-200">
                      {files.length > 0 ? `${files.length} file(s) selected` : 'Choose documents or drag them here'}
                    </label>
                    <p className="mt-2 text-sm sm:text-base text-gray-500 dark:text-gray-400">Select at least 2 {type.toUpperCase()} files to merge (max 10MB each)</p>
                  </div>
                </div>
              </div>

              {files.length > 0 && (
                <div className="mt-6 space-y-4">
                  <div className="max-h-60 overflow-y-auto space-y-2 p-4 bg-gray-50 dark:bg-black rounded-xl border border-gray-200 dark:border-gray-800">
                    {files.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-white dark:bg-black rounded-lg border border-gray-200 dark:border-gray-800">
                        <div className="flex items-center space-x-3 flex-1 min-w-0">
                          <span className="text-2xl">📄</span>
                          <span className="text-sm text-gray-900 dark:text-white truncate">{file.name}</span>
                        </div>
                        <button onClick={() => removeFile(index)} className="ml-2 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 flex-shrink-0">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>

                  {showSuccess && (
                    <div className="p-4 bg-green-50 dark:bg-green-900/50 border border-green-200 dark:border-green-800 rounded-xl transition-all duration-300">
                      <div className="flex items-center space-x-2">
                        <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="text-green-800 dark:text-green-200 font-medium">✅ Documents merged successfully!</span>
                      </div>
                    </div>
                  )}

                  {errorMessage && (
                    <div className="p-4 bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-800 rounded-xl">
                      <span className="text-red-800 dark:text-red-200 font-medium">❌ {errorMessage}</span>
                    </div>
                  )}

                  {files.length >= 2 && (
                    <button onClick={handleMerge} disabled={isProcessing} className="w-full bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white font-semibold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none transition-all duration-300">
                      {isProcessing ? (
                        <span className="flex items-center justify-center">
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Merging...
                        </span>
                      ) : `🔗 Merge ${files.length} Documents`}
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          <section className="mt-12 sm:mt-16">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-6 sm:mb-8 text-center">🌟 Key Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { icon: '⚡', title: 'Lightning Fast', desc: 'Merge documents in seconds' },
                { icon: '🔒', title: '100% Secure', desc: 'Files deleted after merging' },
                { icon: '🆓', title: 'Completely Free', desc: 'No limits, no registration' },
              ].map((feature, i) => (
                <div key={i} className="group bg-white dark:bg-black rounded-xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-200 dark:border-gray-800 hover:border-teal-200 dark:hover:border-teal-600 hover:-translate-y-1">
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
                { name: 'PDF Merger', path: '/pdf-merger', icon: '📄' },
                { name: 'Word Converter', path: '/word-converter', icon: '📝' },
                { name: 'Format Converter', path: '/format-converter', icon: '🔄' },
                { name: 'PDF Splitter', path: '/pdf-splitter', icon: '✂️' },
              ].map((tool, i) => (
                <Link key={i} to={tool.path} className="group bg-white dark:bg-black rounded-xl p-4 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-800 hover:border-teal-200 dark:hover:border-teal-600 hover:-translate-y-1">
                  <div className="text-2xl mb-2">{tool.icon}</div>
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white">{tool.name}</h3>
                </Link>
              ))}
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
