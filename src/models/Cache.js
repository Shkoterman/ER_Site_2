const mongoose = require('mongoose');

// Пример схемы
const cacheSchema = new mongoose.Schema({
  key: { type: String, required: true },
  data: { type: Array, required: true },
});

const Cache = mongoose.model('Cache', cacheSchema);
module.exports = Cache; // Экспортируем модель