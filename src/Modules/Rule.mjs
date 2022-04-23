export default class Rule {
  constructor(name = null) {
    this.name = name || 'rule';
    this.conditions = null;
    this.action = null;
    this.fileStat = null
    this.parseFileName = null
    this.computed = null
  }

  setId(id) {
    this.id = id;
    return this;
  }

  setConditions(conditions) {
    this.conditions = conditions;
    return this;
  }

  setAction(action) {
    this.action = action;
    return this;
  }

  setParseFileName(parseFileName) {
    if (parseFileName)
      this.parseFileName = new RegExp(parseFileName)
    return this;
  }

  prepare(fileStat) {
    this.fileStat = fileStat

    if (this.parseFileName) {
      const match = this.parseFileName.exec(this.fileStat.file)
      this.fileStat = Object.assign(this.fileStat, match?.groups || {})
      console.log({ parseFile: this.parseFileName, fileStat, match })
    }

    this.action.prepare(this.fileStat)


    return this
  }

  match() {
    return this.conditions.reduce((prev, condition) =>
      prev || condition.match(this.fileStat), false)
  }
};
