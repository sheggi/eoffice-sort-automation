const log = require('../../lib/logger').prefix('move action');

const fs = require('fs').promises;
const path = require('path');

const Model = require('../Model');

module.exports = class MoveToAction extends Model {
  setDestination(destination) {
    this.destination = destination;
    return this;
  }

  do(file) {
    const source = file.file;
    const target = path.join(this.destination, file.name);
    console.log(`action: moving from ${source} to ${target}`);
    return fs.rename(source, target).then(() => { console.log(`action: moved ${target}`) });
  }
};
