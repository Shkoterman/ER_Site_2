require('dotenv').config(); // Загружаем переменные окружения из .env
const express = require('express');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const bodyParser = require('body-parser');
const { clickcount } = require('./src/api/Counter');
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.post('/clickcount', clickcount);
// Пароль из .env файла
const adminPassword = process.env.ADMIN_PASSWORD;
const secretKey = process.env.SECRET_KEY || 'your_secret_key'; // Секретный ключ для JWT
const mongoose = require('mongoose');
const ClickCountTable = require('./src/models/ClickCountTable');
mongoose.connect('mongodb://localhost:27017/yourdbname')
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch(err => {
    console.error('Database connection error:', err);
  });

app.get('/clickcount/count', async (req, res) => {
  try {
    const count = await ClickCountTable.countDocuments();
    res.json({ count });
  } catch (error) {
    console.error('Ошибка при подсчёте записей:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// Маршрут для логина (проверяем пароль и генерируем токен)
app.post('/login', (req, res) => {
  const { password } = req.body;
  if (password === adminPassword) {
    // Генерация JWT токена
    const token = jwt.sign({ access: 'admin' }, secretKey, { expiresIn: '1h' });
    res.json({ token });
  } else {
    res.status(401).json({ message: 'Неверный пароль' });
  }
});

// Защищенный маршрут для админской панели
app.get('/controlpanel', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Отсутствует токен' });
  }

  try {
    const decoded = jwt.verify(token, secretKey);
    if (decoded.access === 'admin') {
      res.json({ message: 'Добро пожаловать в админскую панель' });
    } else {
      res.status(403).json({ message: 'Доступ запрещен' });
    }
  } catch (err) {
    res.status(403).json({ message: 'Неавторизованный доступ' });
  }
});

app.listen(5000, () => {
  console.log('Server running on http://localhost:5000');
});
