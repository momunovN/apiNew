const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const { getBookings, addBooking } = require('../controllers/bookingController');

router.get('/', auth, getBookings);
router.post('/', auth, addBooking);

module.exports = router;