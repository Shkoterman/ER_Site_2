import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../App.css';

const CountOfString = ({ onDetailsClick }) => {
  const [stringCounts, setStringCounts] = useState({});

  useEffect(() => {
    const fetchStringCounts = async () => {
      try {
        const response = await axios.get(
          'http://localhost:5000/clickcount/strings'
        );
        setStringCounts(response.data);
      } catch (error) {
        console.error('Ошибка при получении количества строк:', error);
      }
    };

    fetchStringCounts();
  }, []);

  const handleDelete = async (text) => {
    const confirmDelete = window.confirm('Удалить?');
    if (confirmDelete) {
      try {
        await axios.delete(`http://localhost:5000/clickcount/strings/${text}`);
        const updatedCounts = { ...stringCounts };
        delete updatedCounts[text];
        setStringCounts(updatedCounts);
      } catch (error) {
        console.error('Ошибка при удалении записи:', error);
      }
    }
  };

  return (
    <div className='count-of-string-container'>
      <h2>Счётчики</h2>
      <table className='count-of-string-table'>
        <thead>
          <tr>
            <th>Счётчик</th>
            <th>Количество</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(stringCounts).map(([key, value]) => (
            <tr key={key}>
              <td>{key}</td>
              <td>{value}</td>
              <td>
                <button
                  onClick={() => handleDelete(key)}
                  className='delete-btn'
                >
                  ❌
                </button>
                <button
                  onClick={() => onDetailsClick(key)}
                  className='controlpanel-details-btn'
                >
                  📊
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CountOfString;
