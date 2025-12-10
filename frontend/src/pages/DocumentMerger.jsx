import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

const API_URL = import.meta.env.VITE_DOCUMENTMERGER_URL || 'http://localhost:5024';

export default function DocumentMerger() {
  const [files, setFiles] = useState([]);
  const [type, setType] = useState('pdf');
  const [status, setStatus] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleMerge = async () => {
    if (files.length < 2) return setStatus('Select at least 2 files');
    setIsProcessing(true);
    setStatus('Merging...');

    try {
      const formData = new FormData();
      files.forEach(file => formData.append('files', file));
      formData.append('type', type);
      const response = await fetch(`${API_URL}/merge`, { method: 'POST', body: formData });
      if (!response.ok) throw new Error('Failed');
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `merged.${type}`;
      a.click();
      setStatus('✅ Documents Merged!');
    } catch (error) {
      setStatus('❌ ' + error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      <Helmet><title>Document Merger</title></Helmet>
      <div className="min-h-screen bg-gradient-to-br from-teal-50 to-cyan-100 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-8">📑 Document Merger</h1>
          <div className="bg-white rounded-lg shadow-xl p-8">
            <select value={type} onChange={(e) => setType(e.target.value)} className="w-full mb-4 p-3 border rounded">
              <option value="pdf">PDF</option>
              <option value="docx">Word</option>
            </select>
            <input type="file" onChange={(e) => setFiles(Array.from(e.target.files))} accept={type === 'pdf' ? '.pdf' : '.docx'} multiple className="w-full mb-4 p-3 border rounded" />
            <p className="text-sm text-gray-600 mb-4">{files.length} file(s) selected</p>
            {files.length >= 2 && <button onClick={handleMerge} disabled={isProcessing} className="w-full bg-teal-600 text-white py-3 rounded-lg hover:bg-teal-700 disabled:bg-gray-400">{isProcessing ? 'Merging...' : `Merge ${files.length} Documents`}</button>}
            {status && <div className={`mt-4 p-4 rounded ${status.includes('✅') ? 'bg-green-100' : 'bg-red-100'}`}>{status}</div>}
          </div>
          <div className="mt-6 text-center"><Link to="/" className="text-teal-600">← Back</Link></div>
        </div>
      </div>
    </>
  );
}
