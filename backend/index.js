const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect('mongodb+srv://ayush:12345@cluster0.oo018hf.mongodb.net/todo-app', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Task schema and model
const taskSchema = new mongoose.Schema({
  text: String,
  done: Boolean,
});

const Task = mongoose.model('Task', taskSchema);

// Get all tasks
app.get('/tasks', async (req, res) => {
  const tasks = await Task.find();
  res.json(tasks);
});

// Add a new task
app.post('/tasks', async (req, res) => {
  const { text } = req.body;
  const newTask = new Task({ text, done: false });
  await newTask.save();
  res.json(newTask);
});

// Delete a task
app.delete('/tasks/:id', async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.status(204).send();
});

// Toggle task completion
app.put('/tasks/:id', async (req, res) => {
  const task = await Task.findById(req.params.id);
  task.done = !task.done;
  await task.save();
  res.json(task);
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
