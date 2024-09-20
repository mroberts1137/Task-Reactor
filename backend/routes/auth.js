const express = require('express');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const validation = require('../middleware/validation');

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

      const payload = { id: user.id };

      // jwt.sign(
      //   payload,
      //   process.env.JWT_SECRET,
      //   { expiresIn: 36000 },
      //   (err, token) => {
      //     if (err) throw err;
      //     res.json({ token, user, userId: user.id });
      //   }
      // );

      // Using Cookies to store JWT:

      jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: 36000 },
        (err, token) => {
          if (err) throw err;
          res.cookie('token', token, { httpOnly: true, secure: true });
          res.json({ token, user, userId: user.id });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

module.exports = router;
