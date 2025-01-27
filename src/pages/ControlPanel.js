import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { QueryClient } from '@tanstack/react-query';

import CountOfString from '../components/CountOfString';
import EventDetails from '../components/EventDetails';
import { clearCachedData } from '../api/api';
import { QUERY_KEYS } from '../constants/queryKeys';

const ControlPanel = () => {
  const queryClient = new QueryClient();
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
    queryClient.resetQueries({
      queryKey: QUERY_KEYS.AIRTABLE_DATA,
      exact: true,
    });
  };

  return (
    <div className='controlPanel-container'>
      <h1>Админская Панель</h1>

      <button onClick={handleClearAndFetch}>Обновить данные из Airtable</button>

      {selectedKey ? (
        <EventDetails
          selectedKey={selectedKey}
          onBack={() => setSelectedKey(null)}
        />
      ) : (
        <CountOfString onDetailsClick={setSelectedKey} />
      )}
    </div>
  );
};

export default ControlPanel;
