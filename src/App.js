import React from 'react';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ReactGA from "react-ga4"; // Импортируем GA
import Header from './Header'; // Импортируем компонент Header
import About from './pages/About';
import { CalendarGridLoader } from './pages/CalendarGridLoader';
import { EventPageLoader } from './pages/EventPageLoader';
//import EventPage from './pages/EventPage';
import Footer from './Footer';
import './App.css';

const queryClient = new QueryClient();


// Отслеживание изменения маршрутов
const Analytics = () => {
  const location = useLocation();

  React.useEffect(() => {
    ReactGA.send({ hitType: "pageview", page: location.pathname });
  }, [location]);

  return null;
};

export const App = () => {


  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Analytics /> {/* Добавляем компонент отслеживания */}
        <div className='grid grid-cols-1 min-h-screen'>
          {/* Навигация */}
          <Header />

          {/* Основной контент */}
          <main className='flex-grow'>
            <Routes>
              <Route path='/' element={<CalendarGridLoader />} />{' '}
              {/* Главная страница */}
              <Route path='/about' element={<About />} />
              <Route path='/CalendarGrid' element={<CalendarGridLoader />} />
              <Route path='/event/:eventId' element={<EventPageLoader />} />
            </Routes>
          </main>

          {/* Футер */}
          <Footer />
        </div>
      </BrowserRouter>
    </QueryClientProvider>
  );
};
