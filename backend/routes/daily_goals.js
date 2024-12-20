const express = require('express');
const DailyGoal = require('../models/DailyGoal');
const auth = require('../middleware/auth');
const router = express.Router({ mergeParams: true });

// @route   GET api/users/:user_id/daily_goals
// @desc    Get all daily goals for a user
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const dailyGoals = await DailyGoal.find({ user: req.user.id });
    res.json(dailyGoals);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/users/:user_id/daily_goals
// @desc    Create a daily goal for a user
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const { id, ...goalData } = req.body;

    if (id) {
      return res
        .status(400)
        .json({ msg: 'Cannot create goal with existing ID' });
    }

    const dailyGoal = new DailyGoal({
      ...goalData,
      user: req.user.id
    });
    await dailyGoal.save();
    res.status(201).json(dailyGoal);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/users/:user_id/daily_goals/:daily_goal_id
// @desc    Get daily goal by id for a user
// @access  Private
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

// @route   PUT api/users/:user_id/daily_goals/:daily_goal_id
// @desc    Update a daily goal for a user
// @access  Private
router.put('/:daily_goal_id', auth, async (req, res) => {
  const { id, ...goalData } = req.body;

  try {
    let dailyGoal = await DailyGoal.findById(req.params.daily_goal_id);
    if (!dailyGoal || dailyGoal.user.toString() !== req.user.id) {
      return res.status(404).json({ msg: 'Daily goal not found' });
    }
    dailyGoal = await DailyGoal.findByIdAndUpdate(
      req.params.daily_goal_id,
      { $set: goalData },
      { new: true }
    );
    res.json(dailyGoal);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/users/:user_id/daily_goals/:daily_goal_id
// @desc    Delete a daily goal for a user
// @access  Private
router.delete('/:daily_goal_id', auth, async (req, res) => {
  try {
    let dailyGoal = await DailyGoal.findById(req.params.daily_goal_id);
    if (!dailyGoal || dailyGoal.user.toString() !== req.user.id) {
      return res.status(404).json({ msg: 'Daily goal not found' });
    }
    dailyGoal = await DailyGoal.findByIdAndDelete(req.params.daily_goal_id);
    res.json(dailyGoal);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
