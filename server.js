require('dotenv').config(); // Загружаем переменные окружения из .env
const express = require('express');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { clickcount } = require('./src/api/Counter'); // Импорт обработчика для маршрута /clickcount
const ClickCountTable = require('./src/models/ClickCountTable'); // Импорт модели для MongoDB

const app = express(); // Создаем экземпляр приложения Express

// Подключаем middleware
app.use(cors()); // Разрешаем CORS-запросы
app.use(bodyParser.json()); // Парсим JSON-тело запросов

// Подключение к MongoDB
mongoose.connect('mongodb://localhost:27017/yourdbname')
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch(err => {
    console.error('Database connection error:', err);
  });

// Переменные окружения
const adminPassword = process.env.ADMIN_PASSWORD; // Пароль администратора из .env
const secretKey = process.env.SECRET_KEY || 'your_secret_key'; // Секретный ключ для JWT (по умолчанию)

// Маршрут для записи кликов
app.post('/clickcount', clickcount);

// Маршрут для подсчета записей в таблице ClickCountTable
app.get('/clickcount/count', async (req, res) => {
  try {
    const count = await ClickCountTable.countDocuments(); // Подсчитываем количество документов
    res.json({ count });
  } catch (error) {
    console.error('Ошибка при подсчёте записей:', error);
    res.status(500).json({ message: 'Ошибка сервера' }); // Возвращаем ошибку сервера
  }
});

// Маршрут для логина (проверка пароля и генерация токена)
app.post('/login', (req, res) => {
  const { password } = req.body;

  if (password === adminPassword) { // Проверяем пароль
    const token = jwt.sign({ access: 'admin' }, secretKey, { expiresIn: '1h' }); // Генерация JWT токена
    res.json({ token }); // Возвращаем токен
  } else {
    res.status(401).json({ message: 'Неверный пароль' }); // Ошибка аутентификации
  }
});

// Защищенный маршрут для админской панели
app.get('/controlpanel', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1]; // Извлекаем токен из заголовков

  if (!token) {
    return res.status(401).json({ message: 'Отсутствует токен' }); // Если токена нет, возвращаем ошибку
  }

  try {
    const decoded = jwt.verify(token, secretKey); // Проверяем токен
    if (decoded.access === 'admin') {
      res.json({ message: 'Добро пожаловать в админскую панель' }); // Доступ разрешен
    } else {
      res.status(403).json({ message: 'Доступ запрещен' }); // Доступ запрещен
    }
  } catch (err) {
    res.status(403).json({ message: 'Неавторизованный доступ' }); // Ошибка проверки токена
  }
});

// Запуск сервера
app.listen(5000, () => {
  console.log('Server running on http://localhost:5000'); // Сервер запущен на порту 5000
});
