jest.setTimeout(5000); // 5 second timeout

console.log('Starting utils.test.js file');

import { minimizeTokens } from '../../../grok/utils/utils.js';
console.log('Imported minimizeTokens function');

describe('minimizeTokens', () => {
  console.log('Starting minimizeTokens test suite');
  
  beforeAll(() => {
    console.log('Running beforeAll for minimizeTokens');
  });
  
  afterAll(() => {
    console.log('Running afterAll for minimizeTokens');
  });
  
  test('should remove special characters and normalize whitespace', () => {
    console.log('Running test: should remove special characters and normalize whitespace');
    const input = '  This is a @test# string with $special% characters!  ';
    const expected = 'thisisateststringwithspecialcharacters';
    expect(minimizeTokens(input)).toBe(expected);
    console.log('Completed test: should remove special characters and normalize whitespace');
  });

  test('should handle empty strings', () => {
    console.log('Running test: should handle empty strings');
    const input = '';
    const expected = '';
    expect(minimizeTokens(input)).toBe(expected);
    console.log('Completed test: should handle empty strings');
  });

  test('should handle strings with only special characters', () => {
    console.log('Running test: should handle strings with only special characters');
    const input = '@#$%^&*';
    const expected = '';
    expect(minimizeTokens(input)).toBe(expected);
    console.log('Completed test: should handle strings with only special characters');
  });

  test('should preserve alphanumeric characters and spaces', () => {
    console.log('Running test: should preserve alphanumeric characters and spaces');
    const input = 'Hello123 World456';
    const expected = 'hello123world456';
    expect(minimizeTokens(input)).toBe(expected);
    console.log('Completed test: should preserve alphanumeric characters and spaces');
  });
});

console.log('About to import removeWhiteSpaceAndEnsureAlphabet');
import { removeWhiteSpaceAndEnsureAlphabet } from '../../../grok/utils/utils.js';
console.log('Imported removeWhiteSpaceAndEnsureAlphabet function');

describe('removeWhiteSpaceAndEnsureAlphabet', () => {
  console.log('Starting removeWhiteSpaceAndEnsureAlphabet test suite');
  
  beforeAll(() => {
    console.log('Running beforeAll for removeWhiteSpaceAndEnsureAlphabet');
  });
  
  afterAll(() => {
    console.log('Running afterAll for removeWhiteSpaceAndEnsureAlphabet');
  });
  
  test('should remove whitespace and ensure only alphabetic characters', () => {
    console.log('Running test: should external remove whitespace and ensure only alphabetic-numeric characters');
    const input = '  Hello 123 World!  ';
    const expected = 'Hello 123 World';
    expect(removeWhiteSpaceAndEnsureAlphabet(input)).toBe(expected);
    console.log('Completed test: should remove whitespace and ensure only alphabetic characters');
  });

  test('should handle empty strings', () => {
    console.log('Running test: should handle empty strings');
    const input = '';
    const expected = '';
    expect(removeWhiteSpaceAndEnsureAlphabet(input)).toBe(expected);
    console.log('Completed test: should handle empty strings');
  });

  test('should handle strings with only non-alphabetic characters', () => {
    console.log('Running test: should handle strings with only non-alphabetic characters');
    const input = '123 !@#';
    const expected = '123 @#';
    expect(removeWhiteSpaceAndEnsureAlphabet(input)).toBe(expected);
    console.log('Completed test: should handle strings with only non-alphabetic characters');
  });

  test('should preserve case of alphabetic characters', () => {
    console.log('Running test: should preserve case of alphabetic characters');
    const input = 'Hello World';
    const expected = 'Hello World';
    expect(removeWhiteSpaceAndEnsureAlphabet(input)).toBe(expected);
    console.log('Completed test: should preserve case of alphabetic characters');
  });
});



console.log('Completed all tests in utils.test.js'); 