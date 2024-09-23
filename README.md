Wordle TypeScript Game
======================

This is a simple wordle game written in TypeScript. It is a terminal based game, so it requires the user to have a terminal emulator installed.

How to play the game:
- In wordle a random word is selected from a list of words.
- The user guesses the word, and the game provides feedback on the guess.
  - If the letter is in the word and in the correct position, the game shows a G character.
  - If the letter is in the word but in the wrong position, the game shows a Y character.
  - If the letter is not in the word, the game shows a B character.
- The user has 6 guesses to guess the word.
- The game ends when the user guesses the word or when the user runs out of guesses.
- The game provides feedback on the guess and the user's score.

# Getting Started

Install the dependencies:

```
npm install .
```

To run the game, you can run the following command:

```
npm run start
```

To run the tests, you can run the following command:

```
npm run test
```
