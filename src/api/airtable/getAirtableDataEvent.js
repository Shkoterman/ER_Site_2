import axios from 'axios';
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';



export const getAirtableDataEvent = async ({ eventId }) => {
    try {
        const response = await axios.get(`${API_URL}/api/event/${eventId}`);
        return response.data; // Отдаём данные компоненту
    } catch (error) {
        console.error('Ошибка при запросе данных с сервера:', error.message);
        throw error;
    }
};

