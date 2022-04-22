import dotenv from 'dotenv'
dotenv.config();

import chalk from 'chalk'
import clear from 'clear'
import figlet from 'figlet'
import inquirer from 'inquirer'
import println from './src/lib/println.mjs'
import jsonConfig from './src/Modules/JsonConfig.mjs'
import Automata from './src/Modules/Automation.mjs'

// start cli

clear();

console.log(
  chalk.yellow(
    figlet.textSync('Sort Automata', { horizontalLayout: 'full' })
  )
);

// assemble

const automata = (new Automata())
  .setWorkingDir(await jsonConfig.getDirectory())
  .setRules(await jsonConfig.getRules());


println(`looking for files in ${chalk.yellow(automata.directory)}`);
await automata.readWorkingDir()

// act

const actionables = await automata.findActionables({ color: true })

await Promise.all(actionables.map(async (actionable) => {
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
}))

println(chalk.green('all files handled!'));

process.exit(0);
