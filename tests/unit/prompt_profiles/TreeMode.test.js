// Import the necessary modules
import { TreeModeProfile } from '../../../grok/prompt_profiles/TreeMode.js';

describe('TreeModeProfile', () => {
  beforeEach(() => {
    // Reset static properties before each test
    TreeModeProfile.ParentId = '';
    TreeModeProfile.ParentReadme = '';
    TreeModeProfile.subjectList = [];
    TreeModeProfile.childReadme = [];
    TreeModeProfile.specialty = ' ';
  });

  test('setSpecialty should set the specialty correctly', () => {
    TreeModeProfile.setSpecialty('software');
    expect(TreeModeProfile.specialty).toBe('write software. It should be clean, modern, and follow best practices.  inline comments for what each line of code does.');
    
    TreeModeProfile.setSpecialty('teaching');
    expect(TreeModeProfile.specialty).toBe(' develop a lesson plan. I am a teacher and want to collaborate.');
    
    TreeModeProfile.setSpecialty('writing');
    expect(TreeModeProfile.specialty).toBe(' write elegantly. creativity is key.');
    
    TreeModeProfile.setSpecialty('custom specialty');
    expect(TreeModeProfile.specialty).toBe('to docustom specialty');
  });

  test('getDefaultProfile should return the correct profile structure', () => {
    const profile = TreeModeProfile.getDefaultProfile(true, 'test message', 'test context', 'test prompt');
    
    expect(profile).toBeInstanceOf(Array);
    expect(profile.length).toBe(4);
    expect(profile[0].role).toBe('system');
    expect(profile[3].role).toBe('user');
    expect(profile[3].content[0].text).toBe('test prompt');
  });

  test('getBranchProfile should return the correct profile structure', () => {
    TreeModeProfile.ParentReadme = 'test parent readme';
    
    const profile = TreeModeProfile.getBranchProfile(true, 'test message', 'test context', 'test prompt');
    
    expect(profile).toBeInstanceOf(Array);
    expect(profile.length).toBe(5);
    expect(profile[0].role).toBe('system');
    expect(profile[4].role).toBe('user');
    expect(profile[4].content[0].text).toBe('test prompt');
  });

  test('parseSubject should parse subject list correctly', () => {
    const result = TreeModeProfile.parseSubject('["subject1","subject2","subject3"]');
    
    expect(result).toEqual(['subject1', 'subject2', 'subject3']);
    expect(TreeModeProfile.subjectList).toEqual(['subject1', 'subject2', 'subject3']);
  });

  test('addChildReadme should add child readme to the beginning of the array', () => {
    TreeModeProfile.addChildReadme('test readme 1');
    TreeModeProfile.addChildReadme('test readme 2');
    
    expect(TreeModeProfile.childReadme).toEqual(['test readme 2', 'test readme 1']);
  });

  test('setParentId should set the parent ID correctly', () => {
    TreeModeProfile.setParentId('test-id');
    
    expect(TreeModeProfile.ParentId).toBe('test-id');
  });

  test('setParentReadme should set the parent readme correctly', () => {
    TreeModeProfile.setParentReadme('test readme');
    
    expect(TreeModeProfile.ParentReadme).toBe('test readme');
  });
}); 