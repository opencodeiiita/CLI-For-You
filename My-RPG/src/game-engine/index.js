import chalk from 'chalk';
import Item from './Item.js';

export class GameEngine {
  constructor() {
    this.player = { name: '', hp: 100, level: 1,attack:50, inventory: [] };
    this.isOver = false;

    // Available items in the game
    this.items = {
      smallPotion: new Item("Small Health Potion", "potion", "+10 HP"),
      mediumPotion: new Item("Medium Health Potion", "potion", "+20 HP"),
      largePotion: new Item("Large Health Potion", "potion", "+50 HP"),
      ironSword: new Item("Iron Sword", "weapon", "+10 Attack"),
      steelSword: new Item("Steel Sword", "weapon", "+20 Attack"),
      magicWand: new Item("Magic Wand", "weapon", "+30 Attack"),
    };
  }

  setName(name) {
    if (name.trim()) {
      this.player.name = name.trim();
      return `Welcome to the game, ${chalk.green.bold(this.player.name)}!`;
    } else {
      return chalk.red("Name cannot be empty. Please provide a valid name.");
    }
  }

  handleCommand(command) {
    const [cmd, ...args] = command.toLowerCase().split(' ');

    switch (cmd) {
      case 'help':
        return chalk.blue(
          "Available commands: help, stats, explore, attack, pickup <item>, inventory, use <item>, quit"
        );
        //updated the stats command to include the attack points
        case 'stats':
          return chalk.magenta(
            `Player Stats:\n${chalk.bold('Name')}: ${chalk.green(this.player.name || 'Unknown')}\n${chalk.bold(
              'HP'
            )}: ${chalk.red(this.player.hp)}\n${chalk.bold('Level')}: ${chalk.yellow(this.player.level)}\n${chalk.bold('Attack')}: ${chalk.blue(this.player.attack || 10)}`
          );
        

      case 'explore':
        return chalk.yellow("You explore the area and find nothing... for now.");

      case 'attack':
        return chalk.red("You swing your weapon and deal 10 damage!");
      //commands for pickup inventory and use item
      case 'pickup':
        return this.pickupItem(args.join(' '));

      case 'inventory':
        return this.showInventory();

      case 'use':
        return this.useItem(args.join(' '));

      case 'quit':
        this.isOver = true;
        return chalk.gray("Quitting the game.");

      default:
        return chalk.red("Unknown command. Type 'help' for options.");
    }
  }


  //implementing the pickup command
  pickupItem(itemName) {
    if (!itemName) {
      return chalk.red("Specify an item to pick up. Usage: pickup <item>");
    }

    const item = this.items[Object.keys(this.items).find(key => key.toLowerCase() === itemName.toLowerCase())];
    if (item) {
      this.player.inventory.push(item);
      return chalk.green(`You picked up a ${item.name}! Effect: ${item.effect}`);
    } else {
      return chalk.red("That item doesn't exist.");
    }
  }
   //implementing the show inventory command
  showInventory() {
    if (this.player.inventory.length === 0) {
      return chalk.yellow("Your inventory is empty.");
    }

    const inventoryList = this.player.inventory
      .map(
        (item, index) =>
          `${index + 1}. ${chalk.cyan(item.name)} (${chalk.gray(item.type)}) - ${chalk.green(
            item.effect
          )}`
      )
      .join('\n');
    return chalk.green(`Your Inventory:\n${inventoryList}`);
  }
  //implementing the use item command
  useItem(itemName) {
    

    return chalk.yellow(`You used a Health Potion and restored 20 HP!`);
}

  isGameOver() {
    return this.isOver;
  }
}

const game = new GameEngine();
