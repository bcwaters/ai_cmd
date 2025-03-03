export default {
  transform: {
    "^.+\\.jsx?$": "babel-jest"
  },
  testEnvironment: "node",
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1"
  },
  // Configure different test environments
  projects: [
    {
      displayName: 'unit',
      testMatch: ['<rootDir>/tests/unit/**/*.test.js'],
      // Unit tests should mock most dependencies
      setupFiles: ['<rootDir>/tests/helpers/setupUnitTests.js']
    },
    {
      displayName: 'integration',
      testMatch: ['<rootDir>/tests/integration/**/*.integration.js'],
      // Integration tests might use fewer mocks
      setupFiles: ['<rootDir>/tests/helpers/setupIntegrationTests.js']
    }
  ]
}; 