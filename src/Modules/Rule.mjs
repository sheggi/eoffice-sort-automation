export default class Rule {
  constructor(name = null) {
    this.name = name || 'rule';
    this.conditions = null;
    this.action = null;
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
};
