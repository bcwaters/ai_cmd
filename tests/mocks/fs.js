// Mock implementation for fs/promises
export default {
  readFile: jest.fn(),
  writeFile: jest.fn(),
  mkdir: jest.fn(),
  copyFile: jest.fn()
}; 