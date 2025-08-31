import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';
import { system } from './theme';
import App from './App';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ChakraProvider value={system}>
      <BrowserRouter basename="/Recipes">
        <App />
      </BrowserRouter>
    </ChakraProvider>
  </React.StrictMode>
);
