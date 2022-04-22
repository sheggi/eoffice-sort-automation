const log = require('../lib/logger').prefix('rule');

module.exports = class Rule {
  constructor(name = null) {
    this.name = name || 'rule';
    this.filter = null;
    this.action = null;
  }

  setFilter(filter) {
    this.filter = filter;
    return this;
  }

  setAction(action) {
    this.action = action;
    return this;
  }
};
