import React, { useState } from 'react';
import axios from 'axios';

const Home = () => {
  const [files, setFiles] = useState([]);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setFiles([...e.target.files]);
    setPdfUrl(null); // Clear previous result
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      alert("Please select at least one image file.");
      return;
    }

    const formData = new FormData();
    files.forEach((file) => {
      formData.append('images', file);
    });

    try {
      setLoading(true);
      const response = await axios.post('https://allfilechanger.onrender.com', formData, {

        responseType: 'blob', // Because we expect a binary PDF
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      setPdfUrl(url);
    } catch (error) {
      console.error('Error uploading images:', error);
      alert("Failed to convert images to PDF.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-8 bg-gray-100 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-6 text-blue-600">Image to PDF Converter</h1>

      <input
        type="file"
        accept="image/jpeg, image/jpg, image/png"
        multiple
        onChange={handleFileChange}
        className="mb-4"
      />

      <button
        onClick={handleUpload}
        disabled={loading}
        className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Converting...' : 'Convert to PDF'}
      </button>

      {pdfUrl && (
        <div className="mt-6">
          <a
            href={pdfUrl}
            download="converted.pdf"
            className="text-green-600 font-semibold underline"
          >
            Download PDF
          </a>
        </div>
      )}
    </div>
  );
};

export default Home;
