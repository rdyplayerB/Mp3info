import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './components/App';
import './styles/globals.css';

// Add event listener for DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('root');
  if (!container) {
    console.error('Root element not found!');
    return;
  }
  
  const root = createRoot(container);
  root.render(<App />);
}); 