import * as fs from 'fs';
import promptSync from 'prompt-sync'; // Import prompt-sync for user input

const prompt = promptSync(); // Initialize prompt-sync

const readWordsFile = (filePath: string): string[] => {
  const file = fs.readFileSync(filePath, 'utf-8');
  return file.split('\n').map(line => line.trim().toUpperCase());
};

export const formatGuess = (word: string, guess: string, matchedChars: Set<string>): string => {
  if (!matchedChars) {
    throw new Error('Invalid matchedChars');
  }
  let outputString = '';
  for (let i = 0; i < guess.length; i++) {
    if (word.includes(guess[i]) && (i > word.length || guess[i] !== word[i])) {
      outputString += 'Y';
    } else if (i < word.length && guess[i] === word[i]) {
      outputString += 'G';
      matchedChars.add(guess[i]);
    } else {
      outputString += 'B';
    }
  }
  return outputString;
};

export const handler = (totalRounds: number = 2, wordsFilePath: string = './words.txt') => {
  const words = readWordsFile(wordsFilePath);
  let roundCounter = 0;

  const handleExit = () => {
    console.log(`\nYou've played ${roundCounter} rounds! Goodbye!`);
    process.exit();
  };

  process.on('SIGINT', handleExit);

  while (roundCounter < totalRounds) {
    console.log('New Game Started!');
    // Output a random word from the list
    const randomWord = words[Math.floor(Math.random() * words.length)];
    console.log('Random word has been selected');

    // Guess from the user
    let userCorrect = false;
    while (!userCorrect) {
      let matchedChars = new Set<string>();
      const promptResponse = prompt('Enter your guess: ');
      if (promptResponse === null) {
        console.log('You pressed Ctrl+C. Exiting...');
        process.exit();
      } else if (!promptResponse.trim()) {
        console.log('Empty guess');
        continue;
      }
      const userGuess = promptResponse.toUpperCase();
      if (userGuess === randomWord) {
        console.log('You guessed correctly! You won!');
        roundCounter++;
        userCorrect = true; // Exit the current round
      } else {
        const formattedGuess = formatGuess(randomWord, userGuess, matchedChars);
        console.log(formattedGuess); // Output feedback to user
      }
    };
  };

  handleExit();
};