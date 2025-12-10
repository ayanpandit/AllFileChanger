import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

const API_URL = import.meta.env.VITE_EXCELCONVERTER_URL || 'http://localhost:5020';

export default function ExcelConverter() {
  const [file, setFile] = useState(null);
  const [format, setFormat] = useState('csv');
  const [status, setStatus] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleConvert = async () => {
    if (!file) return setStatus('Select an Excel file');
    setIsProcessing(true);
    setStatus('Converting...');

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('format', format);
      const response = await fetch(`${API_URL}/convert`, { method: 'POST', body: formData });
      if (!response.ok) throw new Error('Failed');
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `converted.${format}`;
      a.click();
      setStatus('✅ Converted!');
    } catch (error) {
      setStatus('❌ ' + error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      <Helmet><title>Excel Converter</title></Helmet>
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-8">📊 Excel Converter</h1>
          <div className="bg-white rounded-lg shadow-xl p-8">
            <input type="file" onChange={(e) => setFile(e.target.files[0])} accept=".xls,.xlsx" className="w-full mb-4 p-3 border rounded" />
            <select value={format} onChange={(e) => setFormat(e.target.value)} className="w-full mb-4 p-3 border rounded">
              <option value="csv">CSV</option>
              <option value="json">JSON</option>
              <option value="html">HTML</option>
            </select>
            {file && <button onClick={handleConvert} disabled={isProcessing} className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 disabled:bg-gray-400">{isProcessing ? 'Converting...' : `Convert to ${format.toUpperCase()}`}</button>}
            {status && <div className={`mt-4 p-4 rounded ${status.includes('✅') ? 'bg-green-100' : 'bg-red-100'}`}>{status}</div>}
          </div>
          <div className="mt-6 text-center"><Link to="/" className="text-green-600">← Back</Link></div>
        </div>
      </div>
    </>
  );
}
