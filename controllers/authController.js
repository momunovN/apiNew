const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Регистрация пользователя
const register = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Проверка на существующего пользователя
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    // Создание пользователя
    const user = new User({ email, password });
    await user.save();

    // Генерация токена
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    res.status(201).json({ token, user: { email: user.email, _id: user._id } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Вход пользователя
const login = async (req, res) => {
  const { email, password } = req.body;

  console.log('Attempting login for:', email);
  
  try {
    const user = await User.findOne({ email });
    if (!user) {
      console.log('User not found:', email);
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Проверка пароля
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Генерация токена
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    res.json({ token, user: { email: user.email, _id: user._id } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { register, login };