import React, { useState, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';

function ImageEditor() {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [editSettings, setEditSettings] = useState({
    brightness: 100,
    contrast: 100,
    saturation: 100,
    blur: 0,
    rotation: 0
  });

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        setSelectedFile(file);
        setPreview(URL.createObjectURL(file));
      }
    }
  }, []);

  const handleDragEnter = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleFileInput = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleEdit = async () => {
    if (!selectedFile) return;
    
    setIsProcessing(true);
    const formData = new FormData();
    formData.append('image', selectedFile);
    formData.append('brightness', editSettings.brightness);
    formData.append('contrast', editSettings.contrast);
    formData.append('saturation', editSettings.saturation);
    formData.append('blur', editSettings.blur);
    formData.append('rotation', editSettings.rotation);

    try {
      const response = await fetch(`${import.meta.env.VITE_IMAGEEDITOR_URL}/edit`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const blob = await response.blob();
        
        // Mobile-friendly download with fallback
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        
        if (isMobile) {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'edited-image.png';
          a.style.display = 'none';
          document.body.appendChild(a);
          
          setTimeout(() => {
            a.click();
            document.body.removeChild(a);
            setTimeout(() => {
              window.open(url, '_blank');
            }, 1000);
            window.URL.revokeObjectURL(url);
          }, 100);
        } else {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'edited-image.png';
          a.click();
          window.URL.revokeObjectURL(url);
        }
        
        setShowSuccess(true);
        setTimeout(() => {
          navigate('/', { replace: true });
        }, 2000);
      }
    } catch (error) {
      console.error('Edit error:', error);
      alert('Failed to edit image. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black transition-all duration-500">
      <Helmet>
        <title>Free Image Editor Online | Edit Photos & Pictures - AllFileChanger</title>
        <meta name="description" content="Edit images online for free. Adjust brightness, contrast, saturation, rotation, and more. Support JPG, PNG, WebP. Fast and easy to use." />
        <link rel="canonical" href="https://allfilechanger.com/image-editor" />
      </Helmet>
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-orange-600 via-red-600 to-pink-800 dark:from-black dark:via-black dark:to-black">
        <div className="absolute inset-0 bg-black/20 dark:bg-black/80 transition-all duration-500"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-orange-500 to-red-600 rounded-3xl mb-6 shadow-2xl transition-all duration-300 hover:scale-110">
              <span className="text-3xl text-white">🎨</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6 transition-all duration-500 leading-tight">
              <span className="text-yellow-300 dark:text-yellow-400">Image Editor</span> Tool
            </h1>
            <p className="text-lg sm:text-xl lg:text-2xl text-orange-100 dark:text-gray-200 max-w-4xl mx-auto mb-6 sm:mb-8 transition-all duration-500 px-4">
              Edit your images with <strong className="text-white">professional controls</strong>. 
              Free, fast, and works directly in your browser!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center px-4">
              <div className="text-orange-100 dark:text-gray-300 text-sm sm:text-base transition-colors duration-500 text-center">
                ✓ 100% Free  ✓ Multiple Adjustments  ✓ High Quality  ✓ Instant Processing
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Tool Section */}
      <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white dark:bg-black rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden transition-all duration-500">
            
            {/* Upload Area */}
            <div className="p-4 sm:p-6 lg:p-8">
              <div
                className={`relative border-2 border-dashed rounded-xl p-6 sm:p-8 lg:p-12 text-center transition-all duration-300 ${
                  dragActive
                    ? 'border-orange-500 bg-orange-50 dark:bg-orange-950/50 scale-105'
                    : 'border-gray-300 dark:border-gray-800 hover:border-orange-400 dark:hover:border-orange-500'
                }`}
                onDrop={handleDrop}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
              >
                <div className="space-y-4 sm:space-y-6">
                  <div className="mx-auto w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-orange-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <svg className="w-8 h-8 sm:w-10 sm:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-900 dark:text-white transition-colors duration-500">
                      {dragActive ? 'Drop your image here!' : 'Drop your image here'}
                    </p>
                    <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 transition-colors duration-500">
                      or <span className="text-orange-600 dark:text-orange-400 font-medium">click to select a file</span> from your device
                    </p>
                  </div>
                  
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileInput}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  
                  <div className="flex flex-wrap justify-center gap-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400 transition-colors duration-500">
                    <span className="px-3 py-1 bg-gray-100 dark:bg-black rounded-full transition-colors duration-300">JPG</span>
                    <span className="px-3 py-1 bg-gray-100 dark:bg-black rounded-full transition-colors duration-300">PNG</span>
                    <span className="px-3 py-1 bg-gray-100 dark:bg-black rounded-full transition-colors duration-300">WebP</span>
                    <span className="px-3 py-1 bg-gray-100 dark:bg-black rounded-full transition-colors duration-300">GIF</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Edit Controls */}
            {selectedFile && (
              <div className="border-t border-gray-200 dark:border-gray-800 p-6 sm:p-8">
                {preview && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Preview:</h3>
                    <img src={preview} alt="Preview" className="max-w-full h-auto rounded-lg shadow-lg mx-auto" style={{ maxHeight: '300px' }} />
                  </div>
                )}
                
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-4 transition-colors duration-500">
                  Edit Settings
                </h3>
                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Brightness: {editSettings.brightness}%
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="200"
                      value={editSettings.brightness}
                      onChange={(e) => setEditSettings({...editSettings, brightness: parseInt(e.target.value)})}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Contrast: {editSettings.contrast}%
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="200"
                      value={editSettings.contrast}
                      onChange={(e) => setEditSettings({...editSettings, contrast: parseInt(e.target.value)})}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Saturation: {editSettings.saturation}%
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="200"
                      value={editSettings.saturation}
                      onChange={(e) => setEditSettings({...editSettings, saturation: parseInt(e.target.value)})}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Blur: {editSettings.blur}px
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="20"
                      value={editSettings.blur}
                      onChange={(e) => setEditSettings({...editSettings, blur: parseInt(e.target.value)})}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Rotation: {editSettings.rotation}°
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="360"
                      value={editSettings.rotation}
                      onChange={(e) => setEditSettings({...editSettings, rotation: parseInt(e.target.value)})}
                      className="w-full"
                    />
                  </div>
                </div>

                {showSuccess && (
                  <div className="mb-4 p-4 bg-green-50 dark:bg-green-900/50 border border-green-200 dark:border-green-800 rounded-xl">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-5 h-5 text-green-600 dark:text-green-400">
                          <svg fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <span className="text-green-800 dark:text-green-200 font-medium">
                          Image edited successfully! Download started automatically.
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                <button
                  onClick={handleEdit}
                  disabled={isProcessing}
                  className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {isProcessing ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Editing Image...</span>
                    </>
                  ) : (
                    <>
                      <span>🎨</span>
                      <span>Apply Edits</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

export default ImageEditor;
