import axios from 'axios';

// Конфигурация Airtable
const AIRTABLE_API_KEY = process.env.REACT_APP_AIRTABLE_API_KEY;
const BASE_ID = process.env.REACT_APP_BASE_ID;
const TABLE_NAME = process.env.REACT_APP_TABLE_NAME;
const VIEW_NAME = "for_web_calendar";

// Локальный JSON объект для хранения данных
let cachedData = null;

// Метод для получения данных из Airtable с использованием определенного вида (view)
export const fetchAirtableData = async () => {
  try {
    const response = await axios.get(
      `https://api.airtable.com/v0/${BASE_ID}/${TABLE_NAME}?view=${VIEW_NAME}`, // Добавление параметра view
      {
        headers: {
          Authorization: `Bearer ${AIRTABLE_API_KEY}`,
        },
      }
    );

    // Обновляем локальный кэш
    cachedData = response.data.records;
    console.log('Данные успешно обновлены:', cachedData);

    return cachedData;
  } catch (error) {
    // Выводим ошибку в консоль
    console.error('Ошибка при запросе данных из Airtable:', error.message);

    // Дополнительно выводим информацию о коде ошибки, если доступно
    if (error.response) {
      console.error('Код ошибки:', error.response.status);
      console.error('Ответ сервера:', error.response.data);
    } else if (error.request) {
      console.error('Запрос был отправлен, но ответа не получено:', error.request);
    } else {
      console.error('Ошибка при настройке запроса:', error.message);
    }

    return cachedData; // Возвращаем кэшированные данные, если они есть
  }
};
