import Model from '../Model.mjs'

export default class FilePattern extends Model {
  constructor() {
    super();
    this.property = null;
    this.regexp = null;
  }

  setProperty(property) {
    this.property = property

    return this
  }
  setRegexp(regexp) {
    this.regexp = new RegExp(regexp)

    return this
  }

  match(fileStat) {
    if (!fileStat) {
      return false;
    }
    
    return this.regexp.exec(fileStat[this.property]);
  }
};
