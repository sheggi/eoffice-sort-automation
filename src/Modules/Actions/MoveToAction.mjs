import path from 'path'
import emphasize from '../../lib/emphasize.mjs';
import mv from 'mv'

import Model from '../Model.mjs'

export default class MoveToAction extends Model {
  setDestination(destination) {
    this.destination = destination;
    return this;
  }

  getDescription(fileStat) {
    const source = fileStat.file;
    const target = path.join(this.destination, fileStat.name);
    return `move file from ${emphasize(source) } to ${emphasize(target)}`
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
