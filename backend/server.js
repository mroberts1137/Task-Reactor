const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const rateLimit = require('express-rate-limit');

const auth = require('./routes/auth');
const users = require('./routes/users');
const tasks = require('./routes/tasks');
const dailyGoals = require('./routes/daily_goals');
const monthlyGoals = require('./routes/monthly_goals');
const { domain, config } = require('./config');

dotenv.config();

const app = express();
connectDB();

const PORT = 5000; //process.env.PORT || 5000;

console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('Domain:', domain);
console.log('CLIENT_URL:', config.CLIENT_URL);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300 // limit each IP's requests per windowMs
});

const corsOptions = {
  origin: config.CLIENT_URL,
  credentials: true,
  optionsSuccessStatus: 200
};

/**
 * Middleware
 */

if (
  process.env.NODE_ENV === 'staging' ||
  process.env.NODE_ENV === 'development' ||
  true
) {
  app.use((req, res, next) => {
    console.log('Request:', {
      path: req.path,
      method: req.method,
      origin: req.headers.origin,
      url: req.url,
      isHTTPS: req.secure
    });
    next();
  });
}

app.use(morgan('dev'));
app.use(limiter);
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

/**
 * Routes
 */
app.use('/api/auth', auth);
app.use('/api/users', users);
app.use('/api/users/:user_id/tasks', tasks);
app.use('/api/users/:user_id/daily_goals', dailyGoals);
app.use('/api/users/:user_id/monthly_goals', monthlyGoals);

app.listen(PORT, () => {
  console.log(`Server running at ${config.API_URL}`);
});
