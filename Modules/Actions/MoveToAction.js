const log = require('../../lib/logger').prefix('move action');

const fs = require('fs').promises;
const path = require('path');
const chalk = require('chalk');

const Model = require('../Model');

module.exports = class MoveToAction extends Model {
  setDestination(destination) {
    this.destination = destination;
    return this;
  }

  getDescription(file) {
    const source = file.file;
    const target = path.join(this.destination, file.name);
    return `move file from ${chalk.yellow(source)} to ${chalk.yellow(target)}`
  }

  do(file) {
    const source = file.file;
    const target = path.join(this.destination, file.name);
    log(`moving from ${source} to ${target}`);
    return fs.rename(source, target).then(() => { log(`moved ${target}`) });
  }
};
