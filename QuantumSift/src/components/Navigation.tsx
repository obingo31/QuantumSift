'use client'

import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Sun, Moon } from 'lucide-react'

export default function Navigation() {
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    // Check for saved theme preference or system preference
    const savedTheme = localStorage.getItem('theme')
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches

    if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
      setIsDark(true)
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [])

  const toggleDarkMode = () => {
    const newTheme = !isDark
    setIsDark(newTheme)
    
    if (newTheme) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link 
              to="/" 
              className="text-xl font-bold text-gray-800 dark:text-white hover:text-blue-600 transition"
            >
              QuantumSift
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link 
              to="/benchmarks" 
              className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-white transition"
            >
              Benchmarks
            </Link>
            <Link 
              to="/scanner" 
              className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-white transition"
            >
              Scanner
            </Link>
            <Link 
              to="/analyzer" 
              className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-white transition"
            >
              Analyzer
            </Link>
            <Link 
              to="/bounties" 
              className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-white transition"
            >
              Bounties
            </Link>
            <Link 
              to="/admin" 
              className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-white transition"
            >
              Admin
            </Link>
            <Link 
              to="/functions" 
              className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-white transition"
            >
              Functions
            </Link>
            <button
              onClick={toggleDarkMode}
              className="ml-4 p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
              aria-label="Toggle dark mode"
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}
