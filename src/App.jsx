import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import TestPage from './pages/TestPage';
import BulletinPage from './pages/BulletinPage';
import BulletinDBPage from './pages/BulletinDBPage';
import PrintPage from './pages/PrintPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/bulletin" element={<BulletinPage />} />
        <Route path="/bulletindb" element={<BulletinDBPage />} />
        <Route path="/print" element={<PrintPage />} />
        <Route path="/test" element={<TestPage />} />
      </Routes>
    </Router>
  );
}

export default App;
