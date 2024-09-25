module.exports = {
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest'
  },
  transformIgnorePatterns: [
    '/node_modules/(?!(axios)/)' // allow jest to transform axios
  ],
  setupFiles: ['jest-localstorage-mock']
};
