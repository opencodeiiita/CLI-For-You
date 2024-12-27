import chalk from "chalk";
import Item from "./Item.js";
import displayStory from "./story.js";
import combat from './combatNew.js';

//displayStory();

export class GameEngine {
  constructor() {
    this.player = {
      name: "",
      hp: 100,
      level: 1,
      attack: 50,
      inventory: [],
      itemInHand: "none",
    };
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

  async handleCommand(command) {  // Made async to handle the await from combat
    const [cmd, ...args] = command.toLowerCase().split(" ");

    switch (cmd) {
      case "help":
        return chalk.blue(
          "Available commands: help, storymode, stats, explore, attack, pickup <item>, inventory, use <item>, quit"
        );
      case "storymode":
        await displayStory();
        return;
      //updated the stats command to include the attack points
      case "stats":
        return chalk.magenta(
          `Player Stats:\n${chalk.bold("Name")}: ${chalk.green(
            this.player.name || "Unknown"
          )}\n${chalk.bold("HP")}: ${chalk.red(this.player.hp)}\n${chalk.bold(
            "Level"
          )}: ${chalk.yellow(this.player.level)}\n${chalk.bold(
            "Attack"
          )}: ${chalk.blue(this.player.attack || 10)}`
        );

      case "explore":
        return this.randomItemPicker();

      case "attack":
        return;

      //commands for pickup inventory and use item
      case "pickup":
        return this.pickupItem(args.join(" "));

      case "inventory":
        return this.showInventory();

      case "use":
        return this.useItem(args.join(" "));

      case "drop":
        return this.dropItem(args.join(" "));

      case "quit":
        this.isOver = true;
        return chalk.gray("Quitting the game.");

      default:
        return chalk.red("Unknown command. Type 'help' for options.");
    }
  }

  randomItemPicker() {
    // Drop rarety, This is a real game.
    const itemWeights = {
      smallPotion: 5,
      mediumPotion: 2,
      largePotion: 1,
      ironSword: 3,
      steelSword: 2,
      magicWand: 1,
    };
    const chance = Math.random();

    if (chance < 0.7) {
      // 70% chance of finding an item
      const weightedItems = [];

      // Populate the weighted array based on the weights
      Object.keys(itemWeights).forEach((itemKey) => {
        for (let i = 0; i < itemWeights[itemKey]; i++) {
          weightedItems.push(this.items[itemKey]);
        }
      });

      const randomItem =
        weightedItems[Math.floor(Math.random() * weightedItems.length)];

      this.player.inventory.push(randomItem);

      return chalk.yellow(
        `You explore the area and find a ${chalk.green(
          randomItem.name
        )}! Effect: ${chalk.green(
          randomItem.effect
        )}\nIt has been added to your inventory.`
      );
    } else {
      return chalk.yellow(
        "You explore the area but find nothing...\nBetter luck next time."
      ); // try again nigga
    }
  }

  //implementing the pickup command
  pickupItem(itemName) {
    if (!itemName) {
      return chalk.red("Specify an item to pick up. Usage: pickup <item>");
    }

    const item =
      this.items[
        Object.keys(this.items).find(
          (key) => key.toLowerCase() === itemName.toLowerCase()
        )
      ];
    if (item) {
      this.player.inventory.push(item);
      return chalk.green(
        `You picked up a ${item.name}! Effect: ${item.effect}`
      );
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
          `${index + 1}. ${chalk.cyan(item.name)} (${chalk.gray(
            item.type
          )}) - ${chalk.green(item.effect)}`
      )
      .join("\n");
    return chalk.green(`Your Inventory:\n${inventoryList}`);
  }

  //implementing the use item command
  useItem(itemName) {
    const itemInInventory = this.player.inventory.find(
      (item) => item.name.toLowerCase() === itemName.toLowerCase()
    );

    if (!itemInInventory) {
      return chalk.yellow(`Item not found in your inventory: ${itemName}`);
    }

    const potions = [
      this.items.smallPotion,
      this.items.mediumPotion,
      this.items.largePotion,
    ];
    const isPotion = potions.some(
      (potion) =>
        potion.name.toLowerCase() === itemInInventory.name.toLowerCase()
    );

    if (isPotion) {
      const potionEffect = parseInt(itemInInventory.effect);

      if(this.player.hp===100){
        return chalk.green(`This is max HP. Can not go beyond this`);  // comment if health can go beyond 100
      }

      this.player.hp += potionEffect;

      this.player.hp = Math.min(this.player.hp,100); // comment if health can go beyond 100

      const itemIndex = this.player.inventory.findIndex(
        (item) => item.name.toLowerCase() === itemInInventory.name.toLowerCase()
      );

      if (itemIndex !== -1) {
        this.player.inventory.splice(itemIndex, 1);
      }

      return chalk.green(
        `You used a ${itemInInventory.name}, restored ${potionEffect} HP!`
      );
    }

    const weapons = [
      this.items.ironSword,
      this.items.steelSword,
      this.items.magicWand,
    ];
    const isWeapon = weapons.some(
      (weapon) =>
        weapon.name.toLowerCase() === itemInInventory.name.toLowerCase()
    );

    if (isWeapon) {
      const attackBoost = parseInt(itemInInventory.effect);
      this.player.attack += attackBoost;
      this.player.itemInHand = itemInInventory;

      return chalk.green(
        `You used a ${itemInInventory.name}, your attack is temporarily boosted by ${attackBoost}!`
      );
    }

    return chalk.yellow(`Invalid item: ${itemName}`);
  }

  dropItem(itemName) {
    if (this.player.itemInHand === "none") {
      return chalk.yellow(`No Item Selected`);
    }
    if (this.player.itemInHand.name.toLowerCase() !== itemName.toLowerCase()) {
      return chalk.yellow(`Selected Item is ${this.player.itemInHand.name}. Can not drop ${itemName.toLowerCase()}`);
    }

    const attackBoost = parseInt(this.player.itemInHand.effect);
    this.player.itemInHand = "none";

    this.player.attack -= attackBoost;

    return chalk.yellow(`Droped ${itemName}`)
  }

  isGameOver() {
    return this.isOver;
  }
}

const game = new GameEngine();