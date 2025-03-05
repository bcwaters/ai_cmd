import fs from 'fs/promises';
import { join } from 'path';
import OpenAI from 'openai';
import dotenv from 'dotenv';
import { marked } from 'marked';
import { JSDOM } from 'jsdom';
import createDOMPurify from 'dompurify';
import { minimizeTokens } from '../../../grok/utils/utils.js';

// Import the real terminal module
import terminal from '../../../grok/utils/terminal.js';
import UserPromptRequest from '../../../grok/utils/UserPromptRequest.js';

// Mock external dependencies but NOT terminal
jest.mock('fs/promises');
jest.mock('path');
jest.mock('os');
jest.mock('child_process');
jest.mock('openai');
jest.mock('dotenv');
jest.mock('marked');
jest.mock('jsdom');
jest.mock('dompurify');
jest.mock('../../../grok/prompt_profiles/default.js');
jest.mock('../../../grok/prompt_profiles/TreeMode.js');
// Do NOT mock terminal or UserPromptRequest
// jest.mock('../../../grok/utils/terminal.js');
// jest.mock('../../../grok/utils/UserPromptRequest.js');

// Import the functions to test after mocking dependencies
import {
  parseCommandLineArgs,
  getConversationContext,
  createApiRequest,
  parseCompletionForResponseAndMetaResponse,
  htmlReplaceTemplateValues,
  saveHtmlResponse,
  saveMarkdownResponse,
  preprocessResponse,
  appendToContext,
  savePreviousId,
  saveCompletion,
  main
} from '../../../grok/grok.js';

describe('grok.js', () => {
  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
    
    // Enable terminal logging for tests
    terminal.debugLogger = true;
  });

  test('parseCommandLineArgs should parse command line arguments correctly', () => {
    // Mock process.argv
    process.argv = ['node', 'grok.js', '--depth', '1000', 'PROMPT', 'test prompt'];
    
    const result = parseCommandLineArgs();
    
    // Log the result using the real terminal
    terminal.log('Test result:', result);
    
    expect(result.userPrompt).toBe('test prompt');
    expect(result.depth).toBe('1000');
  });

  test('getConversationContext should return context data', async () => {
    // Mock fs.readFile to return test data
    fs.readFile.mockResolvedValue(JSON.stringify({
      choices: [{ message: { content: "test context" } }]
    }));
    
    // No need to mock minimizeTokens since we're using the real implementation
    
    const result = await getConversationContext('', false);
    
    // Since we're using the real minimizeTokens function, we need to match its actual behavior
    expect(result).toBe(minimizeTokens('test context'));
    expect(fs.readFile).toHaveBeenCalled();
  });

  // Add more tests for other functions as needed
}); 