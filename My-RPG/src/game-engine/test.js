import chalk from 'chalk';
import figlet from 'figlet';
import cliProgress from 'cli-progress';
import ora from 'ora';
import inquirer from 'inquirer';
import combat from './combatNew.js';
import art from './art.js';

const player = {
    name: 'Traveler',
    hp: 100,
    attack: 25,
};

const enemy1 = {
    name: 'Syndicate Soldier',
    hp: 50,
    attack: 15,
};

const combatResult1 = await combat(player, enemy1);

if (!combatResult1) {
    console.log(chalk.red("\n💀 The Syndicate has claimed victory. Your journey ends here."));
    process.exit(0);
}

console.log(chalk.green("\n🎉 You defeated the Syndicate Soldier and proceed forward."));