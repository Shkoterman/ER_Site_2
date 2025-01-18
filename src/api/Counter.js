const ClickCountTable = require('../models/ClickCountTable'); // Импорт модели
const express = require('express');
const router = express.Router();



router.get('/count', async (req, res) => {
    try {
      const count = await ClickCount.countDocuments();
      res.json({ count });
    } catch (error) {
      console.error('Ошибка при подсчёте записей:', error);
      res.status(500).json({ message: 'Ошибка сервера' });
    }
  });
  
  module.exports = router;

  


const clickcount = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ message: 'Поле text не может быть пустым' });
    }

    // Добавление записи в таблицу
    const newEntry = new ClickCountTable({ text, createdAt: new Date() });
    await newEntry.save();

    res.status(201).json({ message: 'Запись успешно добавлена', data: newEntry });
  } catch (error) {
    console.error('Ошибка при добавлении записи тут:', error); // Логирование ошибки
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};

module.exports = { clickcount };
