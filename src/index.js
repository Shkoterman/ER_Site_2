import React from 'react';
import { createRoot } from 'react-dom/client'; // Импортируем createRoot
import { App } from './App';
import './index.css';

const container = document.getElementById('root');
const root = createRoot(container); // Создаём root
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
