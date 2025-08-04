import React, { useState, useRef } from 'react';

export default function ImgToPdf() {
  const [files, setFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    addFiles(selectedFiles);
  };

  const addFiles = (newFiles) => {
    const validFiles = newFiles.filter(file => 
      file.type.startsWith('image/') && file.size <= 10 * 1024 * 1024 // 10MB limit
    );
    
    const filesWithPreview = validFiles.map((file, index) => ({
      file,
      id: Date.now() + index,
      preview: URL.createObjectURL(file),
      name: file.name
    }));
    
    setFiles(prev => [...prev, ...filesWithPreview]);
  };

  const removeFile = (id) => {
    setFiles(prev => {
      const fileToRemove = prev.find(f => f.id === id);
      if (fileToRemove) {
        URL.revokeObjectURL(fileToRemove.preview);
      }
      return prev.filter(f => f.id !== id);
    });
  };

  const moveFile = (dragIndex, hoverIndex) => {
    setFiles(prev => {
      const newFiles = [...prev];
      const draggedFile = newFiles[dragIndex];
      newFiles.splice(dragIndex, 1);
      newFiles.splice(hoverIndex, 0, draggedFile);
      return newFiles;
    });
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    addFiles(droppedFiles);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (files.length === 0) {
      alert('Please select some images');
      return;
    }

    setIsLoading(true);
    console.log('🚀 Starting PDF conversion...');
    console.log('📁 Number of files:', files.length);
    
    try {
      const formData = new FormData();
      files.forEach(({ file }) => {
        formData.append('images', file);
        console.log('📎 Added file:', file.name, 'Size:', file.size);
      });

      // Try Render backend first (since it's deployed and working)
      let response;
      let successfulEndpoint = null;
      
      console.log('🔄 Trying Render endpoint...');
      try {
        response = await fetch('https://allfilechanger.onrender.com/', {
          method: 'POST',
          mode: 'cors',
          headers: {
            // Don't set Content-Type, let browser set it for FormData
          },
          body: formData,
        });
        
        if (response.ok) {
          console.log('✅ Render success!');
          successfulEndpoint = 'https://allfilechanger.onrender.com/';
        } else {
          console.log('❌ Render failed:', response.status);
          throw new Error('Render failed');
        }
      } catch (renderError) {
        console.log('❌ Render error:', renderError.message);
        
        // Try localhost as fallback
        console.log('🔄 Trying localhost endpoint...');
        try {
          response = await fetch('http://localhost:5000/', {
            method: 'POST',
            body: formData,
          });
          
          if (response.ok) {
            console.log('✅ Localhost success!');
            successfulEndpoint = 'http://localhost:5000/';
          } else {
            console.log('❌ Localhost failed:', response.status);
            throw new Error('Localhost failed');
          }
        } catch (localError) {
          console.log('❌ Localhost error:', localError.message);
          throw new Error('All endpoints failed');
        }
      }

      if (!response || !response.ok) {
        throw new Error('No successful response received');
      }

      console.log('📄 Converting response to blob...');
      const blob = await response.blob();
      console.log('📄 Blob size:', blob.size, 'Type:', blob.type);
      
      if (blob.size === 0) {
        throw new Error('Received empty PDF file');
      }

      console.log('💾 Starting download...');
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `converted-images-${Date.now()}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      
      console.log('✅ Download completed successfully!');
      alert('PDF conversion completed! Check your downloads folder.');
      
    } catch (error) {
      console.error('💥 Error during conversion:', error);
      alert(`Failed to convert images to PDF: ${error.message}`);
    } finally {
      setIsLoading(false);
      console.log('🏁 Process finished');
    }
  };

  const clearAll = () => {
    files.forEach(({ preview }) => URL.revokeObjectURL(preview));
    setFiles([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-2">
            Image to PDF Converter
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">
            Upload multiple images and convert them to a single PDF file
          </p>
        </div>

        {/* Upload Area */}
        <div
          className={`relative border-2 border-dashed rounded-xl p-8 sm:p-12 text-center transition-all duration-300 ${
            isDragging
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-300 bg-white hover:border-gray-400'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="space-y-4">
            <div className="flex justify-center">
              <svg className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            <div>
              <p className="text-lg sm:text-xl font-medium text-gray-700 mb-2">
                Drop images here or click to browse
              </p>
              <p className="text-sm text-gray-500">
                Supports JPEG, PNG • Max 10MB per file
              </p>
            </div>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Select Images
            </button>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>

        {/* File Preview Grid */}
        {files.length > 0 && (
          <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-1">
                  Selected Images ({files.length})
                </h3>
                <p className="text-sm text-gray-500">Drag images to reorder them • Click ✕ to remove</p>
              </div>
              <div className="flex space-x-3 mt-3 sm:mt-0">
                <button
                  onClick={clearAll}
                  className="px-4 py-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors duration-200"
                >
                  Clear All
                </button>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                >
                  Add More
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-6">
              {files.map((fileObj, index) => (
                <div
                  key={fileObj.id}
                  className="relative group bg-gray-50 rounded-lg overflow-hidden border-2 border-transparent hover:border-blue-300 transition-all duration-200 cursor-move"
                  draggable
                  onDragStart={(e) => {
                    e.dataTransfer.setData('text/plain', index.toString());
                    e.currentTarget.style.opacity = '0.5';
                  }}
                  onDragEnd={(e) => {
                    e.currentTarget.style.opacity = '1';
                  }}
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.currentTarget.style.transform = 'scale(1.05)';
                    e.currentTarget.style.boxShadow = '0 8px 25px rgba(59, 130, 246, 0.3)';
                  }}
                  onDragLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.boxShadow = '';
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.boxShadow = '';
                    const dragIndex = parseInt(e.dataTransfer.getData('text/plain'));
                    if (dragIndex !== index) {
                      moveFile(dragIndex, index);
                    }
                  }}
                >
                  <div className="aspect-square">
                    <img
                      src={fileObj.preview}
                      alt={fileObj.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {/* Drag handle indicator */}
                  <div className="absolute top-2 left-1/2 transform -translate-x-1/2 bg-white bg-opacity-80 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                    </svg>
                  </div>
                  <div className="absolute top-2 left-2 bg-blue-600 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shadow-lg">
                    {index + 1}
                  </div>
                  <button
                    onClick={() => removeFile(fileObj.id)}
                    className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-lg z-10"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                  <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-75 text-white text-xs p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <p className="truncate">{fileObj.name}</p>
                    <p className="text-xs text-gray-300">Drag to reorder</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center">
              <button
                onClick={handleSubmit}
                disabled={isLoading}
                className={`inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-lg text-white transition-all duration-200 ${
                  isLoading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500'
                }`}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                    </svg>
                    Converting...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Convert to PDF
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Instructions */}
        {files.length === 0 && (
          <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">How it works:</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                  <span className="text-blue-600 font-bold">1</span>
                </div>
                <h4 className="font-medium text-gray-800 mb-2">Upload Images</h4>
                <p className="text-sm text-gray-600">Select or drag multiple images</p>
              </div>
              <div className="text-center">
                <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                  <span className="text-blue-600 font-bold">2</span>
                </div>
                <h4 className="font-medium text-gray-800 mb-2">Arrange Order</h4>
                <p className="text-sm text-gray-600">Drag to reorder, remove unwanted images</p>
              </div>
              <div className="text-center">
                <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                  <span className="text-blue-600 font-bold">3</span>
                </div>
                <h4 className="font-medium text-gray-800 mb-2">Download PDF</h4>
                <p className="text-sm text-gray-600">Get your converted PDF file</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
