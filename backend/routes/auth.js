const express = require('express');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const validation = require('../middleware/validation');
const auth = require('../middleware/auth');
const { jwt_options } = require('../config');
const logger = require('../utils/logger');

const router = express.Router();

// @route   POST api/auth
// @desc    Authenticate user & get JWT token
// @access  Public
router.post(
  '/',
  validation.validateLogin,
  validation.checkValidationErrors,
  async (req, res) => {
    try {
      logger.info('Login attempt', { username: req.body.username });
      const { username, password } = req.body;

      const user = await User.findOne({ username });
      if (!user) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Invalid credentials' }] });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Invalid credentials' }] });
      }

      // jwt payload. Used to identify user by routes requiring auth
      const payload = { id: user._id };

      // This is currently using HttpOnly Cookies:
      // remove res.cookie and add token to res.json to switch to only use local session storage

      jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: 1000 * 86400 },
        (err, token) => {
          if (err) throw err;
          res.cookie('token', token, jwt_options);

          // console.log('Set-Cookie header:', res.getHeaders()['set-cookie']);

          res.json({ user });

          console.log('Response:', {
            headers: res.getHeaders(),
            body: res.body
          });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

// @route   GET api/auth/verify-session
// @desc    Verify JWT token
// @access  Public
router.get('/verify-session', auth, async (req, res, next) => {
  console.log(res?.user);
  if (req.user) {
    res.status(200).send(true);
  } else {
    res.status(400).send(false);
  }
});

module.exports = router;
