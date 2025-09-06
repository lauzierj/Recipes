import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Box } from '@chakra-ui/react';
import SearchPage from './pages/SearchPage';
import RecipePage from './pages/RecipePage';
import Footer from './components/Footer';

export default function App() {
  return (
    <Box minH="100vh" display="flex" flexDirection="column">
      <Box flex="1">
        <Routes>
          <Route path="/" element={<SearchPage />} />
          <Route path="/recipe/:slug" element={<RecipePage />} />
        </Routes>
      </Box>
      <Footer />
    </Box>
  );
}
