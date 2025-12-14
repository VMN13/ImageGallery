// src/index.tsx
import React from 'react';
import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';  // Убедитесь, что это /client
import './index.css';
import App from './App';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root element not found');
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
// // Регистрация Service Worker
// if ('serviceWorker' in navigator) {
//   window.addEventListener('load', () => {
//     navigator.serviceWorker.register('/sw.js')
//       .then((registration) => {
//         console.log('SW registered successfully:', registration);
//       })
//       .catch((error) => {
//         console.log('SW registration failed:', error);
//       });
//   });
// }