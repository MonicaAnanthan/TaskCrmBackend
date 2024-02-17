const express = require('express');
const dotenv = require("dotenv");
const bodyParser = require('body-parser');
const cors = require('cors');
const Task = require('./Model/taskModel');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('./Model/userModel');

dotenv.config();
require('./Database/dbCongfig');

const secretKey = process.env.JWT_SECRET;
console.log('Generated Secret Key:', secretKey);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(cors());

app.get('/signup', (req, res) => {
  res.send(`
    <html>
      <head>
        <title>Signup Page</title>
      </head>
      <body>
        <h1>Signup</h1>
        <form action="/signup" method="post">
          <label>Email:</label>
          <input type="email" name="email" required><br>
          <label>Password:</label>
          <input type="password" name="password" required><br>
          <button type="submit">Signup</button>
        </form>
      </body>
    </html>
  `);
});

app.get('/login', (req, res) => {
  res.send(`
    <html>
      <head>
        <title>Login Page</title>
      </head>
      <body>
        <h1>Login</h1>
        <form action="/login" method="post">
          <label>Email:</label>
          <input type="email" name="email" required><br>
          <label>Password:</label>
          <input type="password" name="password" required><br>
          <button type="submit">Login</button>
        </form>
      </body>
    </html>
  `);
});

app.get('/', (req, res) => {
  res.send('Welcome to the task management system!');
});

app.post('/signup', async (req, res) => {
  try {
    const { email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ email, password: hashedPassword });
    res.status(201).json({ message: 'User created successfully', user: newUser });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create user', error: error.message });
  }
});

app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const token = jwt.sign({ userId: user._id, email: user.email }, process.env.JWT_SECRET);
    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    res.status(500).json({ message: 'Login failed', error: error.message });
  }
});

app.get('/tasks', async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/tasks', async (req, res) => {
  const task = new Task({
    title: req.body.title,
    description: req.body.description,
    status: req.body.status,
  });

  try {
    const newTask = await task.save();
    res.status(201).json(newTask);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.delete('/tasks/:taskId', async (req, res) => {
  const taskId = req.params.taskId;
  try {
    const deletedTask = await Task.findByIdAndDelete(taskId);
    if (!deletedTask) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.json({ message: 'Task deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.put('/tasks/:taskId', async (req, res) => {
  const taskId = req.params.taskId;
  try {
    const task = await Task.findById(taskId);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    task.title = req.body.title || task.title;
    task.description = req.body.description || task.description;
    task.status = req.body.status || task.status;

    const updatedTask = await task.save();

    res.json(updatedTask);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
