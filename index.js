require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require("body-parser");
const Reading = require('./models/Reading');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// ✅ MongoDB Atlas connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB connected'))
.catch(err => console.error('❌ MongoDB error:', err));

// ✅ Root route
app.get("/", (req, res) => {
  res.send("Hello from Express on Vercel!");
});

// ✅ Get all readings for a month
app.get('/readings', async (req, res) => {
  try {
    const { month } = req.query; // format: YYYY-MM
    if (!month) return res.status(400).json({ error: "Month is required (YYYY-MM)" });

    const readings = await Reading.find({ month }).sort({ date: 1 });
    res.json(readings);
  } catch (err) {
    console.error("❌ Error fetching readings:", err);
    res.status(500).json({ error: 'Failed to fetch readings' });
  }
});

// ✅ Add or update a reading
app.post('/readings', async (req, res) => {
  try {
    const {
      date,
      openingHour,
      openingMinute,
      closingHour,
      closingMinute
    } = req.body;

    // --- Validation ---
    if (!date) return res.status(400).json({ error: 'Date is required' });
    const month = date.slice(0, 7);

    const fields = [openingHour, openingMinute, closingHour, closingMinute];
    const allValid = fields.every(v => typeof v === 'number' && !isNaN(v));
    if (!allValid) {
      return res.status(400).json({ error: 'All time fields must be numbers' });
    }

    const opening = openingHour * 60 + openingMinute;
    const closing = closingHour * 60 + closingMinute;

    if (closing <= opening) {
      return res.status(400).json({ error: 'Closing time must be after opening time' });
    }

    const usage = closing - opening;

    // --- Save or Update ---
    const existing = await Reading.findOne({ date });
    if (existing) {
      existing.set({ openingHour, openingMinute, closingHour, closingMinute, usage });
      await existing.save();
      return res.json({ updated: true, reading: existing });
    }

    const newReading = await Reading.create({
      date,
      month,
      openingHour,
      openingMinute,
      closingHour,
      closingMinute,
      usage
    });

    res.json({ created: true, reading: newReading });
  } catch (err) {
    console.error("❌ Error saving reading:", err);
    res.status(500).json({ error: 'Failed to save reading' });
  }
});

module.exports = app;
