import path from 'path'
import chalk from 'chalk'
import mv from 'mv'

import Model from '../Model.js'

export default class MoveToAction extends Model {
  setDestination(destination) {
    this.destination = destination;
    return this;
  }

  getDescription(file) {
    const source = file.file;
    const target = path.join(this.destination, file.name);
    return `move file from ${chalk.yellow(source)} to ${chalk.yellow(target)}`
  }

  async do(file) {
    const source = file.file;
    const target = path.join(this.destination, file.name);

    await new Promise((resolve, reject) => {
      mv(source, target, { clobber: false }, (err) => err ? reject(err) : resolve())
    })

    return true;
  }
};
