import path from 'path'
import chalk from 'chalk'
import mv from 'mv'

import Model from '../Model.mjs'

export default class MoveToAction extends Model {
  setDestination(destination) {
    this.destination = destination;
    return this;
  }

  getDescription(fileStat, options = { color: false }) {
    const source = fileStat.file;
    const target = path.join(this.destination, fileStat.name);
    return `move file from ${options.color ? chalk.yellow(source) : source} to ${options.color ? chalk.yellow(target) : target}`
  }

  async do(fileStat) {
    const source = fileStat.file;
    const target = path.join(this.destination, fileStat.name);

    await new Promise((resolve, reject) => {
      mv(source, target, { clobber: false }, (err) => err ? reject(err) : resolve())
    })

    return true;
  }
};
