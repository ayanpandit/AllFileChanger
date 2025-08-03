import React, { useState } from 'react';
import axios from 'axios';

const Home = () => {
  const [files, setFiles] = useState([]);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    setFiles(e.target.files);
    setPdfUrl(null); // reset previous download
    setError(null);
  };

  const handleConvert = async () => {
    if (files.length === 0) {
      setError('Please upload at least one image');
      return;
    }

    const formData = new FormData();
    for (const file of files) {
      formData.append('images', file);
    }

    try {
      setLoading(true);
      setError(null);

      const response = await axios.post('https://allfilechanger.onrender.com', formData, {
        responseType: 'blob',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const blob = new Blob([response.data], { type: 'application/pdf' });
      const downloadUrl = URL.createObjectURL(blob);
      setPdfUrl(downloadUrl);
    } catch (err) {
      console.error(err);
      setError('❌ Failed to convert images to PDF.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-100">
      <h1 className="text-3xl font-bold mb-4 text-blue-700">Image to PDF Converter</h1>

      <input
        type="file"
        multiple
        accept="image/png, image/jpeg"
        onChange={handleFileChange}
        className="mb-4"
      />

      <button
        onClick={handleConvert}
        disabled={loading}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Converting...' : 'Convert to PDF'}
      </button>

      {pdfUrl && (
        <div className="mt-4">
          <a
            href={pdfUrl}
            download="converted.pdf"
            className="text-green-600 underline font-semibold"
          >
            ✅ Download PDF
          </a>
        </div>
      )}

      {error && (
        <p className="mt-4 text-red-500 font-semibold">{error}</p>
      )}
    </div>
  );
};

export default Home;
