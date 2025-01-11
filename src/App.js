import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import About from './pages/About';
import CalendarGrid from './pages/CalendarGrid';
import CalendarRand from './pages/CalendarRand';
import CalendarRows from './pages/CalendarRows';
import CalendarColumns from './pages/CalendarColumns';
import './App.css'; 

const App = () => {
  return (
    <div>
      <nav>
        <ul style={{ display: 'flex', justifyContent: 'center', listStyle: 'none', padding: 0 }}>
          <li style={{ margin: '0 20px' }}>
            <Link to="/about">О нас</Link>
          </li>
          <li style={{ margin: '0 20px' }}>
            <Link to="/CalendarGrid">Календарь grid</Link>
          </li>
          <li style={{ margin: '0 20px' }}>
            <Link to="/CalendarRand">Календарь rand</Link>
          </li>
          <li style={{ margin: '0 20px' }}>
            <Link to="/CalendarRows">Календарь rows</Link>
          </li>
          <li style={{ margin: '0 20px' }}>
            <Link to="/CalendarColumns">Календарь columns</Link>
          </li>
        </ul>
      </nav>
      <Routes>
        <Route path="/about" element={<About />} />
        <Route path="/CalendarRand" element={<CalendarRand />} />
        <Route path="/CalendarGrid" element={<CalendarGrid />} />        
        <Route path="/CalendarRows" element={<CalendarRows />} />        
        <Route path="/CalendarColumns" element={<CalendarColumns />} />
      </Routes>
    </div>
  );
};

export default App;

