import chalk from 'chalk';
import figlet from 'figlet';
import cliProgress from 'cli-progress';
import ora from 'ora';
import inquirer from 'inquirer';
import combat from './combatNew.js';
import art from './art.js';
import musicPlayer from './musicPlayer.js';

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function displayStory() {
    const player = {
        name: 'Traveler',
        hp: 100,
        attack: 25,
    };

    await sleep(1000);
    musicPlayer.play('game-engine/music/warm-hug.mp3');

    const spinner = ora('Generating story ...').start();
    spinner.color = 'yellow';

    await sleep(1000);
    spinner.stopAndPersist({symbol: "✅"});
    spinner.start();

    spinner.color = 'yellow';
    spinner.text = 'Loading world ...';
    
    await sleep(1000);
    spinner.stopAndPersist({symbol: "✅"});
    spinner.start();

    spinner.color = 'red';
    spinner.text = 'Teleporting you ...';

    await sleep(1000);
    spinner.stopAndPersist({symbol: "✅"});

    const bar = new cliProgress.SingleBar({
        format: '{bar} {percentage}% | {value}/{total}',
        barCompleteChar: '\u2588',
        barIncompleteChar: '\u2591',
        hideCursor: true
    }, cliProgress.Presets.shades_classic);

    bar.start(100, 0);

    for(let i=0; i< 100; i++){
        bar.increment();
        await sleep(10);
    }
    await sleep(500);

    console.clear();

    console.log(chalk.green(figlet.textSync('The Awakening', { font: ""})));
    console.log(chalk.blue('=============================================================='));
    await sleep(500);

    const story = [
        {line: "You awaken in a mysterious land with no memory of how you got there."},
        {line: "The world around you is shrouded in fog, and whispers of ancient secrets fill the air.\n"},
        {line: "As you take your first steps, a faint voice echoes in your mind:\n\n"},
        {chalk: chalk.magenta.italic, line: "'The fate of this realm lies in your hands, traveler. Will you rise to the challenge or let darkness consume all?'\n"}
    ];

    for (let i = 0; i < story.length; i++) {
        for(let j=0; j< story[i].line.length; j++){
            let a = story[i].chalk ?? chalk.white.italic;
            process.stdout.write(a(story[i].line[j]));
            await sleep(75);
        }
        if(!story[i].line.endsWith('\n')) process.stdout.write(" ");
        await sleep(1000);//a pause after each sentence
    }

    musicPlayer.stop();
    await sleep(500);
    musicPlayer.play('game-engine/music/showdown.wav')

    console.log(chalk.blue('=============================================================='));
    console.log(chalk.cyan('Your journey begins now, traveler...'));


    console.log(chalk.blue('=============================================================='));

    // First mission: Journey to the Syndicate outpost
    console.log(chalk.cyan("\nYour journey begins with a mission: infiltrate a Syndicate outpost.\n"));
    await sleep(1500);

    console.log(chalk.yellow("You approach the outpost. A guard notices you, readying their weapon."));    
    await sleep(1500);
    console.log(chalk.yellow(art.syndicateSoldier));
    await sleep(1500);
    console.log(chalk.red("\nPrepare for combat!"));

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
    await sleep(1500);

    // Second mission: Confronting the traitor
    console.log(chalk.cyan("\nYou receive intelligence about a traitor among the Rebels, secretly aiding the Syndicate."));
    await sleep(1500);
    console.log(chalk.yellow(art.traitorousRebel));

    console.log(chalk.yellow("\nYou confront the traitor in a hidden location."));
    await sleep(1500);
    console.log(chalk.red("The Traitorous Rebel grins, drawing their weapon."));

    const enemy2 = {
        name: 'Traitorous Rebel',
        hp: 5,
        attack: 0,
    };

    const combatResult2 = await combat(player, enemy2);

    if (!combatResult2) {
        console.log(chalk.red("\n💀 Betrayed and defeated, your journey ends in tragedy."));
        process.exit(0);
    }

    console.log(chalk.green("\n🎉 You have exposed the traitor, restoring trust within the Rebels."));
    await sleep(1500);

    // The Twist: Meeting the Syndicate leader
    console.log(chalk.cyan("\nThe final part of your journey takes you to the Syndicate's headquarters."));
    await sleep(1500);

    console.log(chalk.yellow("\nYou enter the grand hall, where the Syndicate Commander awaits."));
    await sleep(1500);

    console.log(chalk.yellow(art.syndicateCommander));
    await sleep(1500);
    console.log(chalk.red("The Syndicate Commander stands before you, weapon drawn, awaiting your challenge."));

    const syndicateLeader = {
        name: 'Syndicate Commander',
        hp: 10,
        attack: 0,
    };

    const combatResult3 = await combat(player, syndicateLeader);

    if (!combatResult3) {
        console.log(chalk.red("\n💀 The Syndicate has triumphed. Humanity’s fate is sealed."));
        process.exit(0);
    }

    console.log(chalk.green("\n🎉 You defeated the Syndicate Commander and learned the truth."));

    musicPlayer.stop();
    await sleep(4000);

    musicPlayer.play('game-engine/music/s1.wav', true);
    console.log(chalk.yellow("\nThe Commander, breathing heavily, reveals the truth."));
    console.log(chalk.yellow("'The Syndicate was never about control... It was about survival.'"));
    await sleep(5500);

    
    musicPlayer.play('game-engine/music/s2.wav', true);
    console.log(chalk.yellow("\nThey explain: 'The world is on the brink of an alien invasion, and we built this dystopia to prepare humanity for the future.'"));
    await sleep(7500)

    musicPlayer.play('game-engine/music/s3.wav', true);
    console.log(chalk.yellow("The Rebels, blinded by their pursuit of freedom, have failed to see the bigger picture."));
    await sleep(5500);

    musicPlayer.play('game-engine/music/mining_theme.mp3', true);
    console.log(chalk.yellow("\nYou realize the Rebel Leader has been manipulating you all along."));
    console.log(chalk.yellow("'You were kidnapped. Your memories erased... to weaponize your skills for our cause.'"));
    await sleep(2000);

    // Final Choice: The dilemma
    const choice = await inquirer.prompt({
        name: 'final_choice',
        type: 'list',
        message: '\nWhat will you do?',
        choices: [
            'Join the Rebel Leader to return control to humanity and end the Syndicate.',
            'Side with the Syndicate to protect humanity from the alien invasion, knowing your true origins.',
        ],
    });

    console.clear();
    if (choice.final_choice === 'Join the Rebel Leader to return control to humanity and end the Syndicate.') {
        console.log(chalk.cyan("\nYou choose to fight for freedom, to return control to the people. The Syndicate falls, but at what cost?"));
    } else {
        console.log(chalk.cyan("\nYou side with the Syndicate, prioritizing humanity’s survival in the face of the alien threat."));
    }

    musicPlayer.stop();
    await sleep(500);

    console.log(chalk.green(figlet.textSync('The End', { font: 'Standard' })));
    console.log(chalk.blue('=============================================================='));
    console.log(chalk.cyan('Thank you for playing!'));

    process.exit(0);
}

export default displayStory;
