import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';
import App from './App';
import theme from './theme';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ChakraProvider value={theme}>
      <BrowserRouter basename="/Recipes">
        <App />
      </BrowserRouter>
    </ChakraProvider>
  </React.StrictMode>
);
