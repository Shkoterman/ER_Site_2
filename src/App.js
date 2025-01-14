import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import About from './pages/About';
import CalendarGrid from './pages/CalendarGrid';
import CalendarColumns from './pages/CalendarColumns';
import EventPage from './pages/EventPage'; // Импортируем EventPage
import logoImage from './img/logo_ensalada.png';
import Footer from './Footer';
import './App.css';

const App = () => {
  return (
    <div className="grid grid-cols-1 min-h-screen">
      <nav className="p-4 flex">
        <div className="w-48 py-2">
          <img src={logoImage} alt="Logo" />
        </div>
        <ul className="flex-1 flex justify-end gap-8 p-4">
          <li>
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
        <Route path="/" element={<CalendarGrid />} /> {/* Главная страница */}
        <Route path="/about" element={<About />} />
        <Route path="/CalendarGrid" element={<CalendarGrid />} />
        <Route path="/CalendarColumns" element={<CalendarColumns />} />
        <Route path="/event" element={<EventPage />} /> {/* Страница события */}
      </Routes>
      <Footer />
    </div>
  );
};

export default App;
