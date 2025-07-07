const express = require('express');
const router = express.Router();
const Attendance = require('../models/Attendance');
const User = require('../models/User');
const { addAttendanceRow } = require('../googleSheets');

// Mark attendance and update Google Sheet
router.post('/', async (req, res) => {
  const { userId, status } = req.body;
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

module.exports = router;
