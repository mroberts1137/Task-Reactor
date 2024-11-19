const features = {
  development: {
    enableNewFeature: true,
    debugMode: true
  },
  staging: {
    enableNewFeature: true,
    debugMode: true
  },
  production: {
    enableNewFeature: false,
    debugMode: false
  }
};

const getFeatures = () => features[process.env.NODE_ENV || 'development'];
