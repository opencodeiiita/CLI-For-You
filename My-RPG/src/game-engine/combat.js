import readline from "readline";
import keypress from "keypress";
import chalk from "chalk";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: true,
});

let timer;
let combatInProgress = true;
let inputLength = 0;

function startCombat(player, enemy) {
  if (!combatInProgress) return;

  console.log(`You are attacked by ${enemy.name}`);

  const targetString =
    enemy.stringList[Math.floor(Math.random() * enemy.stringList.length)];

  console.log(`\nType the following: "${chalk.cyan(targetString)}"`);

  console.log("");
  startTimer(enemy.timeLimit, player, enemy);

  keypress(process.stdin);
  process.stdin.on("keypress", () => {
    inputLength = rl.line.length;
  });

  rl.question("Your input: ", (input) => {
    clearInterval(timer);
    checkInput(input, targetString, player, enemy);
  });

  process.stdin.setRawMode(true);
  process.stdin.resume();
}

function displayHealth(player, enemy) {
  console.log(`\n${chalk.green("Player Health")}: ${player.hp}`);
  console.log(`\n${chalk.red("Enemy Health")}: ${enemy.hp}`);
}

function drawProgressBar(totalTime, timeLeft) {
  const barLength = 20;
  const filledLength = Math.floor((timeLeft / totalTime) * barLength);
  const emptyLength = barLength - filledLength;
  var bar="";
  
  if (timeLeft < totalTime / 3) {
    var bar = chalk.red("█".repeat(filledLength) + "-".repeat(emptyLength));  // Red when less than 1/3rd
  } else if (timeLeft >= totalTime / 3 && timeLeft < (2 * totalTime) / 3) {
    var bar = chalk.yellow("█".repeat(filledLength) + "-".repeat(emptyLength));  // Orange in the middle
  } else {
    var bar = chalk.green("█".repeat(filledLength) + "-".repeat(emptyLength));  // Green when more than 2/3rd
  }

  readline.moveCursor(process.stdout, 0, -1);
  readline.clearLine(process.stdout, 0);
  readline.cursorTo(process.stdout, 0);
  process.stdout.write(`${chalk.yellow("Time left:")} [${bar}] ${timeLeft}s`);
  readline.clearLine(process.stdout, 1);
  process.stdout.write("\n");
  readline.cursorTo(process.stdout, 12 + inputLength); 
}

function checkInput(input, targetString, player, enemy) {
  if (input === targetString) {
    console.log(
      `${chalk.green("\nSuccess!")} You dealt ${chalk.red(
        `${player.attack}`
      )} damage to ${enemy.name}! ⚔️`
    );
    enemy.hp -= player.attack;
    enemy.hp = Math.max(enemy.hp, 0);
    if (enemy.hp <= 0) {
      console.log(
        `${chalk.green(
          `Congrats ${player.name}\nYou defeated the ${enemy.name}! 🎉`
        )}`
      );
      combatInProgress = false;
    }
  } else {
    console.log(
      `${chalk.red("\nMiss!")} ${enemy.name} strikes you for ${chalk.red(
        `${enemy.attack}`
      )} damage! 💥`
    );
    player.hp -= enemy.hp;
    player.hp = Math.max(player.hp, 0); // Use Math.max here
    if (player.hp <= 0) {
      console.log(
        `${chalk.red(`\nYou were defeated by the ${enemy.name}! 😞`)}`
      );
      combatInProgress = false;
    }
  }

  displayHealth(player, enemy);

  if (combatInProgress) {
    setTimeout(() => startCombat(player, enemy), 1000);
  } else {
    rl.close();
  }
}

function startTimer(totalTime, player, enemy) {
  let timeLeft = totalTime;

  drawProgressBar(totalTime, timeLeft);

  timer = setInterval(() => {
    timeLeft--;

    readline.cursorTo(process.stdout, 0);
    drawProgressBar(totalTime, timeLeft);

    if (timeLeft <= 0) {
      clearInterval(timer);
      console.log(
        `${chalk.red(`\n\nTime's up ${player.name}!`)} ${
          enemy.name
        } strikes you for ${chalk.red(`${enemy.hp}`)} damage! 💥`
      );
      player.hp -= enemy.attack;
      player.hp = Math.max(player.hp, 0);
      displayHealth(player, enemy);
      if (player.hp <= 0) {
        console.log(
          `${chalk.red(`\nYou were defeated by the ${enemy.name}! 😞`)}`
        );
        combatInProgress = false;
      }
      if (combatInProgress) {
        setTimeout(() => startCombat(player, enemy), 1000);
      } else {
        rl.close();
      }
    }
  }, 1000);
}

let player = {
  name: "Vardaan",
  hp: 100,
  level: 1,
  attack: 25,
  inventory: [],
  itemInHand: "none",
};

let enemy = {
  name: "Goblin",
  hp: 100,
  timeLimit: 10,
  attack: 50,
  stringList: [
    "attack with fury",
    "defend your honor",
    "strike with precision",
    "take no prisoners",
  ],
};

// Exported for use in other parts of the game
export default startCombat;
export { player, enemy }; // Export the player and enemy objects for customization


