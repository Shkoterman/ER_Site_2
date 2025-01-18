import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../App.css'; // Используем те же стили

const EventDetails = ({ selectedKey, onBack }) => {
  const [eventDetails, setEventDetails] = useState([]);
    
  useEffect(() => {
    const fetchEventDetails = async () => {
        try {
          const response = await axios.get(`http://localhost:5000/clickcount/details/${selectedKey}`);
          setEventDetails(response.data);
        } catch (error) {
          console.error('Ошибка при получении данных:', error);
        }
      };

    fetchEventDetails();
  }, [selectedKey]);

  return (
    <div className="count-of-string-container">
      <h2>Детализация событий:{selectedKey}</h2>
      <button onClick={onBack} className="controlPanel-button">🔙</button>
      <table className="count-of-string-table">
        <thead>
          <tr>
            <th>Событие</th>
            <th>Время</th>
          </tr>
        </thead>
        <tbody>
        {eventDetails.map(({ text, createdAt }, index) => (
            <tr key={index}>
                <td>{text?.trim()}</td>
                <td>{new Date(createdAt).toLocaleString()}</td>
            </tr>
                ))}
        </tbody>
      </table>
    </div>
  );
};

export default EventDetails;
