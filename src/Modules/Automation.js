const fs = require('fs').promises;
const path = require('path');
const inquirer = require('inquirer');
const chalk = require('chalk');

const log = require('../lib/logger').prefix('auto');
const println = require('../lib/println');

module.exports = class Automation {
  constructor() {
    this.rules = [];
    this.directory = '';
  }

  setRules(rules) {
    this.rules = rules || [];
    return this;
  }

  setWorkingDir(directory) {
    this.directory = directory;
    return this
  }

  run() {
    println(`looking for files in ${chalk.yellow(this.directory)}`);

    return fs.readdir(this.directory)
      .then(files => {
        // resolve file statistics for filename
        return Promise.all(
          files.map(name => {
            const file = path.join(this.directory, name);
            return fs.stat(file)
              .then(meta => Object.assign(meta, {name, file}))
          })
        )
      })
      .then(files => {
        // filter files
        files = files.reduce((acc, file) => {
          if (file.isFile()) {
            acc.push(file)
          }
          return acc;
        }, []);

        log(`found ${files.length} files`);

        return files;
      })
      .then(files => {
        // handle each file sequentialy
        return files.reduce(async (previousPromise, file) => {
          await previousPromise;

          println(`handle file ${chalk.yellow(file.name)}`);

          let rule = this.rules.reduce(async (prev, rule) => {
            prev = await prev;
            if (prev) return prev;
            let match = rule.filter.match(file);
            let confirmed = false;

            log(`checking rule ${chalk.yellow(rule.name)}: ${match?'':'not '}matched`);

            if (match) {
              const answer = await inquirer.prompt({
                type: 'confirm',
                name: 'do',
                message: `do you want to apply (${rule.action['@type']}):\n  ${rule.action.getDescription(file)})\n `
              });
              if (answer.do) {
                confirmed = await rule.action.do(file);
              }
            }

            return match && confirmed ? rule : null;
          }, null);

          rule = await rule;

          if (!rule) {
            log(`no rule found - continue`);
            return Promise.resolve();
          }

          log(`found rule ${chalk.yellow(rule.name)}`);

          return Promise.resolve();
        }, Promise.resolve());
      })
      .then(() => {
        println(chalk.green('all files handled!'));
      });
  }
};
