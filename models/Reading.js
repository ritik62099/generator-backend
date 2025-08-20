const mongoose = require('mongoose');

const ReadingSchema = new mongoose.Schema({
  date: { type: String, required: true, unique: true }, // YYYY-MM-DD
  month: { type: String, required: true },              // YYYY-MM
  openingHour: { type: Number, required: true },
  openingMinute: { type: Number, required: true },
  closingHour: { type: Number, required: true },
  closingMinute: { type: Number, required: true },
  usage: { type: Number, required: true }, // total minutes
}, { timestamps: true });

module.exports = mongoose.model('Reading', ReadingSchema);
