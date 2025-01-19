import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import axios from 'axios';
import Header from './Header'; // Импортируем компонент Header
import ControlPanel from './pages/ControlPanel';
import Login from './pages/Login';
import About from './pages/About';
import CalendarGrid from './pages/CalendarGrid';
import CalendarColumns from './pages/CalendarColumns';
import EventPage from './pages/EventPage';
import Footer from './Footer';
import './App.css';

const App = () => {
  // Подсчёт клика
  const countClick = async (inputText) => {
    try {
      await axios.post('http://localhost:5000/clickcount', {
        text: inputText,
      });
    } catch (error) {
      console.error('Ошибка при добавлении записи:', error);
    }
  };

  return (
    <Router>
      <div className="grid grid-cols-1 min-h-screen">
        {/* Навигация */}
        <Header countClick={countClick} />

        {/* Основной контент */}
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<CalendarGrid />} /> {/* Главная страница */}
            <Route path="/about" element={<About />} />
            <Route path="/CalendarGrid" element={<CalendarGrid />} />
            <Route path="/CalendarColumns" element={<CalendarColumns />} />
            <Route path="/event" element={<EventPage />} /> {/* Страница события */}
            <Route path="/controlpanel" element={<ControlPanel />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </main>

        {/* Футер */}
        <Footer />
      </div>
    </Router>
  );
};

export default App;