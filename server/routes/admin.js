const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/auth');

// List all users
router.get('/users', auth('admin'), async (req, res) => {
  const users = await User.find();
  res.json(users.map(u => ({ id: u._id, name: u.name, email: u.email, role: u.role, stars: u.stars })));
});

// Update a user's star rating
router.patch('/users/:id/star', auth('admin'), async (req, res) => {
  const { stars } = req.body;
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { stars }, { new: true });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ id: user._id, name: user.name, stars: user.stars });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
