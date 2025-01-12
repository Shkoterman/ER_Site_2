import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import About from './pages/About';
import CalendarGrid from './pages/CalendarGrid';
import CalendarColumns from './pages/CalendarColumns';
import logoImage from './img/logo_ensalada.png';
import Footer from './Footer';
import './App.css'; 

const App = () => {
  return (
    <div class="grid grid-cols-1 min-h-screen">
      <nav class="p-4 flex">
        <div class="w-48 py-2"><img src={logoImage}/></div>
        <ul class="flex-1 flex justify-end gap-8 p-4">
          <li class="">
            <Link to="/about">О нас</Link>
          </li>
          <li>
            <Link to="/CalendarGrid">Календарь grid</Link>
          </li>
          <li>
            <Link to="/CalendarColumns">Календарь columns</Link>
          </li>
        </ul>
      </nav>
      <Routes>
        <Route path="/about" element={<About />} />
        <Route path="/CalendarGrid" element={<CalendarGrid />} />            
        <Route path="/CalendarColumns" element={<CalendarColumns />} />
      </Routes>
      <Footer />
    </div>
  );
};

export default App;

