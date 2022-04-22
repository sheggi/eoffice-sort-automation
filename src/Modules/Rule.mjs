export default class Rule {
  constructor(name = null) {
    this.name = name || 'rule';
    this.conditions = null;
    this.action = null;
  }

  setConditions(conditions) {
    this.conditions = conditions;
    return this;
  }

  setAction(action) {
    this.action = action;
    return this;
  }
};
