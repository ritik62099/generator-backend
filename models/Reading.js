// models/Reading.js
const mongoose = require('mongoose');

const readingSchema = new mongoose.Schema({
  date: { type: String, required: true },
  month: { type: String, required: true },
  openingHour: { type: Number, required: true },
  openingMinute: { type: Number, required: true },
  closingHour: { type: Number, required: true },
  closingMinute: { type: Number, required: true },
  usage: { type: Number, required: true }, // in minutes
});

module.exports = mongoose.model('Reading', readingSchema);
