import axios from 'axios';

async function getCachedData() {
  try {
    const response = await axios.get('http://localhost:5000/cache');
    return response.data; // Получаем данные из кэша с сервера
  } catch (error) {
    console.error('Ошибка при получении данных из кэша:', error);
    return null;
  }
}

async function writeCachedData(newData) {
  try {
    await axios.post('http://localhost:5000/cache', { data: newData });
    console.log('Данные успешно закэшированы.');
  } catch (error) {
    console.error('Ошибка при записи данных в кэш:', error);
  }
}

export const clearCachedData = async () => {
  try {
    // Отправляем запрос на сервер для удаления кэша с ключом 'airtableData'
    await axios.delete('http://localhost:5000/cache', {
      data: { key: 'airtableData' }, // Отправляем ключ, по которому удалим кэш
    });
    console.log('Кэш очищен.');
  } catch (error) {
    console.error('Ошибка при очистке кэша:', error);
  }
};
