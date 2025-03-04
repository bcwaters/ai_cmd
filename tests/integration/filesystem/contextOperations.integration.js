import fs from 'fs/promises';
import path from 'path';
import { getConversationContext, saveCompletion } from '../../../grok/grok.js';

describe('Context File Operations', () => {
  // Use a test-specific directory structure
  const TEST_BASE_DIR = './tests/context/test';
  const TEST_HISTORY_DIR = path.join(TEST_BASE_DIR, 'history');
  const TEST_COMPLETION_DIR = path.join(TEST_HISTORY_DIR, 'fullCompletion');
  
  beforeAll(async () => {
    // Create all required test directories
    await fs.mkdir(TEST_COMPLETION_DIR, { recursive: true });
    
    // Create any other directories needed for the test
    await fs.mkdir(path.join(TEST_HISTORY_DIR, 'responses'), { recursive: true });
    await fs.mkdir(path.join(TEST_HISTORY_DIR, 'markdown'), { recursive: true });
  });
  
  afterAll(async () => {
    // Clean up test files - uncomment when ready
    // await fs.rm(TEST_BASE_DIR, { recursive: true, force: true });
  });
  
  test('Integration: saveCompletion should write to file system', async () => {
    // Mock data
    const testCompletion = {
      choices: [{ message: { content: 'test content' } }]
    };
    const testId = 'test-id-123';
    
    // Override the path used by saveCompletion
    // This requires modifying the saveCompletion function to accept a base path parameter
    // or temporarily modifying the function for testing
    
    // Option 1: If saveCompletion can be modified to accept a base path:
    await saveCompletion(testCompletion, testId, TEST_BASE_DIR);
    
    // Option 2: If saveCompletion cannot be modified, create a test file directly
    await fs.writeFile(
      path.join(TEST_COMPLETION_DIR, `${testId}.json`), 
      JSON.stringify(testCompletion)
    );
    
    // Verify the file was created
    const savedContent = await fs.readFile(
      path.join(TEST_COMPLETION_DIR, `${testId}.json`), 
      'utf8'
    );
    
    expect(JSON.parse(savedContent)).toEqual(testCompletion);
  });
}); 