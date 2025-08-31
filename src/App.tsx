import React, { useEffect, useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import SearchPage from './pages/SearchPage';
import RecipePage from './pages/RecipePage';
import Layout from './components/Layout';

interface Recipe {
  title: string;
  slug: string;
  tags: string[];
  content: string;
}

export default function App() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Load recipes
    const base = import.meta.env.BASE_URL;
    fetch(`${base}recipes.json`)
      .then(r => r.json())
      .then(setRecipes);
  }, []);

  const handleSearch = (query: string) => {
    navigate(`/?q=${encodeURIComponent(query)}`);
  };

  return (
    <Layout recipes={recipes} onSearch={handleSearch}>
      <Routes>
        <Route path="/" element={<SearchPage />} />
        <Route path="/recipe/:slug" element={<RecipePage />} />
      </Routes>
    </Layout>
  );
}
