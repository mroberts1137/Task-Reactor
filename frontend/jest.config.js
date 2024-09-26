module.exports = {
  // transform: {
  //   '^.+\\.tsx?$': 'ts-jest',
  // },
  preset: 'ts-jest',
  testEnvironment: 'node',
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'ts-jest'
  },
  transformIgnorePatterns: [
    '/node_modules/',
    '/dist/',
    '/node_modules/(?!(axios)/)'
  ],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  setupFiles: ['jest-localstorage-mock']
};
