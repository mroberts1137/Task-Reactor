const express = require('express');
const MonthlyGoal = require('../models/MonthlyGoal');
const auth = require('../middleware/auth');
const router = express.Router({ mergeParams: true });

// @route   GET api/users/:user_id/monthly_goals
// @desc    Get all monthly goals for a user
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const monthlyGoals = await MonthlyGoal.find({ user: req.user.id });
    res.json(monthlyGoals);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/users/:user_id/monthly_goals
// @desc    Create a monthly goal for a user
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const { _id, ...goalData } = req.body;

    if (_id) {
      return res
        .status(400)
        .json({ msg: 'Cannot create goal with existing ID' });
    }

    const monthlyGoal = new MonthlyGoal({
      ...goalData,
      user: req.user.id
    });
    await monthlyGoal.save();
    res.status(201).json(monthlyGoal);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/users/:user_id/monthly_goals/:monthly_goal_id
// @desc    Get monthly goal by id for a user
// @access  Private
router.get('/:monthly_goal_id', auth, async (req, res) => {
  try {
    const monthlyGoal = await MonthlyGoal.findById(req.params.monthly_goal_id);
    if (!monthlyGoal || monthlyGoal.user.toString() !== req.user.id) {
      return res.status(404).json({ msg: 'Monthly goal not found' });
    }
    res.json(monthlyGoal);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/users/:user_id/monthly_goals/:monthly_goal_id
// @desc    Update a monthly goal for a user
// @access  Private
router.put('/:monthly_goal_id', auth, async (req, res) => {
  const { _id, ...goalData } = req.body;

  try {
    let monthlyGoal = await MonthlyGoal.findById(req.params.monthly_goal_id);
    if (!monthlyGoal || monthlyGoal.user.toString() !== req.user.id) {
      return res.status(404).json({ msg: 'Monthly goal not found' });
    }
    monthlyGoal = await MonthlyGoal.findByIdAndUpdate(
      req.params.monthly_goal_id,
      { $set: goalData },
      { new: true }
    );
    res.json(monthlyGoal);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/users/:user_id/monthly_goals/:monthly_goal_id
// @desc    Delete a monthly goal for a user
// @access  Private
router.delete('/:monthly_goal_id', auth, async (req, res) => {
  try {
    let monthlyGoal = await MonthlyGoal.findById(req.params.monthly_goal_id);
    if (!monthlyGoal || monthlyGoal.user.toString() !== req.user.id) {
      return res.status(404).json({ msg: 'Monthly goal not found' });
    }
    monthlyGoal = await MonthlyGoal.findByIdAndDelete(
      req.params.monthly_goal_id
    );
    res.json(monthlyGoal);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
