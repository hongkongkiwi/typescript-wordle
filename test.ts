import { formatGuess } from './functions';

// Test cases
const testFormatGuess = () => {
  const word = 'APPLE';
  let matchedChars = new Set<string>();

  const testWords = [
    'APPLY', 'PLANE', 'LEMON'
  ];
  const testResults = [
    'GGGGB', 'YYYBG', 'YYBBB'
  ];

  for (let i = 0; i < testWords.length; i++) {
    const testWord = testWords[i];
    const expectedResult = testResults[i];
    const result = formatGuess(word, testWord, matchedChars);
    console.assert(result === expectedResult, `Expected ${expectedResult} but got ${result}`);
  }

  console.log('All test cases passed!');
};

testFormatGuess();
