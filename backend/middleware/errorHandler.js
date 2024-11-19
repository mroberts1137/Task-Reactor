const errorHandler = (err, req, res, next) => {
  const isDevelopment = process.env.NODE_ENV === 'development';
  const isStaging = process.env.NODE_ENV === 'staging';

  if (isDevelopment || isStaging) {
    res.status(err.status || 500).json({
      message: err.message,
      stack: err.stack,
      details: err
    });
  } else {
    // Production
    res.status(err.status || 500).json({
      message: 'An error occurred'
    });
  }
};

module.exports = errorHandler;
