const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const user = require('./routes/user.js'); // Ensure user.js exists and is correctly implemented
const task = require('./routes/task'); // Ensure task.js exists and is correctly implemented
const app = express();
require('dotenv').config();


app.use(cors());
app.use(express.json());

mongoose.connect(process.env.Mongo_url)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB connection error:', err));

// Routes
app.use('/api/tasks', task);
app.use('/api/users', user); // Uncomment this line if you have user routes

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

const PORT = process.env.PORT ;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
