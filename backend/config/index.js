const dotenv = require('dotenv');
dotenv.config();

const isProduction = process.env.NODE_ENV === 'production';

const domain =
  process.env.NODE_ENV === 'production'
    ? 'task-reactor.onrender.com'
    : 'localhost';

const environments = {
  development: {
    // MONGODB_URI: 'mongodb://localhost:27017/task-reactor_dev',
    MONGODB_URI: process.env.PROD_MONGODB_URI,
    CLIENT_URL: 'http://localhost:3000',
    API_URL: 'http://localhost:5000'
  },
  staging: {
    MONGODB_URI: process.env.STAGING_MONGODB_URI,
    CLIENT_URL: 'https://staging.myapp.com',
    API_URL: 'https://api-staging.myapp.com'
  },
  production: {
    MONGODB_URI: process.env.PROD_MONGODB_URI,
    CLIENT_URL: process.env.CLIENT_URL,
    API_URL: process.env.API_URL
  }
};

const config = environments[process.env.NODE_ENV || 'development'];

module.exports = {
  jwt_options: {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'strict',
    expires: new Date(Date.now() + 1000 * 86400),
    domain: domain
  },
  config,
  isProduction,
  domain
};
