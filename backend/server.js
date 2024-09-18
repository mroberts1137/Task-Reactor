const express = require('express');
const logger = require('morgan');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

const users = require('./routes/users');

dotenv.config();

const hostname = 'localhost';
const port = 5000;

const app = express();

connectDB();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

/**
 * Routes
 */
app.use('/api/users', users);

app.listen(port, () => {
  console.log(`Server running at http://${hostname}:${port}`);
});
