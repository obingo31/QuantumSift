'use client'

import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AnimatePresence } from 'framer-motion';
import Navigation from './components/Navigation';
import Home from './pages/Home';
import Benchmarks from './pages/Benchmarks';
import Scanner from './pages/Scanner';
import Analyzer from './pages/Analyzer';
import Bounties from './pages/Bounties';
import Admin from './pages/Admin';
import Functions from './pages/Functions';
import ErrorBoundary from './components/ErrorBoundary';

// For non-root paths in deployment
const basename = import.meta.env.BASE_URL || '/';

function App() {
  const [isDark, setIsDark] = useState(() => {
    const darkMode = localStorage.getItem('darkMode') === 'true';
    if (darkMode) {
      document.documentElement.classList.add('dark');
    }
    return darkMode;
  });

  const toggleDarkMode = () => {
    const newMode = !isDark;
    setIsDark(newMode);
    localStorage.setItem('darkMode', String(newMode));
    document.documentElement.classList.toggle('dark');
  };

  return (
    <Router basename={basename}>
      <ErrorBoundary>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
          <Navigation isDark={isDark} toggleDarkMode={toggleDarkMode} />
          
          <main className="container mx-auto px-4 py-8">
            <AnimatePresence mode="wait">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/benchmarks" element={<Benchmarks />} />
                <Route path="/scanner" element={<Scanner />} />
                <Route path="/analyzer" element={<Analyzer />} />
                <Route path="/bounties" element={<Bounties />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/functions" element={<Functions />} />
              </Routes>
            </AnimatePresence>
          </main>
          
          <Toaster 
            position="bottom-right"
            toastOptions={{
              className: 'dark:bg-gray-800 dark:text-white',
              duration: 3000,
            }}
          />
        </div>
      </ErrorBoundary>
    </Router>
  );
}

export default App;
