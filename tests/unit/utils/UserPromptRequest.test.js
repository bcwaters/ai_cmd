import UserPromptRequest from '../../../grok/utils/UserPromptRequest.js';
import fs from 'fs/promises';

// Mock fs/promises
jest.mock('fs/promises');

describe('UserPromptRequest', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  test('constructor should initialize properties correctly', () => {
    const request = new UserPromptRequest(
      'test prompt',    //user prompt
      true,            //isShort
      true,            //isNew
      'test context',  //context
      1000,            //depth
      'test/file/path', //filePath
      'software',      //specialty
      true,            //treeMode
      false            //browserMode
    );
    
    expect(request.userPrompt).toBe('test prompt');
    expect(request.isShort).toBe(true);
    expect(request.isNew).toBe(true);
    expect(request.context).toBe('test context');
    expect(request.depth).toBe(1000);
    expect(request.filePath).toBe('test/file/path');
    expect(request.specialty).toBe('software');
    expect(request.treeMode).toBe(true);
    expect(request.browserMode).toBe(false);
  });
  
  test('dynamicPrompt getter and setter should work correctly', () => {
    const request = new UserPromptRequest('test prompt');
    
    expect(request.dynamicPrompt).toBe('test prompt');
    
    request.dynamicPrompt = 'new prompt';
    expect(request.dynamicPrompt).toBe('new prompt');
  });
  
  test('dynamicResponseId getter and setter should work correctly', () => {
    const request = new UserPromptRequest('test prompt');
    
    // Initially should be empty
    expect(request.dynamicResponseId).toBe('');
    
    request.dynamicResponseId = 'test-id';
    expect(request.dynamicResponseId).toBe('test-id');
  });
  
  test('fileContent should read file content when filePath is provided', async () => {
    const request = new UserPromptRequest('test prompt', false, false, '', 500, 'test/file.txt');
    
    fs.readFile.mockResolvedValue('file content');
    
    const content = await request.fileContent();
    
    expect(fs.readFile).toHaveBeenCalledWith('test/file.txt', 'utf8');
    expect(content).toBe('file content');
  });
  
  test('fileContent should return empty string when filePath is not provided', async () => {
    const request = new UserPromptRequest('test prompt');
    
    const content = await request.fileContent();
    
    expect(fs.readFile).not.toHaveBeenCalled();
    expect(content).toBe('');
  });
  
  test('toString should return a JSON string representation', () => {
    const request = new UserPromptRequest('test prompt');
    
    const result = request.toString();
    
    expect(typeof result).toBe('string');
    expect(JSON.parse(result)).toHaveProperty('userPrompt', 'test prompt');
  });
}); 