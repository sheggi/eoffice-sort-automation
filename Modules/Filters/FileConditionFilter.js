const log = require('../../lib/logger').prefix('auto');

const Model = require('../Model');

module.exports = class FilterConditionFilter extends Model {
  constructor() {
    super();
    this.conditions = [];
  }

  addCondition(condition) {
    if(!condition || !condition.property || !condition.regexp) {
      console.error('invalid condition', condition);
      process.exit(1);
    }
    if(typeof condition.regexp !== 'object' || condition.regexp.constructor.name !== 'RegExp') {
      condition.regexp = new RegExp(condition.regexp);
      log('converted regexp', condition.regexp)
    }
    this.conditions.push(condition);
    return this;
  }

  match(file) {
    if (!file) {
      return false;
    }
    return this.conditions.reduce((previous, condition) => {
      log(`matching ${file[condition.property]} with ${condition.regexp}`);
      return previous && (file[condition.property] + '').match(condition.regexp);
    }, true);
  }
};
