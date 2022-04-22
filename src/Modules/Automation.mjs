import fs from 'fs/promises'
import path from 'path'
import inquirer from 'inquirer'
import chalk from 'chalk'

import { println } from '../lib/println.mjs'

export default class Automation {
  constructor() {
    this.rules = [];
    this.directory = '';
    this.fileStats = null;
    this.actionables = null;
  }

  setRules(rules) {
    this.rules = rules || [];
    return this;
  }

  setWorkingDir(directory) {
    this.directory = directory;
    return this
  }

  async readWorkingDir() {
    println(`looking for files in ${chalk.yellow(this.directory)}`);

    let files = await fs.readdir(this.directory)

    // resolve file statistics for filename
    files = await Promise.all(
      files.map(async (name) => {
        const file = path.join(this.directory, name);
        const stat = await fs.stat(file)
        return Object.assign(stat, { name, file })
      })
    )

    // filter files
    files = files.reduce((acc, file) => {
      if (file.isFile()) {
        acc.push(file)
      }
      return acc;
    }, []);

    this.fileStats = files
  }

  async handleFilesCli() {
    if (!this.fileStats) throw new Error('read working directory first')

    // handle each file sequentialy
    await Promise.all(
      this.fileStats.map(async (fileStat) => {

        println(`handle file ${chalk.yellow(fileStat.name)}`);

        let rule = await this.rules.reduce(async (prev, rule) => {
          prev = await prev
          if (prev) return prev;
          let match = rule.conditions.reduce((prev, condition) => prev || condition.match(fileStat), false);
          let confirmed = false;

          if (match) {
            const answer = await inquirer.prompt({
              type: 'confirm',
              name: 'do',
              message: `do you want to apply (${rule.name}):\n  ${rule.action.getDescription(fileStat, { color: true })})\n `
            });
            if (answer.do) {
              confirmed = await rule.action.do(fileStat);
            }
          }

          return match && confirmed ? rule : null;
        }, null);

        if (!rule) {
          return;
        }

        return;
      })
    );

    println(chalk.green('all files handled!'));
  }

  async getActionables() {
    if (!this.fileStats) throw new Error('read working directory first')

    return this.fileStats.flatMap(fileStat =>
      this.rules
        .filter(rule =>
          rule.conditions.reduce((prev, condition) =>
            prev || condition.match(fileStat), false)
        )
        .map(rule => ({
          id: rule.id,
          file: {
            name: fileStat.name
          },
          name: rule.name,
          action: rule.action.getDescription(fileStat)
        }))
    )
  }

  async handleActionable(actionable) {

    const fileStat = this.fileStats.find(fileStat => !actionable || fileStat.name === actionable.file.name)
    const rule = this.rules.find(rule => rule.id === actionable.id)

    await Promise.resolve();

    return await rule.action.do(fileStat);
  }
};
