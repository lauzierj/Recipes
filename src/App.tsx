import React from 'react';
import { Routes, Route } from 'react-router-dom';
import SearchPage from './pages/SearchPage';
import RecipePage from './pages/RecipePage';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<SearchPage />} />
      <Route path="/recipe/:slug" element={<RecipePage />} />
    </Routes>
  );
}
