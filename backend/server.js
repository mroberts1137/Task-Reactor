const express = require('express');
const cors = require('cors');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const rateLimit = require('express-rate-limit');

const auth = require('./routes/auth');
const users = require('./routes/users');
const tasks = require('./routes/tasks');
const dailyGoals = require('./routes/daily_goals');
const monthlyGoals = require('./routes/monthly_goals');

dotenv.config();

if (process.env.NODE_ENV === 'production') {
  console.log('Running in production mode');
} else {
  console.log('Running in development mode');
}

const HOST = 'localhost';
const PORT = 5000;
const serverUrl =
  process.env.NODE_ENV === 'production'
    ? 'https://task-reactor.onrender.com'
    : `http://${HOST}:${PORT}`;

const app = express();

app.use(logger('dev'));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300 // limit each IP's requests per windowMs
});

app.use(limiter);

connectDB();

const corsOptions = {
  origin: [
    process.env.DEV_ORIGIN,
    process.env.PRODUCTION_ORIGIN,
    'https://task-reactor-fdc1c.firebaseapp.com'
  ],
  credentials: true,
  optionsSuccessStatus: 200 // For legacy browser support
};

// Apply CORS middleware to all routes
app.use(cors(corsOptions));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

/**
 * Routes
 */
app.use('/api/auth', auth);
app.use('/api/users', users);
app.use('/api/users/:user_id/tasks', tasks);
app.use('/api/users/:user_id/daily_goals', dailyGoals);
app.use('/api/users/:user_id/monthly_goals', monthlyGoals);

// Render health check
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

app.listen(PORT, () => {
  console.log(`Server running at ${serverUrl}`);
});
