const express = require('express');
const Task = require('../models/Task');
const auth = require('../middleware/auth');
const router = express.Router({ mergeParams: true });

// @route   GET api/users/:user_id/tasks
// @desc    Get all tasks for a user
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.id });
    res.json(tasks);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/users/:user_id/tasks
// @desc    Create a task for a user
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const { id, ...taskData } = req.body;

    if (id) {
      return res
        .status(400)
        .json({ msg: 'Cannot create task with existing ID' });
    }

    const task = new Task({ ...taskData, user: req.user.id });
    await task.save();
    res.status(201).json(task);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/users/:user_id/tasks/:task_id
// @desc    Get task by id for a user
// @access  Private
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

// @route   PUT api/users/:user_id/tasks/:task_id
// @desc    Update a task for a user
// @access  Private
router.put('/:task_id', auth, async (req, res) => {
  const { id, ...taskFields } = req.body;

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

// @route   DELETE api/users/:user_id/tasks/:task_id
// @desc    Delete a task for a user
// @access  Private
router.delete('/:task_id', auth, async (req, res) => {
  try {
    let task = await Task.findById(req.params.task_id);
    if (!task || task.user.toString() !== req.user.id) {
      return res.status(404).json({ msg: 'Task not found' });
    }
    task = await Task.findByIdAndDelete(req.params.task_id);
    res.json(task);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
