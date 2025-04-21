const Booking = require('../models/Booking');

// Получение всех бронирований пользователя
const getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id }).sort('-date');
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Создание нового бронирования
const addBooking = async (req, res) => {
  const { movieId, title, seats } = req.body;

  try {
    const booking = new Booking({
      movieId,
      title,
      seats,
      user: req.user._id,
    });

    await booking.save();
    res.status(201).json(booking);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getBookings, addBooking };