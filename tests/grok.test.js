// Import the necessary modules
import fs from 'fs/promises';
import { join } from 'path';
import OpenAI from 'openai';
import dotenv from 'dotenv';
import { marked } from 'marked';
import { JSDOM } from 'jsdom';
import createDOMPurify from 'dompurify';
import { cleanString } from '../grok/utils/utils.js';
// Mock all external dependencies
jest.mock('fs/promises');
jest.mock('path');
jest.mock('os');
jest.mock('child_process');
jest.mock('openai');
jest.mock('dotenv');
jest.mock('marked');
jest.mock('jsdom');
jest.mock('dompurify');
jest.mock('../grok/prompt_profiles/default.js');
jest.mock('../grok/prompt_profiles/TreeMode.js');
jest.mock('../grok/utils/UserPromptRequest.js');
jest.mock('../grok/utils/terminal.js');

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
} from '../grok/grok.js';

describe('grok.js', () => {
  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
  });

  test('parseCommandLineArgs should parse command line arguments correctly', () => {
    // Mock process.argv
    process.argv = ['node', 'grok.js', '--depth', '1000', 'test prompt'];
    
    const result = parseCommandLineArgs();
    
    expect(result.userPrompt).toBe('test prompt');
    expect(result.depth).toBe('1000');
  });

  test('getConversationContext should return context data', async () => {
    // Mock fs.readFile to return test data
    fs.readFile.mockResolvedValue(JSON.stringify({
      choices: [{ message: { content: "test context" } }]
    }));
    
    // No need to mock cleanString since we're using the real implementation
    
    const result = await getConversationContext('', false);
    
    // Since we're using the real cleanString function, we need to match its actual behavior
    // You might need to adjust this expectation based on what cleanString actually does
    expect(result).toBe(cleanString('test context'));
    expect(fs.readFile).toHaveBeenCalled();
  });

  // Add more tests for other functions
}); 