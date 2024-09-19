const express = require('express');
const Task = require('../models/Task');
const auth = require('../middleware/auth');
const router = express.Router({ mergeParams: true });

// Create a new task
router.post('/', auth, async (req, res) => {
  try {
    const { title, startTime, endTime, duration, rate, value } = req.body;
    const task = new Task({
      title,
      startTime,
      endTime,
      duration,
      rate,
      value,
      user: req.user.id
    });
    await task.save();
    res.status(201).json(task);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Get all tasks for a user
router.get('/', auth, async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.id });
    res.json(tasks);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Get a single task by ID
router.get('/:task_id', auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.task_id);
    if (!task || task.user.toString() !== req.user.id) {
      return res.status(404).json({ msg: 'Task not found' });
    }
    res.json(task);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Update a task
router.put('/:task_id', auth, async (req, res) => {
  const { title, startTime, endTime, duration, rate, value } = req.body;
  const taskFields = { title, startTime, endTime, duration, rate, value };

  try {
    let task = await Task.findById(req.params.task_id);
    if (!task || task.user.toString() !== req.user.id) {
      return res.status(404).json({ msg: 'Task not found' });
    }
    task = await Task.findByIdAndUpdate(
      req.params.task_id,
      { $set: taskFields },
      { new: true }
    );
    res.json(task);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Delete a task
router.delete('/:task_id', auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.task_id);
    if (!task || task.user.toString() !== req.user.id) {
      return res.status(404).json({ msg: 'Task not found' });
    }
    await Task.findByIdAndRemove(req.params.task_id);
    res.json({ msg: 'Task removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
