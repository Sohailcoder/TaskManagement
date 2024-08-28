const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

// Signup Route
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Check if the email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already in use' });
    }

    // Create a new user
    const user = new User({ name, email, password, role });
    await user.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Login Route
router.post('/login', async (req, res) => {
  try {
    const { email, password ,role} = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    if(!user.role === role){
      return res.status(401).json({ error: 'Invalid Role' });

    }


    // Generate JWT token
    const token = jwt.sign({ userId: user._id, role: user.role }, 'process.env.JWT_SECRET', { expiresIn: '1h' });

    res.status(200).json({'token': token ,'role':user.role});
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
