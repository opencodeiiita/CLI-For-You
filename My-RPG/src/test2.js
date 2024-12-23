#!/usr/bin/env node

import chalk from 'chalk';
import readline from 'readline';
import figlet from 'figlet';
import { GameEngine } from './game-engine/index.js';

const game = new GameEngine();
game.handleCommand("storymode");