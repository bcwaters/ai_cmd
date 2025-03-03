// Helper functions for tests

/**
 * Creates a mock response object similar to what OpenAI API returns
 * @param {string} content - The content to include in the response
 * @returns {Object} A mock OpenAI response object
 */
export function createMockCompletion(content) {
  return {
    choices: [
      {
        message: {
          content
        }
      }
    ]
  };
}

/**
 * Sets up common mocks used across multiple tests
 */
export function setupCommonMocks() {
  // Reset all mocks
  jest.clearAllMocks();
  
  // Add any common mock setup here
} 