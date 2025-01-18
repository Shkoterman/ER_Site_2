const mongoose = require('mongoose');

const ClickCountSchema = new mongoose.Schema({
  text: { type: String, required: false },
  key: { type: String, required: false },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('ClickCountTable', ClickCountSchema);
