import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import MapPage from './pages/MapPage';
import AgendaPage from './pages/AgendaPage';
import LinksPage from './pages/LinksPage';
import AdminPage from './pages/AdminPage';
import PhotoBooth from './components/PhotoBooth/PhotoBooth';
import { AnimatePresence } from 'framer-motion';

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/map" element={<MapPage />} />
        <Route path="/agenda" element={<AgendaPage />} />
        <Route path="/links" element={<LinksPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/photogame" element={<PhotoBooth />} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <Router>
      <Layout>
        <AnimatedRoutes />
      </Layout>
    </Router>
  );
}

export default App;
