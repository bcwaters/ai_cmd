// This file runs before integration tests
// Set up partial mocks for integration tests

// For integration tests, we might want to mock fewer dependencies
// or provide more realistic mock implementations
jest.mock('openai'); // Still mock external APIs
// Don't mock fs/promises for filesystem integration tests 