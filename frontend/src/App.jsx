import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Navbar from './components/navbar';
import Home from './components/home';
import ImageToPdf from './pages/ImageToPdf';

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
    <Router>
      <div className={`min-h-screen transition-colors duration-500 ${darkMode ? 'dark bg-black' : 'bg-white'}`}>
        <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
        <main className="pt-24">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/image-to-pdf" element={<ImageToPdf />} />
            {/* Add more routes here as you create more tools */}
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
