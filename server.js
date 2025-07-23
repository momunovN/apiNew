if (process.env.NODE_ENV !== 'production') require('dotenv').config();

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/bookings', require('./routes/bookingRoutes'));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.get('/', (req, res) => {
  res.json({
    title: "Movie Booking API",
    description: "API for managing movie bookings",
    version: "1.0.0",
    endpoints: {
      auth: "/api/auth",
      bookings: "/api/bookings"
    }
  });
});

// Запускаем сервер сразу, а подключение к DB делаем в фоне
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on http://0.0.0.0:${PORT}`);
});

// Подключаемся к MongoDB после запуска сервера
connectDB()
  .then(() => console.log('MongoDB connected'))
  .catch(err => {
    console.error('Database connection error:', err);
    process.exit(1);
  });

module.exports = app;