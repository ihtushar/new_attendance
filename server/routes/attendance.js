const express = require('express');
const router = express.Router();
const Attendance = require('../models/Attendance');
const User = require('../models/User');
const { addAttendanceRow } = require('../googleSheets');
const auth = require('../middleware/auth');

// Mark attendance and update Google Sheet
router.post('/', auth(), async (req, res) => {
  const { status } = req.body;
  const userId = req.user.id;
  try {
    const record = await Attendance.create({ user: userId, status });
    const user = await User.findById(userId);
    // Push update to Google Sheet (async but don't await)
    addAttendanceRow(user.email, status).catch(console.error);
    res.json(record);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get attendance records for the logged-in user
router.get('/me', auth(), async (req, res) => {
  const records = await Attendance.find({ user: req.user.id }).sort({ date: -1 });
  res.json(records);
});

module.exports = router;
