const mongoose = require('mongoose');

const ClickCountSchema = new mongoose.Schema({
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('ClickCountTable', ClickCountSchema);
