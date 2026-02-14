import React, { useState, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import PageContent from '../components/PageContent';
import { pdfToPowerPointData } from '../data/pageContentData';

export default function PdfToPowerPoint() {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleDrop = useCallback((e) => { e.preventDefault(); e.stopPropagation(); setDragActive(false); if (e.dataTransfer.files?.[0]?.type === 'application/pdf') setFile(e.dataTransfer.files[0]); }, []);
  const handleDragEnter = useCallback((e) => { e.preventDefault(); e.stopPropagation(); setDragActive(true); }, []);
  const handleDragLeave = useCallback((e) => { e.preventDefault(); e.stopPropagation(); setDragActive(false); }, []);
  const handleDragOver = useCallback((e) => { e.preventDefault(); e.stopPropagation(); }, []);

  const handleConvert = async () => {
    if (!file) return;
    setIsProcessing(true);
    const formData = new FormData();
    formData.append('pdf', file);
    try {
      const res = await fetch(`${import.meta.env.VITE_PYTHON_API_URL}/api/pdf/to-powerpoint`, { method: 'POST', body: formData });
      if (res.ok) {
        const blob = await res.blob();
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'converted.pptx';
        a.style.display = 'none';
        document.body.appendChild(a);
        if (isMobile) {
          setTimeout(() => { a.click(); document.body.removeChild(a); setTimeout(() => { window.open(url, '_blank'); setTimeout(() => window.URL.revokeObjectURL(url), 2000); }, 1000); }, 100);
        } else {
          a.click();
          document.body.removeChild(a);
          setTimeout(() => window.URL.revokeObjectURL(url), 1000);
        }
        setShowSuccess(true);
        setTimeout(() => navigate('/', { replace: true }), 2000);
      }
    } catch (error) { alert('Conversion failed'); } finally { setIsProcessing(false); }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black"><Helmet><title>PDF to PowerPoint - AllFileChanger</title></Helmet>
      <section className="relative overflow-hidden bg-gradient-to-br from-orange-600 via-red-600 to-pink-800 dark:from-black dark:via-black dark:to-black"><div className="absolute inset-0 bg-black/20 dark:bg-black/80"></div><div className="relative max-w-7xl mx-auto px-4 py-20"><div className="text-center"><div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-orange-500 to-red-600 rounded-3xl mb-6 shadow-2xl"><span className="text-3xl">📽️</span></div><h1 className="text-5xl font-bold text-white mb-4"><span className="text-yellow-300">PDF to PowerPoint</span></h1></div></div></section>
      <section className="py-16 px-4"><div className="max-w-4xl mx-auto"><div className="bg-white dark:bg-black rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800"><div className="p-8"><div className={`relative border-2 border-dashed rounded-xl p-12 text-center transition-all ${dragActive ? 'border-orange-500 bg-orange-50 dark:bg-orange-950/50' : 'border-gray-300 dark:border-gray-800'}`} onDrop={handleDrop} onDragEnter={handleDragEnter} onDragLeave={handleDragLeave} onDragOver={handleDragOver}><div className="space-y-6"><div className="mx-auto w-20 h-20 bg-gradient-to-r from-orange-500 to-red-600 rounded-2xl flex items-center justify-center"><svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg></div><p className="text-2xl font-semibold text-gray-900 dark:text-white">Drop PDF file</p><input type="file" accept="application/pdf" onChange={(e) => e.target.files[0] && setFile(e.target.files[0])} className="absolute inset-0 opacity-0 cursor-pointer" /></div></div></div>
            {file && <div className="border-t p-8">{showSuccess && <div className="mb-4 p-4 bg-green-50 dark:bg-green-900/50 rounded-xl"><span className="text-green-800 dark:text-green-200 font-medium">✅ Converted!</span></div>}<button onClick={handleConvert} disabled={isProcessing} className="w-full bg-gradient-to-r from-orange-600 to-red-600 text-white font-semibold py-4 px-8 rounded-xl disabled:opacity-50">{isProcessing ? 'Converting...' : '📽️ Convert to PowerPoint'}</button></div>}
          </div></div></section>
      <PageContent {...pdfToPowerPointData} />
    </div>
  );
}
