require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Reading = require('./models/Reading');

const app = express();
app.use(cors({
  origin: 'https://generator-frontend-kappa.vercel.app',
  methods: ['GET', 'POST'],
  credentials: true
}));

app.use(express.json());

// ✅ MongoDB Atlas connection using environment variable
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB connected'))
.catch(err => console.error('❌ MongoDB error:', err));

// ✅ Get all readings for a month
app.get('/readings', async (req, res) => {
  try {
    const { month } = req.query; // format: YYYY-MM
    const readings = await Reading.find({ month });
    res.json(readings);
  } catch (err) {
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

    const month = date?.slice(0, 7);

    const allValid = [openingHour, openingMinute, closingHour, closingMinute]
      .every(v => typeof v === 'number' && !isNaN(v));

    if (!date || !month || !allValid) {
      return res.status(400).json({ error: 'Invalid or missing values' });
    }

    const opening = openingHour * 60 + openingMinute;
    const closing = closingHour * 60 + closingMinute;

    if (closing <= opening) {
      return res.status(400).json({ error: 'Closing time must be after opening time' });
    }

    const usage = closing - opening;

    const existing = await Reading.findOne({ date });

    if (existing) {
      existing.set({
        openingHour,
        openingMinute,
        closingHour,
        closingMinute,
        usage
      });
      await existing.save();
      return res.json({ updated: true });
    }

    await Reading.create({
      date,
      month,
      openingHour,
      openingMinute,
      closingHour,
      closingMinute,
      usage
    });

    res.json({ created: true });
  } catch (err) {
    console.error('Error saving reading:', err);
    res.status(500).json({ error: 'Failed to save reading' });
  }
});

// ✅ Start server (use dynamic port for platforms like Render)
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
