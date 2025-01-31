import React from 'react';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ReactGA from "react-ga4"; // Импортируем GA
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

// Инициализируем GA
ReactGA.initialize("G-RPP0R0RCVL"); // Вставь свой Google Analytics ID

// Отслеживание изменения маршрутов
const Analytics = () => {
  const location = useLocation();

  React.useEffect(() => {
    ReactGA.send({ hitType: "pageview", page: location.pathname });
  }, [location]);

  return null;
};

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
      <BrowserRouter>
        <Analytics /> {/* Добавляем компонент отслеживания */}
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
              <Route path='/event/:id' element={<EventPage />} />
              {/* Страница события */}
              <Route path='/controlpanel' element={<ControlPanel />} />
              <Route path='/login' element={<Login />} />
            </Routes>
          </main>

          {/* Футер */}
          <Footer />
        </div>
      </BrowserRouter>
    </QueryClientProvider>
  );
};
