const express = require('express');
const DailyGoal = require('../models/DailyGoal');
const auth = require('../middleware/auth');
const router = express.Router({ mergeParams: true });

// Create a new daily goal
router.post('/', auth, async (req, res) => {
  try {
    const { title, value } = req.body;
    const dailyGoal = new DailyGoal({
      title,
      value,
      user: req.user.id
    });
    await dailyGoal.save();
    res.status(201).json(dailyGoal);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Get all daily goals for a user
router.get('/', auth, async (req, res) => {
  try {
    const dailyGoals = await DailyGoal.find({ user: req.user.id });
    res.json(dailyGoals);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Get a single daily goal by ID
router.get('/:daily_goal_id', auth, async (req, res) => {
  try {
    const dailyGoal = await DailyGoal.findById(req.params.daily_goal_id);
    if (!dailyGoal || dailyGoal.user.toString() !== req.user.id) {
      return res.status(404).json({ msg: 'Daily goal not found' });
    }
    res.json(dailyGoal);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Update a daily goal
router.put('/:daily_goal_id', auth, async (req, res) => {
  const { title, value } = req.body;
  const dailyGoalFields = { title, value };

  try {
    let dailyGoal = await DailyGoal.findById(req.params.daily_goal_id);
    if (!dailyGoal || dailyGoal.user.toString() !== req.user.id) {
      return res.status(404).json({ msg: 'Daily goal not found' });
    }
    dailyGoal = await DailyGoal.findByIdAndUpdate(
      req.params.daily_goal_id,
      { $set: dailyGoalFields },
      { new: true }
    );
    res.json(dailyGoal);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Delete a daily goal
router.delete('/:daily_goal_id', auth, async (req, res) => {
  try {
    const dailyGoal = await DailyGoal.findById(req.params.daily_goal_id);
    if (!dailyGoal || dailyGoal.user.toString() !== req.user.id) {
      return res.status(404).json({ msg: 'Daily goal not found' });
    }
    await DailyGoal.findByIdAndRemove(req.params.daily_goal_id);
    res.json({ msg: 'Daily goal removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
