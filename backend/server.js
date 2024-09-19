const express = require('express');
const logger = require('morgan');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

const users = require('./routes/users');
const tasks = require('./routes/tasks');
const dailyGoals = require('./routes/daily_goals');
const monthlyGoals = require('./routes/monthly_goals');

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
app.use('/api/users/:user_id/tasks', tasks);
app.use('/api/users/:user_id/daily_goals', dailyGoals);
app.use('/api/users/:user_id/monthly_goals', monthlyGoals);

app.listen(port, () => {
  console.log(`Server running at http://${hostname}:${port}`);
});
