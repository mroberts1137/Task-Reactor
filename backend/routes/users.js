const express = require('express');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const validation = require('../middleware/validation');
const auth = require('../middleware/auth');
const { jwt_options } = require('../config');

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
router
  .route('/:user_id')
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
      const user = await User.findByIdAndUpdate(req.params.user_id, req.body, {
        new: true
      });
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
      const user = await User.findByIdAndRemove(req.params.user_id);
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
      const { username, password } = req.body;
      let user = await User.findOne({ username });
      if (user) {
        return res
          .status(409)
          .json({ errors: [{ msg: 'Username already taken' }] });
      }

      user = new User({ username, password });
      await user.save();

      // jwt payload. Used to identify user by routes requiring auth
      const payload = { id: user._id };

      // This is currently using HttpOnly Cookies
      // remove res.cookie to switch to only use local session storage
      // don't send token in response to switch to only use cookies

      jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: 36000 },
        (err, token) => {
          if (err) throw err;
          res.cookie('token', token, jwt_options);
          res.json({ user });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

// @route   POST api/users/logout
// @desc    Log the user out
// @access  Private
router.post('/logout', (req, res) => {
  // Clear the JWT token cookie
  const { expires, clear_jwt_options } = jwt_options;
  res.clearCookie('token', clear_jwt_options);
  res.sendStatus(200);
});

module.exports = router;
