import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CountOfString from '../components/CountOfString';
import EventDetails from '../components/EventDetails';
import { fetchAirtableData, clearCachedData } from '../api/api';

const ControlPanel = () => {
  const [selectedKey, setSelectedKey] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    // Проверка наличия токена при загрузке страницы
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login'); // Перенаправление на страницу логина, если нет токена
    }
  }, [navigate]);


  const handleClearAndFetch = async () => {
    
    clearCachedData();
    fetchAirtableData();
  };

  return (
    <div className="controlPanel-container">
      <h1>Админская Панель</h1>

      <button onClick={handleClearAndFetch}>
        Обновить данные из Airtable
      </button>

      {selectedKey ? (
        <EventDetails selectedKey={selectedKey} onBack={() => setSelectedKey(null)} />
      ) : (
        <CountOfString onDetailsClick={setSelectedKey} />
      )}
    </div>
  );
};

export default ControlPanel;
