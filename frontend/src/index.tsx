import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { Web3Provider } from './contexts/Web3Context'; // <-- Import your Web3Provider
import Product from './components/Product';

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(
  <React.StrictMode>
    <Web3Provider>       {/* 🔥 wrap App inside Web3Provider */}
      <App />
      {/* <Product/> */}
    </Web3Provider>
  </React.StrictMode>
);
