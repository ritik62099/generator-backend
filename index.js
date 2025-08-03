// // index.js
// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const Reading = require('./models/Reading');

// const app = express();
// app.use(cors());
// app.use(express.json());

// // MongoDB Connection
// mongoose.connect('mongodb://localhost:27017/generator', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// })
// .then(() => console.log('✅ MongoDB connected'))
// .catch(err => console.error('MongoDB error:', err));

// // Get all readings for a month
// app.get('/readings', async (req, res) => {
//   try {
//     const { month } = req.query; // format: YYYY-MM
//     const readings = await Reading.find({ month });
//     res.json(readings);
//   } catch (err) {
//     res.status(500).json({ error: 'Failed to fetch readings' });
//   }
// });

// // Add or update a reading
// // backend/index.js

// app.post('/readings', async (req, res) => {
//   try {
//     const {
//       date,
//       openingHour,
//       openingMinute,
//       closingHour,
//       closingMinute
//     } = req.body;

//     const month = date?.slice(0, 7);

//     const allValid = [openingHour, openingMinute, closingHour, closingMinute]
//       .every(v => typeof v === 'number' && !isNaN(v));

//     if (!date || !month || !allValid) {
//       return res.status(400).json({ error: 'Invalid or missing values' });
//     }

//     const opening = openingHour * 60 + openingMinute;
//     const closing = closingHour * 60 + closingMinute;

//     if (closing <= opening) {
//       return res.status(400).json({ error: 'Closing time must be after opening time' });
//     }

//     const usage = closing - opening;

//     const existing = await Reading.findOne({ date });

//     if (existing) {
//       existing.set({
//         openingHour,
//         openingMinute,
//         closingHour,
//         closingMinute,
//         usage
//       });
//       await existing.save();
//       return res.json({ updated: true });
//     }

//     await Reading.create({
//       date,
//       month,
//       openingHour,
//       openingMinute,
//       closingHour,
//       closingMinute,
//       usage
//     });

//     res.json({ created: true });
//   } catch (err) {
//     console.error('Error saving reading:', err);
//     res.status(500).json({ error: 'Failed to save reading' });
//   }
// });


// // Start Server
// const PORT = 5000;
// app.listen(PORT, () => {
//   console.log(`🚀 Server running at http://localhost:${PORT}`);
// });


// backend/index.js
const express = require('express');
const cors = require('cors');
const sequelize = require('./sequelize');
const Reading = require('./models/Reading');

const app = express();
app.use(cors());
app.use(express.json());

// Sync DB (only once or on schema change)
sequelize.sync().then(() => {
  console.log('✅ SQL database synced');
}).catch((err) => {
  console.error('❌ Sync error:', err);
});

// Get readings
app.get('/readings', async (req, res) => {
  try {
    const { month } = req.query;
    const readings = await Reading.findAll({ where: { month } });
    res.json(readings);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch readings' });
  }
});

// Add or update reading
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
      return res.status(400).json({ error: 'Closing must be after opening' });
    }

    const usage = closing - opening;

    const existing = await Reading.findOne({ where: { date } });

    if (existing) {
      await existing.update({
        openingHour,
        openingMinute,
        closingHour,
        closingMinute,
        usage
      });
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

// Start Server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
