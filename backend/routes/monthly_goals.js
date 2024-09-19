const express = require('express');
const MonthlyGoal = require('../models/MonthlyGoal');
const auth = require('../middleware/auth');
const router = express.Router({ mergeParams: true });

// Create a new monthly goal
router.post('/', auth, async (req, res) => {
  try {
    const { title, value } = req.body;
    const monthlyGoal = new MonthlyGoal({
      title,
      value,
      user: req.user.id
    });
    await monthlyGoal.save();
    res.status(201).json(monthlyGoal);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Get all monthly goals for a user
router.get('/', auth, async (req, res) => {
  try {
    const monthlyGoals = await MonthlyGoal.find({ user: req.user.id });
    res.json(monthlyGoals);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Get a single monthly goal by ID
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

// Update a monthly goal
router.put('/:monthly_goal_id', auth, async (req, res) => {
  const { title, value } = req.body;
  const monthlyGoalFields = { title, value };

  try {
    let monthlyGoal = await MonthlyGoal.findById(req.params.monthly_goal_id);
    if (!monthlyGoal || monthlyGoal.user.toString() !== req.user.id) {
      return res.status(404).json({ msg: 'Monthly goal not found' });
    }
    monthlyGoal = await MonthlyGoal.findByIdAndUpdate(
      req.params.monthly_goal_id,
      { $set: monthlyGoalFields },
      { new: true }
    );
    res.json(monthlyGoal);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Delete a monthly goal
router.delete('/:monthly_goal_id', auth, async (req, res) => {
  try {
    const monthlyGoal = await MonthlyGoal.findById(req.params.monthly_goal_id);
    if (!monthlyGoal || monthlyGoal.user.toString() !== req.user.id) {
      return res.status(404).json({ msg: 'Monthly goal not found' });
    }
    await MonthlyGoal.findByIdAndRemove(req.params.monthly_goal_id);
    res.json({ msg: 'Monthly goal removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
