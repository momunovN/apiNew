// Загрузка переменных окружения (для локальной разработки)
if (process.env.NODE_ENV !== 'production') require('dotenv').config();

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

// Инициализация приложения
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Маршруты
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/bookings', require('./routes/bookingRoutes'));

// Обработка ошибок
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Подключение к базе данных и экспорт для Vercel
const startServer = async () => {
  try {
    await connectDB();
    console.log('MongoDB connected');

    if (process.env.NODE_ENV !== 'production') {
      const PORT = process.env.PORT || 5000;
      app.listen(PORT, () => console.log(`Local server running on port ${PORT}`));
    }
  } catch (err) {
    console.error('Database connection error:', err);
    process.exit(1);
  }
};

startServer();

// Экспорт для Vercel
module.exports = app;