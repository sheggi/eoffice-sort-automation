import dotenv from 'dotenv'
dotenv.config();

import chalk from 'chalk'
import clear from 'clear'
import figlet from 'figlet'
import inquirer from 'inquirer'
import println from './src/lib/println.mjs'
import JsonConfig from './src/Modules/JsonConfig.mjs'
import Automata from './src/Modules/Automation.mjs'
import emphasize, { use } from './src/lib/emphasize.mjs';


// start cli

clear();

use(text => chalk.yellow(text))
console.log(
  emphasize(
    figlet.textSync('Sort Automata', { horizontalLayout: 'full' })
  )
);

// assemble
await JsonConfig.load()
const automata = (new Automata())
  .setWorkingDir(await JsonConfig.getDirectory())
  .setRules(await JsonConfig.getRules());


println(`looking for files in ${emphasize(automata.directory)}`);
await automata.readWorkingDir()

// act

const actionables = await automata.findActionables({ color: true })

for (const actionable of actionables) {
  println(`handle file ${chalk.yellow(actionable.file.name)}`);

  const answer = await inquirer.prompt({
    type: 'confirm',
    name: 'do',
    message: `do you want to apply (${actionable.name}):\n  ${actionable.description})\n `
  });

  if (answer.do) {
    const confirmed = await automata.handleActionable(actionable)

    println(`result: ${confirmed}`)
  }
}

println(chalk.green('all files handled!'));

process.exit(0);
