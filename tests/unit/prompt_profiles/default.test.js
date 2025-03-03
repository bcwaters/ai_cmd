// Import the necessary modules
import { PromptProfile } from '../../../grok/prompt_profiles/default.js';

describe('PromptProfile', () => {
  beforeEach(() => {
    // Reset static properties before each test
    PromptProfile.specialty = ' ';
    PromptProfile.files = [];
  });

  test('setSpecialty should set the specialty correctly', () => {
    PromptProfile.setSpecialty('software');
    expect(PromptProfile.specialty).toBe('write software. It should be clean, modern, and follow best practices.  inline comments for what each line of code does.');
    
    PromptProfile.setSpecialty('teaching');
    expect(PromptProfile.specialty).toBe(' develop a lesson plan. I am a teacher and want to collaborate.');
    
    PromptProfile.setSpecialty('writing');
    expect(PromptProfile.specialty).toBe(' write elegantly. creativity is key.');
    
    PromptProfile.setSpecialty('custom specialty');
    expect(PromptProfile.specialty).toBe('to docustom specialty');
  });

  test('getDefaultProfile should return the correct profile structure', () => {
    const profile = PromptProfile.getDefaultProfile(true, 'test message', 'test context', 'test prompt');
    
    expect(profile).toBeInstanceOf(Array);
    expect(profile.length).toBe(4);
    expect(profile[0].role).toBe('system');
    expect(profile[3].role).toBe('user');
    expect(profile[3].content[0].text).toBe('test prompt');
  });

  test('getDefaultProfile should include file content when files are added', () => {
    PromptProfile.addFile('test file content');
    
    const profile = PromptProfile.getDefaultProfile(true, 'test message', 'test context', 'test prompt');
    
    expect(profile.length).toBe(5);
    expect(profile[4].role).toBe('system');
    expect(profile[4].content[0].text).toBe('test file content');
  });

  test('addFile should add file content to the files array', () => {
    PromptProfile.addFile('test file content');
    
    expect(PromptProfile.files).toEqual(['test file content']);
  });
}); 