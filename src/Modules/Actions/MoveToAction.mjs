import path from 'path'
import emphasize from '../../lib/emphasize.mjs';
import mv from 'mv'

import Model from '../Model.mjs'

export default class MoveToAction extends Model {
  constructor() {
    super()

    this.destination = null
    this.options = { clobber: false }

    this.fileStat = null
    this.source = null
    this.target = null
  }

  setDestination(destination) {
    this.destination = destination;
    return this;
  }

  setOptions(options) {
    this.options = options
  }

  prepare(fileStat) {
    this.fileStat = fileStat

    this.source = fileStat.file;

    this.target = path.join(this.template(this.destination, this.fileStat));

    return this
  }

  template(template, values) {
    const replacer = (match, key) => values[key] || match
    return template.replace(/\{\{([^{}]*)\}\}/g, replacer)
  }

  getDescription() {
    return `move file from ${emphasize(this.source)} to ${emphasize(this.target)}`
  }

  async do() {
    if (!this.source || !this.target) throw new Error('unprepared action')

    await new Promise((resolve, reject) => {
      // https://github.com/andrewrk/node-mv
      mv(this.source, this.target, this.options, (err) => err ? reject(err) : resolve())
    })

    return true;
  }
};
