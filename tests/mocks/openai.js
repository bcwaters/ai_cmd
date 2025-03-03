// Mock implementation for OpenAI
export default {
  chat: {
    completions: {
      create: jest.fn()
    }
  }
}; 