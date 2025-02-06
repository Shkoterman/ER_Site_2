import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export const getAirtableDataAllEvents = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/events`); // Запрос к вашему серверу
    return response.data; // Возвращаем данные с сервера
  } catch (error) {
    console.error('Ошибка при запросе данных с сервера:', error.message);
    throw error; // Прокидываем ошибку, чтобы её можно было обработать на клиенте
  }
};