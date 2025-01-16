import React, { useState } from 'react';
import axios from 'axios';

const ControlPanel = () => {
  const [inputText, setInputText] = useState('');
  const [responseMessage, setResponseMessage] = useState('');
  const [recordCount, setRecordCount] = useState(null);

  const handleClick = async () => {
    try {
      const response = await axios.post('http://localhost:5000/clickcount', {
        text: inputText,
      });
      setResponseMessage(response.data.message);
      setInputText(''); // Очистка строки после успешной записи
    } catch (error) {
      console.error('Ошибка при добавлении записи:', error);
      setResponseMessage('Ошибка при добавлении записи');
    }
  };

  const handleCountRecords = async () => {
    try {
      const response = await axios.get('http://localhost:5000/clickcount/count');
      console.log('Количество записей в таблице:', response.data.count);
      setRecordCount(response.data.count);
    } catch (error) {
      console.error('Ошибка при получении количества записей:', error);
    }
  };

  return (
    <div className="controlPanel-container">
      <h1>Админская Панель</h1>
      <input
        type="text"
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        placeholder="Введите текст"
        className="controlPanel-input"
      />
      <button onClick={handleClick} className="controlPanel-button">
        Отправить
      </button>
      {responseMessage && <div className="response-message">{responseMessage}</div>}
      <button onClick={handleCountRecords} className="controlPanel-button">
        Узнать количество записей
      </button>
      {recordCount !== null && <div className="record-count">Количество записей: {recordCount}</div>}
    </div>
  );
};

export default ControlPanel;

