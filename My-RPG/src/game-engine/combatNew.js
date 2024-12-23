import inquirer from 'inquirer';
import chalk from 'chalk';

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const combat = async (player, enemy) => {

    console.log(chalk.red(`\n🚨 You are attacked by a ${enemy.name}! 🚨`));
    console.log(chalk.blue(`\nYour HP: ${chalk.green(player.hp)} | Enemy HP: ${chalk.red(enemy.hp)}\n`));

    const promptWithTimeout = async (stringToType, timeout = 5000) => {

        return new Promise((resolve) => {
            let timeoutHandle = setTimeout(() => {
                process.stdin.emit('data', '\n'); // Programmatically simulate pressing Enter
            }, timeout);

            inquirer
                .prompt([{
                    type: 'input',
                    name: 'typedString',
                    message: `Type this string within ${timeout / 1000} seconds: ${chalk.yellow(stringToType)}`,
                }])
                .then((answers) => {
                    clearTimeout(timeoutHandle); // Cancel the timeout
                    resolve(answers.typedString === stringToType); // Compare input to required string
                })
                .catch(() => {
                    clearTimeout(timeoutHandle);
                    resolve(false); // Handle unexpected prompt closure
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
