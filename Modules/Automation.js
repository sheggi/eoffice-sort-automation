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

          const rule = this.rules.reduce((prev, rule) => {
            return prev || rule.filter.match(file) ? rule : null;
          }, null);

          if (!rule) {
            log(`no rule found - continue`);
            return Promise.resolve();
          }

          log(`found rule (${rule.name})`);

          const answer = await inquirer.prompt({
            type: 'confirm',
            name: 'do',
            message: `do you want to apply (${rule.action['@type']}):\n  ${rule.action.getDescription(file)})\n `
          });
          if (answer.do) {
            return rule.action.do(file);
          }

          return Promise.resolve();
        }, Promise.resolve());
      })
      .then(() => {
        println(chalk.green('all files handled!'));
      });
  }
};
