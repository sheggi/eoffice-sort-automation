const dotenv = require('dotenv');
dotenv.config();

const chalk = require('chalk');
const clear = require('clear');
const figlet = require('figlet');

const jsonConfig = require('./Modules/JsonConfig');

// start cli

clear();

console.log(
  chalk.yellow(
    figlet.textSync('Sort Automata', { horizontalLayout: 'full' })
  )
);

jsonConfig.getAutomata()
  .run()
  .then(() => process.exit(0));
