import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

const API_URL = import.meta.env.VITE_OCRSCANNER_URL || 'http://localhost:5023';

export default function OcrScanner() {
  const [file, setFile] = useState(null);
  const [language, setLanguage] = useState('eng');
  const [status, setStatus] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleScan = async () => {
    if (!file) return setStatus('Select an image');
    setIsProcessing(true);
    setStatus('Scanning...');

    try {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('language', language);
      const response = await fetch(`${API_URL}/scan`, { method: 'POST', body: formData });
      if (!response.ok) throw new Error('Failed');
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'ocr_result.txt';
      a.click();
      setStatus('✅ OCR Complete!');
    } catch (error) {
      setStatus('❌ ' + error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      <Helmet><title>OCR Scanner</title></Helmet>
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-8">🔍 OCR Scanner</h1>
          <div className="bg-white rounded-lg shadow-xl p-8">
            <input type="file" onChange={(e) => setFile(e.target.files[0])} accept="image/*" className="w-full mb-4 p-3 border rounded" />
            <select value={language} onChange={(e) => setLanguage(e.target.value)} className="w-full mb-4 p-3 border rounded">
              <option value="eng">English</option>
              <option value="spa">Spanish</option>
              <option value="fra">French</option>
              <option value="deu">German</option>
            </select>
            {file && <button onClick={handleScan} disabled={isProcessing} className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 disabled:bg-gray-400">{isProcessing ? 'Scanning...' : 'Scan Image'}</button>}
            {status && <div className={`mt-4 p-4 rounded ${status.includes('✅') ? 'bg-green-100' : 'bg-red-100'}`}>{status}</div>}
          </div>
          <div className="mt-6 text-center"><Link to="/" className="text-indigo-600">← Back</Link></div>
        </div>
      </div>
    </>
  );
}
