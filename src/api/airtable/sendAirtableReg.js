import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export const sendAirtableReg = async ({ tgNick, name, eventId }) => {
  try {
    const response = await axios.post(`${API_URL}/api/register`, {
      tgNick,
      name,
      eventId: [eventId], // передаём ID как массив
    });
    return response.data;
  } catch (error) {
    console.error('Ошибка при отправке данных на сервер:', error.message);
    throw error;
  }
};
