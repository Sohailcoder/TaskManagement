const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const Task = require('../models/Task');
const User = require('../models/User'); // Ensure User model is imported
const router = express.Router();

// Middleware to authenticate and extract user ID from token
const authenticateToken = (req, res, next) => {
  const token = req.headers.token;
  if (!token) return res.status(401).json({ error: 'Token is required' });

  jwt.verify(token, 'process.env.JWT_SECRET', (err, decoded) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });

    req.userId = decoded.userId;
    req.role = decoded.role; // Optionally, you can use this to manage roles
    next();
  });
};



// get all user admin
// Get All Users with Their Associated Tasks (Admin Only)
// Get an Array of Usernames and Their Associated Tasks (Admin Only)
// Get an Array of Usernames Followed by Their Associated Tasks (Admin Only)
router.get('/all-users-tasks', async (req, res) => {
  try {
    // Check if the authenticated user is an admin
    if (req.role == 'admin') {
      return res.status(403).json({ error: 'Access denied. Admins only.' });
    }

    // Fetch all users with their associated tasks
    const users = await User.find().populate('tasks');

    // Map the users to an array of arrays, each containing username and tasks
    const userTasksArray = users.map(user => [
      user.email || 'No Username', // Ensure that username is populated
      user.tasks    // Tasks are already populated
    ]);

    res.status(200).json(userTasksArray);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});




// Get a Single Task by ID for the Authenticated User
router.get('/', authenticateToken, async (req, res) => {
  try {
    // Validate user ID from the request
    if (!req.userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    // Find the user by ID
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Ensure user.tasks is an array
    if (!Array.isArray(user.tasks)) {
      return res.status(400).json({ error: 'Invalid tasks format for the user' });
    }

    // Extract pagination parameters from the query string
    const page = parseInt(req.query.page, 10) || 1; // Default to page 1 if not provided
    const limit = parseInt(req.query.limit, 10) || 10; // Default to 10 items per page if not provided

    // Validate pagination parameters
    if (page < 1 || limit < 1) {
      return res.status(400).json({ error: 'Page and limit must be positive integers' });
    }

    // Calculate the number of items to skip
    const skip = (page - 1) * limit;

    console.log(`Page: ${page}, Limit: ${limit}, Skip: ${skip}`);

    // Find and paginate tasks that belong to the user
    const tasks = await Task.find({ _id: { $in: user.tasks } })
      .skip(skip)
      .limit(limit);

    // Get the total count of tasks for pagination info
    const totalTasks = await Task.countDocuments({ _id: { $in: user.tasks } });

    // Send paginated tasks and additional pagination info
    res.status(200).json({
      tasks,
      pagination: {
        page,
        limit,
        totalTasks,
        totalPages: Math.ceil(totalTasks / limit),
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// Create a Task and associate it with the authenticated User
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { title, description, status, date } = req.body;

    if (!req.userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    const task = new Task({ title, description, status, date });
    await task.save();

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (!user.tasks.includes(task._id)) {
      user.tasks.push(task._id);
      await user.save();
    }

    res.status(201).json({ message: 'Task created and added to user successfully', task });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update a Task
router.put('/:id', authenticateToken, async (req, res) => {
    try {
      const { title, description, status, date } = req.body;
      const taskId = req.params.id;
  
      // Validate user ID
      if (!req.userId) {
        return res.status(400).json({ error: 'User ID is required' });
      }
  
      // Find the user
      const user = await User.findById(req.userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      // Find the task by ID
      const task = await Task.findById(taskId);
      if (!task) {
        return res.status(404).json({ error: 'Task not found' });
      }
  
      // Check if the task belongs to the user
      if (!user.tasks.includes(task._id)) {
        return res.status(403).json({ error: 'Access denied' });
      }
  
      // Update the task
      task.title = title || task.title;
      task.description = description || task.description;
      task.status = status || task.status;
      task.date = date || task.date;
  
      await task.save();
  
      res.status(200).json({ message: 'Task updated successfully', task });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

// Delete a Task by ID for the Authenticated User
router.delete('/:id', authenticateToken, async (req, res) => {
    try {
      const taskId = req.params.id;
  
      // Validate user ID
      if (!req.userId) {
        return res.status(400).json({ error: 'User ID is required' });
      }
  
      // Find the user
      const user = await User.findById(req.userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      // Find the task by ID
      const task = await Task.findById(taskId);
      if (!task) {
        return res.status(404).json({ error: 'Task not found' });
      }
  
      // Check if the task belongs to the user
      if (!user.tasks.includes(task._id)) {
        return res.status(403).json({ error: 'Access denied' });
      }
  
      // Remove the task ID from the user's tasks array
      user.tasks = user.tasks.filter(taskId => !taskId.equals(task._id));
      await user.save();
  
      // Delete the task
      await Task.findByIdAndDelete(taskId);
  
      res.status(200).json({ message: 'Task deleted successfully' });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
  
module.exports = router;
