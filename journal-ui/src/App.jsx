import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Landing from './components/Landing';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Signup from './components/Signup';
import JournalView from './components/JournalView';
import Profile from './components/Profile';

function App() {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark(!isDark);

  return (
    <Router>
      <div className={isDark ? 'dark' : ''}>
        <Routes>
          <Route path="/" element={<Landing isDark={isDark} toggleTheme={toggleTheme} />} />
          <Route path="/login" element={<Login isDark={isDark} toggleTheme={toggleTheme} />} />
          <Route path="/signup" element={<Signup isDark={isDark} toggleTheme={toggleTheme} />} />
          <Route path="/dashboard" element={localStorage.getItem('token') ? <Dashboard isDark={isDark} toggleTheme={toggleTheme} /> : <Navigate to="/login" replace />} />
          <Route path="/profile" element={localStorage.getItem('token') ? <Profile isDark={isDark} toggleTheme={toggleTheme} /> : <Navigate to="/login" replace />} />
          <Route path="/journal/:id" element={<JournalView isDark={isDark} toggleTheme={toggleTheme} />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
