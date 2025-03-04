// This file runs before unit tests
// Set up global mocks for unit tests

// Mock all external dependencies by default for unit tests
jest.mock('fs/promises');
jest.mock('path');
jest.mock('os');
jest.mock('child_process');
jest.mock('openai');
jest.mock('dotenv');
jest.mock('marked');
jest.mock('jsdom');
jest.mock('dompurify');

// Do NOT mock these modules
// jest.unmock('../grok/utils/terminal.js');
// jest.unmock('../grok/utils/UserPromptRequest.js'); 