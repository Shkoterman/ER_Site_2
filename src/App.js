import React from 'react';
import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import Header from './Header'; // Импортируем компонент Header
import ControlPanel from './pages/ControlPanel';
import Login from './pages/Login';
import About from './pages/About';
import { CalendarGridLoader } from './pages/CalendarGridLoader';
//import CalendarColumns from './pages/CalendarColumns';
import EventPage from './pages/EventPage';
import Footer from './Footer';
import './App.css';

const queryClient = new QueryClient();

export const App = () => {
  // Подсчёт клика
  const countClick = async (inputText) => {
    /*try {
      await axios.post('http://localhost:5000/clickcount', {
        text: inputText,
      });
    } catch (error) {
      console.error('Ошибка при добавлении записи:', error);
    }*/
  };

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className='grid grid-cols-1 min-h-screen'>
          {/* Навигация */}
          <Header countClick={countClick} />

          {/* Основной контент */}
          <main className='flex-grow'>
            <Routes>
              <Route path='/' element={<CalendarGridLoader />} />{' '}
              {/* Главная страница */}
              <Route path='/about' element={<About />} />
              <Route path='/CalendarGrid' element={<CalendarGridLoader />} />
              {/*<Route path="/CalendarColumns" element={<CalendarColumns />} />*/}
              <Route path='/event' element={<EventPage />} />{' '}
              {/* Страница события */}
              <Route path='/controlpanel' element={<ControlPanel />} />
              <Route path='/login' element={<Login />} />
            </Routes>
          </main>

          {/* Футер */}
          <Footer />
        </div>
      </Router>
    </QueryClientProvider>
  );
};
