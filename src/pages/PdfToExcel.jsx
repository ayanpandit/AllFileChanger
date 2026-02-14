import React, { useState, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';

function PdfToExcel() {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleDrop = useCallback((e) => { e.preventDefault(); e.stopPropagation(); setDragActive(false); if (e.dataTransfer.files && e.dataTransfer.files[0]) { const file = e.dataTransfer.files[0]; if (file.type === 'application/pdf') setSelectedFile(file); } }, []);
  const handleDragEnter = useCallback((e) => { e.preventDefault(); e.stopPropagation(); setDragActive(true); }, []);
  const handleDragLeave = useCallback((e) => { e.preventDefault(); e.stopPropagation(); setDragActive(false); }, []);
  const handleDragOver = useCallback((e) => { e.preventDefault(); e.stopPropagation(); }, []);
  const handleFileInput = (e) => { const file = e.target.files[0]; if (file && file.type === 'application/pdf') setSelectedFile(file); };

  const handleConvert = async () => {
    if (!selectedFile) return;
    setIsProcessing(true);
    const formData = new FormData();
    formData.append('pdf', selectedFile);
    try {
      const response = await fetch(`${import.meta.env.VITE_PYTHON_API_URL}/api/pdf/to-excel`, { method: 'POST', body: formData });
      if (response.ok) {
        const blob = await response.blob();
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        if (isMobile) { const url = window.URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = 'converted.xlsx'; a.style.display = 'none'; document.body.appendChild(a); setTimeout(() => { a.click(); document.body.removeChild(a); setTimeout(() => { window.open(url, '_blank'); setTimeout(() => window.URL.revokeObjectURL(url), 2000); }, 1000); }, 100); } else { const url = window.URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = 'converted.xlsx'; a.click(); setTimeout(() => window.URL.revokeObjectURL(url), 1000); }
        setShowSuccess(true);
        setTimeout(() => navigate('/', { replace: true }), 2000);
      }
    } catch (error) { alert('Failed to convert. Please try again.'); } finally { setIsProcessing(false); }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black transition-all duration-500">
      <Helmet><title>PDF to Excel Converter - AllFileChanger</title></Helmet>
      <section className="relative overflow-hidden bg-gradient-to-br from-green-600 via-emerald-600 to-teal-800 dark:from-black dark:via-black dark:to-black"><div className="absolute inset-0 bg-black/20 dark:bg-black/80"></div><div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24"><div className="text-center"><div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-600 rounded-3xl mb-6 shadow-2xl hover:scale-110 transition-all duration-300"><span className="text-3xl text-white">📊</span></div><h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6"><span className="text-yellow-300 dark:text-yellow-400">PDF to Excel</span></h1><p className="text-lg sm:text-xl lg:text-2xl text-green-100 dark:text-gray-200 max-w-4xl mx-auto">Convert PDF to Excel spreadsheets!</p></div></div></section>
      <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8"><div className="max-w-4xl mx-auto"><div className="bg-white dark:bg-black rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden"><div className="p-4 sm:p-6 lg:p-8"><div className={`relative border-2 border-dashed rounded-xl p-6 sm:p-8 lg:p-12 text-center transition-all duration-300 ${dragActive ? 'border-green-500 bg-green-50 dark:bg-green-950/50 scale-105' : 'border-gray-300 dark:border-gray-800 hover:border-green-400'}`} onDrop={handleDrop} onDragEnter={handleDragEnter} onDragLeave={handleDragLeave} onDragOver={handleDragOver}><div className="space-y-4 sm:space-y-6"><div className="mx-auto w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg"><svg className="w-8 h-8 sm:w-10 sm:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg></div><p className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-900 dark:text-white">Drop your PDF file here</p><input type="file" accept="application/pdf" onChange={handleFileInput} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" /></div></div></div>
            {selectedFile && (<div className="border-t border-gray-200 dark:border-gray-800 p-6 sm:p-8">{showSuccess && (<div className="mb-4 p-4 bg-green-50 dark:bg-green-900/50 border border-green-200 dark:border-green-800 rounded-xl"><div className="flex items-center space-x-2"><svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg><span className="text-green-800 dark:text-green-200 font-medium">Converted!</span></div></div>)}<button onClick={handleConvert} disabled={isProcessing} className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 flex items-center justify-center space-x-2">{isProcessing ? (<><svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg><span>Converting...</span></>) : (<><span>📊</span><span>Convert to Excel</span></>)}</button></div>)}
          </div></div></section>
    </div>
  );
}

export default PdfToExcel;
