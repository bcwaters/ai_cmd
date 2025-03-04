import terminal from '../../../grok/utils/terminal.js';

describe('Terminal Utility', () => {
  // Save original console methods
  const originalLog = console.log;
  const originalError = console.error;
  const originalWarn = console.warn;
  
  // Mock console methods
  beforeEach(() => {
    console.log = jest.fn();
    console.error = jest.fn();
    console.warn = jest.fn();
  });
  
  // Restore original console methods
  afterEach(() => {
    console.log = originalLog;
    console.error = originalError;
    console.warn = originalWarn;
  });
  
  test('log should call console.log with the provided arguments', () => {
    terminal.log('test message');
    expect(console.log).toHaveBeenCalledWith('test message');
  });
  
  test('error should call console.error with the provided arguments', () => {
    terminal.error('test error');
    expect(console.error).toHaveBeenCalledWith('test error');
  });
  
  test('warn should call console.warn with the provided arguments', () => {
    terminal.warn('test warning');
    expect(console.warn).toHaveBeenCalledWith('test warning');
  });
  
  test('debug should call console.log when debugLogger is true', () => {
    terminal.debugLogger = true;
    terminal.debug('test debug message');
    expect(console.log).toHaveBeenCalledWith('test debug message');
  });
  
  test('debug should not call console.log when debugLogger is false', () => {
    terminal.debugLogger = false;
    terminal.debug('test debug message');
    expect(console.log).not.toHaveBeenCalled();
  });
  
  test('getDividerWithMessage should return a string with the message surrounded by divider characters', () => {
    const result = terminal.getDividerWithMessage('TEST');
    expect(result).toContain('TEST');
    expect(result.length).toBeGreaterThan('TEST'.length);
  });
}); 