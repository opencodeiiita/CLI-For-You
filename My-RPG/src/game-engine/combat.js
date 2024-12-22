import inquirer from 'inquirer';
import chalk from 'chalk';

async function combat(player, enemy) {
    console.log(chalk.red(`\n🚨 You are attacked by a ${enemy.name}! 🚨`));
    console.log(chalk.blue(`\nYour HP: ${chalk.green(player.hp)} | Enemy HP: ${chalk.red(enemy.hp)}\n`));

    while (player.hp > 0 && enemy.hp > 0) {
        const answers = await inquirer.prompt([
            {
                type: 'list',
                name: 'action',
                message: 'What will you do?',
                choices: ['Attack', 'Defend', 'Run'],
            },
        ]);

        if (answers.action === 'Attack') {
            const damage = Math.floor(Math.random() * player.attack) + 5;
            enemy.hp -= damage;
            console.log(chalk.green(`\nYou dealt ${damage} damage to ${enemy.name}!`));

            if (enemy.hp <= 0) {
                console.log(chalk.green(`\n🎉 You defeated the ${enemy.name}!`));
                return true; // Victory
            }
        } else if (answers.action === 'Defend') {
            console.log(chalk.blue(`\nYou brace yourself, reducing incoming damage.`));
        } else if (answers.action === 'Run') {
            console.log(chalk.magenta(`\nYou ran away!`));
            return null; // Escape
        }

        // Enemy's turn
        const enemyDamage = Math.floor(Math.random() * enemy.attack) + 5;
        if (answers.action === 'Defend') {
            player.hp -= Math.max(0, enemyDamage - 10);
            console.log(chalk.red(`\n${enemy.name} attacked you for ${Math.max(0, enemyDamage - 10)} damage!`));
        } else {
            player.hp -= enemyDamage;
            console.log(chalk.red(`\n${enemy.name} attacked you for ${enemyDamage} damage!`));
        }

        if (player.hp <= 0) {
            console.log(chalk.red(`\nYou were defeated by the ${enemy.name}! 💀`));
            return false; // Defeat
        }

        console.log(chalk.blue(`\nYour HP: ${chalk.green(player.hp)} | Enemy HP: ${chalk.red(enemy.hp)}\n`));
    }
}

export default combat;
