import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

const API_URL = import.meta.env.VITE_TEXTEXTRACTOR_URL || 'http://localhost:5022';

export default function TextExtractor() {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleExtract = async () => {
    if (!file) return setStatus('Select a file');
    setIsProcessing(true);
    setStatus('Extracting...');

    try {
      const formData = new FormData();
      formData.append('file', file);
      const response = await fetch(`${API_URL}/extract`, { method: 'POST', body: formData });
      if (!response.ok) throw new Error('Failed');
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'extracted_text.txt';
      a.click();
      setStatus('✅ Text Extracted!');
    } catch (error) {
      setStatus('❌ ' + error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      <Helmet><title>Text Extractor</title></Helmet>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-8">📄 Text Extractor</h1>
          <div className="bg-white rounded-lg shadow-xl p-8">
            <input type="file" onChange={(e) => setFile(e.target.files[0])} accept=".pdf,.doc,.docx,.ppt,.pptx,.txt" className="w-full mb-4 p-3 border rounded" />
            {file && <button onClick={handleExtract} disabled={isProcessing} className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 disabled:bg-gray-400">{isProcessing ? 'Extracting...' : 'Extract Text'}</button>}
            {status && <div className={`mt-4 p-4 rounded ${status.includes('✅') ? 'bg-green-100' : 'bg-red-100'}`}>{status}</div>}
          </div>
          <div className="mt-6 text-center"><Link to="/" className="text-purple-600">← Back</Link></div>
        </div>
      </div>
    </>
  );
}
