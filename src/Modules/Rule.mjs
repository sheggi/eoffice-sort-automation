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
    this.fileStat = Object.assign({}, fileStat)

    if (this.parseFileName) {
      const match = this.parseFileName.exec(this.fileStat.file)
      this.fileStat = Object.assign(this.fileStat, match?.groups || {})
    }

    // computed stats
    if (this.fileStat.year) {
      this.fileStat['year-1'] = this.fileStat.year - 1
    }

    this.action.prepare(this.fileStat)

    return this
  }

  match() {
    return this.conditions
      .filter(condition => condition.match(this.fileStat)).length === this.conditions.length
  }
};
