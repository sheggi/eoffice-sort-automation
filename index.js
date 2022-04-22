import dotenv from 'dotenv'
dotenv.config();

import chalk from 'chalk'
import clear from 'clear'
import figlet from 'figlet'

import jsonConfig from './src/Modules/JsonConfig.js'
import Automata from './src/Modules/Automation.js'

// start cli

clear();

console.log(
  chalk.yellow(
    figlet.textSync('Sort Automata', { horizontalLayout: 'full' })
  )
);


jsonConfig.checkVersion();


const automata = (new Automata())
  .setWorkingDir(await jsonConfig.getDirectory())
  .setRules(await jsonConfig.getRules());


await automata.readWorkingDir()
await automata.handleFilesCli()

process.exit(0);
