import mongoose from 'mongoose';

const cacheSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true },
  data: { type: Object, required: true },
  createdAt: { type: Date, default: Date.now, expires: 60 * 60 * 24 }, // Истекает через 24 часа
});

const Cache = mongoose.model('Cache', cacheSchema);

export default Cache;
