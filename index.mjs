import dotenv from 'dotenv'
dotenv.config();

import chalk from 'chalk'
import clear from 'clear'
import figlet from 'figlet'
import jsonConfig from './src/Modules/JsonConfig.mjs'
import Automata from './src/Modules/Automation.mjs'

// start cli

clear();

console.log(
  chalk.yellow(
    figlet.textSync('Sort Automata', { horizontalLayout: 'full' })
  )
);

const automata = (new Automata())
  .setWorkingDir(await jsonConfig.getDirectory())
  .setRules(await jsonConfig.getRules());


await automata.readWorkingDir()
await automata.handleFilesCli()

process.exit(0);
