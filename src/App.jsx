import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import './App.css';
import Navbar from './components/navbar';
import Home from './components/home';
import ImageToPdf from './pages/ImageToPdf';
import ImageCompressor from './pages/ImageCompressor';
import ImageConverter from './pages/ImageConverter';
import ImageResize from './pages/ImageResize';
import ImageRotateFlip from './pages/ImageRotateFlip';
import ImageCrop from './pages/ImageCrop';
import ImageWatermark from './pages/ImageWatermark';
import ImageBackgroundRemove from './pages/ImageBackgroundRemove';
import ImageEditor from './pages/ImageEditor';
import PdfMerger from './pages/PdfMerger';
import PdfSplitter from './pages/PdfSplitter';
import PdfCompressor from './pages/PdfCompressor';
import PdfToWord from './pages/PdfToWord';
import WordToPdf from './pages/WordToPdf';
import PdfToExcel from './pages/PdfToExcel';
import PdfToPowerPoint from './pages/PdfToPowerPoint';
import PdfProtect from './pages/PdfProtect';
import PdfUnlock from './pages/PdfUnlock';
import WordConverter from './pages/WordConverter';
import ExcelConverter from './pages/ExcelConverter';
import PowerPointConverter from './pages/PowerPointConverter';
import TextExtractor from './pages/TextExtractor';
import OcrScanner from './pages/OcrScanner';
import DocumentMerger from './pages/DocumentMerger';
import FormatConverter from './pages/FormatConverter';
import NotFound from './pages/NotFound';

function App() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('darkMode');
    if (savedTheme === 'true') {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('darkMode', newMode.toString());
    
    if (newMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return (
    <HelmetProvider>
      <Router>
        <div className={`min-h-screen transition-colors duration-500 ${darkMode ? 'dark bg-black' : 'bg-white'}`}>
          <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
          <main className="pt-24">
            <Routes>
              <Route path="/" element={<Home />} />
              
              {/* Image Tools */}
              <Route path="/image-to-pdf" element={<ImageToPdf />} />
              {/* Alternative search term routes for Image to PDF */}
              <Route path="/jpg-to-pdf" element={<ImageToPdf />} />
              <Route path="/png-to-pdf" element={<ImageToPdf />} />
              <Route path="/jpeg-to-pdf" element={<ImageToPdf />} />
              <Route path="/photo-to-pdf" element={<ImageToPdf />} />
              <Route path="/picture-to-pdf" element={<ImageToPdf />} />
              <Route path="/convert-image-to-pdf" element={<ImageToPdf />} />
              <Route path="/images-to-pdf" element={<ImageToPdf />} />
              
              <Route path="/image-compressor" element={<ImageCompressor />} />
              <Route path="/image-converter" element={<ImageConverter />} />
              <Route path="/image-resize" element={<ImageResize />} />
              <Route path="/image-rotate-flip" element={<ImageRotateFlip />} />
              <Route path="/image-crop" element={<ImageCrop />} />
              <Route path="/image-watermark" element={<ImageWatermark />} />
              <Route path="/image-background-remove" element={<ImageBackgroundRemove />} />
              <Route path="/image-editor" element={<ImageEditor />} />
              
              {/* PDF Tools */}
              <Route path="/pdf-merge" element={<PdfMerger />} />
              <Route path="/pdf-merger" element={<PdfMerger />} />
              <Route path="/pdf-split" element={<PdfSplitter />} />
              <Route path="/pdf-splitter" element={<PdfSplitter />} />
              <Route path="/pdf-compressor" element={<PdfCompressor />} />
              <Route path="/pdf-to-word" element={<PdfToWord />} />
              <Route path="/word-to-pdf" element={<WordToPdf />} />
              <Route path="/pdf-to-excel" element={<PdfToExcel />} />
              <Route path="/pdf-to-powerpoint" element={<PdfToPowerPoint />} />
              <Route path="/pdf-protect" element={<PdfProtect />} />
              <Route path="/pdf-unlock" element={<PdfUnlock />} />
              
              {/* Document Tools */}
              <Route path="/word-converter" element={<WordConverter />} />
              <Route path="/excel-converter" element={<ExcelConverter />} />
              <Route path="/powerpoint-converter" element={<PowerPointConverter />} />
              <Route path="/ppt-converter" element={<PowerPointConverter />} />
              <Route path="/text-extractor" element={<TextExtractor />} />
              <Route path="/ocr-scanner" element={<OcrScanner />} />
              <Route path="/document-merger" element={<DocumentMerger />} />
              <Route path="/doc-merge" element={<DocumentMerger />} />
              <Route path="/format-converter" element={<FormatConverter />} />
              
              {/* Catch all 404 route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
        </div>
      </Router>
    </HelmetProvider>
  );
}

export default App;
