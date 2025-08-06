import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import './App.css';
import Navbar from './components/navbar';
import Home from './components/home';
import ImageToPdf from './pages/ImageToPdf';
import ImageCompressor from './pages/ImageCompressor';
import ImageConverter from './pages/imageConverter';
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
              <Route path="/image-to-pdf" element={<ImageToPdf />} />
              <Route path="/image-compressor" element={<ImageCompressor />} />
              
              {/* Future routes - ready for expansion */}
              <Route path="/pdf-to-image" element={<NotFound />} />
              <Route path="/pdf-compressor" element={<NotFound />} />
              <Route path="/image-converter" element={<ImageConverter />} />
              
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
