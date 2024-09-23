import * as fs from 'fs';
import promptSync from 'prompt-sync'; // Import prompt-sync for user input

const prompt = promptSync(); // Initialize prompt-sync

const readWordsFile = (filePath: string): string[] => {
  if (!fs.existsSync(filePath)) {
    console.error(`File not found: ${filePath}`);
    process.exit(1);
  }
  const file = fs.readFileSync(filePath, 'utf-8');
  const words = file.split('\n').map(line => line.trim().toUpperCase());
  if (words.length < 2) {
    console.error(`The words file must contain at least 2 words.`);
    process.exit(1);
  }
  return words;
};

export const formatGuess = (word: string, guess: string, matchedChars: Set<string>): string => {
  if (!matchedChars) {
    throw new Error('Invalid matchedChars');
  }
  let outputString = '';
  for (let i = 0; i < guess.length; i++) {
    if (word.includes(guess[i]) && (i >= word.length || guess[i] !== word[i])) {
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

export const handler = (totalGuesses: number = 6, wordsFilePath: string = './words.txt') => {
  const words = readWordsFile(wordsFilePath);
  let roundCounter = 0;
  let previousWord = '';

  const handleExit = (roundsPlayed: number = 0, wins: number = 0, losses: number = 0) => {
    console.log(`You have won ${wins} rounds and lost ${losses} rounds!`);
    process.exit();
  };

  process.on('SIGINT', () => handleExit(roundCounter, wins, losses));

  let losses = 0;
  let wins = 0;

  while (true) {
    let guessCount = totalGuesses;
    if (guessCount > 0) {
      console.log(`New Game Started! Round ${roundCounter}, Allowed Guesses: ${guessCount}`);
    } else {
      console.log(`New Game Started! Round ${roundCounter}, Unlimited Guesses!`);
    }

    // Output a random word from the list
    let randomWord;
    do {
      randomWord = words[Math.floor(Math.random() * words.length)];
    } while (randomWord === previousWord);
    previousWord = randomWord;
    console.log('New random word has been selected');

    // Guess from the user
    let userCorrect = false;
    while (!userCorrect && (guessCount > 0 || totalGuesses <= 0)) {
      let matchedChars = new Set<string>();
      const promptResponse = prompt('Enter your guess: ');
      if (promptResponse === null) {
        console.log('You pressed Ctrl+C. Exiting...');
        handleExit(roundCounter, wins, losses);
      } else if (!promptResponse.trim()) {
        if (totalGuesses > 0) {
          console.log(`> Remaining Guesses: ${guessCount}`);
        }
        continue;
      }
      const userGuess = promptResponse.toUpperCase();
      if (totalGuesses > 0) {
        guessCount--;
      }
      if (userGuess === randomWord) {
        console.log('You guessed correctly! You won!');
        userCorrect = true; // Exit the current round
        wins++;
      } else {
        const formattedGuess = formatGuess(randomWord, userGuess, matchedChars);
        console.log(formattedGuess); // Output feedback to user
        if (totalGuesses > 0) {
          console.log(`> Remaining Guesses: ${guessCount}`);
        }
      }
      if (guessCount === 0 && !userCorrect && totalGuesses > 0) {
        console.log(`You lost! The word was ${randomWord}`);
        losses++;
      }
    }
    roundCounter++;
  }
};