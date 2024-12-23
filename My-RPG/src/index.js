#!/usr/bin/env node

import chalk from 'chalk';
import readline from 'readline';
import figlet from 'figlet';
import { GameEngine } from './game-engine/index.js';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const game = new GameEngine();

console.log(chalk.green(figlet.textSync('RPG CLI Game', { horizontalLayout: 'full' })));

console.log(chalk.green("Welcome to the RPG CLI Game!"));
console.log(chalk.blue("Let's start by entering your name."));

// Async function to get the player's name
async function getPlayerName() {
  return new Promise((resolve) => {
    rl.question(chalk.yellow("Enter your name: "), (name) => {
      resolve(name.trim());
    });
  });
}

// Async function to handle commands
async function handleCommand() {
  while (true) {
    process.stdout.write('> ');
    const command = await new Promise((resolve) => {
      rl.once('line', (input) => resolve(input.trim()));
    });

    try {
      const output = await game.handleCommand(command); // Await command execution
      if (typeof output === "string") {
        console.log(output);
      }

      if (game.isGameOver()) {
        console.log(chalk.red("Game Over! Thanks for playing."));
        rl.close();
        break;
      }
    } catch (error) {
      console.error(chalk.red("An error occurred while processing the command."), error);
    }
  }
}

// Main game logic
async function startGame() {
  const name = await getPlayerName();

  const welcomeMessage = game.setName(name);
  if (!game.player.name) {
    console.log(chalk.red("Name cannot be empty. Restart the game to try again."));
    rl.close();
    return;
  }

  console.log(chalk.cyan(welcomeMessage));
  console.log(chalk.green("Type 'help' to see the list of commands."));

  await handleCommand();
}

startGame().catch((error) => {
  console.error(chalk.red("An unexpected error occurred."), error);
  rl.close();
});

