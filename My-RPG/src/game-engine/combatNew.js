import inquirer from 'inquirer';
import chalk from 'chalk';
import readline from "readline";
import keypress from "keypress";
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: true,
});
let timer;
let combatInProgress = true;
let inputLength = 0;
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const drawProgressBar = (totalTime, timeLeft, stringToType) => {
    const barLength = 20; // Length of the progress bar
    const filledLength = Math.floor((timeLeft / totalTime) * barLength);
    const emptyLength = barLength - filledLength;
    let bar;

    if (timeLeft < totalTime / 3) {
        bar = chalk.red("█".repeat(filledLength) + "-".repeat(emptyLength));
    } else if (timeLeft < (2 * totalTime) / 3) {
        bar = chalk.yellow("█".repeat(filledLength) + "-".repeat(emptyLength));
    } else {
        bar = chalk.green("█".repeat(filledLength) + "-".repeat(emptyLength));
    }

    readline.moveCursor(process.stdout, 0, -1); // Move up to the progress bar line
    readline.clearLine(process.stdout, 0); // Clear the line
    readline.cursorTo(process.stdout, 0); // Reset cursor to the start of the line
    process.stdout.write(`${chalk.yellow("Time left:")} [${bar}] ${timeLeft}s`); // Print the progress bar
    readline.clearLine(process.stdout, 1); // Clear the remaining part of the line
    process.stdout.write("\n");

    // Adjust cursor position based on length of stringToType and typed input length
    
};

const combat = async (player, enemy) => {
    console.log(chalk.red(`\n🚨 You are attacked by a ${enemy.name}! 🚨`));
    console.log(chalk.blue(`\nYour HP: ${chalk.green(player.hp)} | Enemy HP: ${chalk.red(enemy.hp)}\n`));

    const promptWithTimeout = async (stringToType, timeout = 6000) => {
        return new Promise((resolve) => {
            let timeLeft = Math.floor(timeout / 1000);
            const totalTime = timeLeft;
    
            console.log(); // Add an empty line for the progress bar
            drawProgressBar(totalTime, timeLeft, stringToType); // Draw the initial progress bar
    
            const progressBarInterval = setInterval(() => {
                timeLeft -= 1;
                if (timeLeft >= 0) {
                    drawProgressBar(totalTime, timeLeft, stringToType);
                    readline.cursorTo(process.stdout, stringToType.length + 35 + inputLength);
                }
            }, 1000);
    
            const timeoutHandle = setTimeout(() => {
                cleanup();
                resolve(false);
            }, timeout);
    
            const keypressHandler = () => {
                inputLength = rl.line ? rl.line.length : 0; // Update input length
            };
    
            const cleanup = () => {
                clearTimeout(timeoutHandle);
                clearInterval(progressBarInterval);
                process.stdin.removeListener('keypress', keypressHandler);
                process.stdin.setRawMode(false);
                process.stdin.pause();
            };
    
            // Start listening for keypress
            process.stdin.setRawMode(true);
            process.stdin.resume();
            process.stdin.on('keypress', keypressHandler);
    
            // Prompt for input
            inquirer
                .prompt([
                    {
                        type: 'input',
                        name: 'typedString',
                        message: `Type this string within ${timeout / 1000} seconds: ${chalk.yellow(stringToType)}`,
                    },
                ])
                .then((answers) => {
                    cleanup();
                    resolve(answers.typedString === stringToType); // Check input
                })
                .catch(() => {
                    cleanup();
                    resolve(false);
                });
        });
    };
    

    while (player.hp > 0 && enemy.hp > 0) {

        try {
            const answers = await inquirer.prompt([{
                type: 'list',
                name: 'action',
                message: 'What will you do?',
                choices: ['Attack', 'Defend', 'Run'],
            }]);

            if (answers.action === 'Attack') {

                while(player.hp > 0 && enemy.hp > 0){

                    console.log(chalk.blue(`\nYour HP: ${chalk.green(player.hp)} | Enemy HP: ${chalk.red(enemy.hp)}\n`));

                    const stringToType = Math.random().toString(36).substring(2, 8); // Generate random string
                    console.log(chalk.cyan(`\nPrepare to attack!`));
    
                    // Trigger the prompt for typing the string with a timeout
                    const success = await promptWithTimeout(stringToType);
    
                    if (success) {
    
                        const damage = Math.floor(Math.random() * player.attack) + 5;
                        enemy.hp -= damage;
                        console.log(chalk.green(`\nYou dealt ${damage} damage to ${enemy.name}!`));
    
                        if (enemy.hp <= 0) {
                            console.log(chalk.green(`\n🎉 You defeated the ${enemy.name}!`));
                            return true; // Victory
                        }
    
                        console.log(chalk.blue(`\nYour HP: ${chalk.green(player.hp)} | Enemy HP: ${chalk.red(enemy.hp)}\n`));
    
                        continue;
    
                    } else {

                        console.log(chalk.red(`\nYou failed to attack in time! The enemy takes its chance to attack!`));
                        
                        const enemyDamage = Math.floor(Math.random() * enemy.attack) + 5;
                        player.hp -= enemyDamage;
                        console.log(chalk.red(`\n${enemy.name} attacked you for ${enemyDamage} damage!`));

                    }

                }

                
            } else if (answers.action === 'Defend') {
                console.log(chalk.blue(`\nYou brace yourself, reducing incoming damage.`));
            } else if (answers.action === 'Run') {
                console.log(chalk.magenta(`\nYou ran away!`));
                return null; // Escape
            }

            await sleep(1500); // Small delay to simulate pause before the enemy attack

            // Enemy's turn
            const enemyDamage = Math.floor(Math.random() * enemy.attack) + 5;
            if (answers.action === 'Defend') {
                player.hp -= Math.max(0, enemyDamage - 10);
                console.log(chalk.red(`\n${enemy.name} attacked you for ${Math.max(0, enemyDamage - 10)} damage!`));
            }
            if (player.hp <= 0) {
                console.log(chalk.red(`\nYou were defeated by the ${enemy.name}! 💀`));
                return false; // Defeat
            }

            console.log(chalk.blue(`\nYour HP: ${chalk.green(player.hp)} | Enemy HP: ${chalk.red(enemy.hp)}\n`));

        } catch (err) {
            console.log(chalk.red(`\nAn error occurred during the combat: ${err.message}`));
            return false; // Fail-safe for unexpected issues
        }
    }
};

export default combat;
