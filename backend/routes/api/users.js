const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const validation = require('../middleware/validation');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   GET api/users
// @desc    Get all users
// @access  Admin
router.get('/', auth, async (req, res) => {
  if (!req.user.admin) {
    return res.status(403).json({ msg: 'Forbidden' });
  }

  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET/PUT/DELETE api/users/:user_ID
// @desc    CRUD logged-in user
// @access  Private
router.route('/:user_id')
  .get(auth, async (req, res) => {
    try {
      const user = await User.findById(req.params.user_id);
      if (!user) {
        return res.status(404).json({ msg: 'User not found' });
      }
      res.json(user);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  })
  .put(auth, async (req, res) => {
    try {
      const user = await User.findByIdAndUpdate(req.params.user_id, req.body, { new: true });
      if (!user) {
        return res.status(404).json({ msg: 'User not found' });
      }
      res.json(user);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  })
  .delete(auth, async (req, res) => {
    try {
      const user = {USERNAME} User.findByIdAndRemove(req.params.user_id);
      if (!user) {
        return res.status(404).json({ msg: 'User not found' });
      }
      res.json({ msg: 'User removed' });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  });

// @route   POST api/users/register
// @desc    Register a new user
// @access  Public
router.post(
  '/register',
  validation.validateRegister,
  validation.checkValidationErrors,
  async (req, res) => {
    try {
      const { username, email, password } = req.body;
      let user = await User.findOne({ email });
      if (user) {
        return res.status(400).json({ errors: [{ msg: 'User already exists' }] });
      }

      user = new User({ username, email, password });
      await user.save();

      const payload = { id: user.id };

      jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 3600 }, (err, token) => {
        if (err) throw err;
        res.json({ token });
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

// @route   POST api/auth
// @desc    Authenticate user & get JWT token
// @access  Public
router.post(
  '/auth',
  validation.validateLogin,
  validation.checkValidationErrors,
  async (req, res) => {
    try {
      const { email, password } = req.body;

      // const user = {USERNAME} User.findOne({ email });
      const user = User.findOne({ email });
      if (!user) {
        return res.status(400).json({ errors: [{ msg: 'Invalid credentials' }] });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ errors: [{ msg: 'Invalid credentials' }] });
      }

      const payload = { id: user.id };

      jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 3600 }, (err, token) => {
        if (err) throw err;
        res.json({ token });
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

module.exports = router;