import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import axios from 'axios';
import ControlPanel from './pages/ControlPanel';
import Login from './pages/Login'; // Страница логина (если есть)
import About from './pages/About';
import CalendarGrid from './pages/CalendarGrid';
import CalendarColumns from './pages/CalendarColumns';
import EventPage from './pages/EventPage'; // Импортируем EventPage
import logoImage from './img/logo_ensalada.png';
import Footer from './Footer';
import './App.css';

const App = () => {
  //подсчёт клика
  const countClick = async (inputText) => {
    try {
      await axios.post('http://localhost:5000/clickcount', {
        text: inputText,
      });
      //setResponseMessage(response.data.message);
      //setInputText(''); // Очистка строки после успешной записи
    } catch (error) {
      console.error('Ошибка при добавлении записи:', error);
      //setResponseMessage('Ошибка при добавлении записи');
    }
  };


  return (
    <Router> {/* Оборачиваем всё приложение в Router */}
    <div className="grid grid-cols-1 min-h-screen">
      <nav className="p-4 flex">
        <div className="w-48 py-2">
          <img src={logoImage} alt="Logo" />
        </div>
        <ul className="flex-1 flex justify-end gap-8 p-4">
          <li>
            <Link to="/about" onClick={() => countClick('nav: О нас')} >О нас</Link>
          </li>
          <li>
            <Link to="/CalendarGrid" onClick={() => countClick('nav: Календарь grid')} >Календарь grid</Link>
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
        <Route path="/controlpanel" element={<ControlPanel />} />
        <Route path="/login" element={<Login/>} />
      </Routes>
      <Footer />
    </div>
    </Router> // Закрываем Router
  );
};

export default App;
