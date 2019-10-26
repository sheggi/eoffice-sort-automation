const _ = require('lodash');

module.exports = class Model {
  constructor() {
    this['@type'] = _.kebabCase(this.constructor.name);
    this.setId(this['@type'] + '-' + Date.now());
  }

  setId(id) {
    this.id = id;
  }
};
