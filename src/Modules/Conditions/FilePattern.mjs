import Model from '../Model.mjs'

export default class FilePattern extends Model {
  constructor() {
    super();
    this.property = null;
    this.regexp = null;
  }

  setProperty(property) {
    this.property = property
  }
  setRegexp(regexp) {
    this.regexp = regexp
  }

  match(fileStat) {
    if (!fileStat) {
      return false;
    }
    return (fileStat[this.property] + '').match(this.regexp);
  }
};
