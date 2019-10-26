const config = require('../config.json');
const _ = require('lodash');

const Automata = require('./Automation');
const Rule = require('./Rule');

const hydrate = function (Model, raw, cache) {
  const type = raw['@type'];
  const name = raw['@name'];

  let Class = cache[type];
  if (!Class) {
    Class = cache[type] = require(`./${Model}/${type}`); // todo sanitation
  }
  if (!Class) {
    console.error(`Class ./${Model}/${type} not found!`);
  }
  let instance = new Class(name);

  const setProperty = (prop, value, list = false) => {
    const fn = (list ? 'add' : 'set') + _.upperFirst(prop);
    if (!_.isFunction(instance[fn])) console.error(`invalid function name ${fn} for Class ${type}`);
    instance[fn](value)
  };

  for (let prop in raw) {
    if (!raw.hasOwnProperty(prop) || !prop.length || prop[0] === '@') continue;
    const value = raw[prop];
    const isList = _.isArray(value);
    (isList ? value : [value]).forEach(v => setProperty(prop, v, isList))
  }

  return instance
};

class JsonConfig {
  constructor() {
    this.actionCache = {};
    this.filterCache = {};
  }

  checkVersion() {
    if (
      !config ||
      config.version !== 1 ||
      !_.isArray(config.actions) ||
      !_.isArray(config.filters) ||
      !_.isArray(config.rules)
    ) {
      console.error('expected config version is 1 got ' + (config || {}).version);
      process.exit(1)
    }
  }

  getDirectory() {
    this.checkVersion();

    return config.directory
  }

  getActions() {
    this.checkVersion();

    return config.actions
      .map(item => hydrate('Actions', item, this.actionCache))
      .reduce((acc, instance) => {
        acc[instance.id] = instance;
        return acc;
      }, {})
  }

  getFilters() {
    this.checkVersion();

    return config.filters
      .map(item => hydrate('Filters', item, this.filterCache))
      .reduce((acc, instance) => {
        acc[instance.id] = instance;
        return acc;
      }, {})
  }

  getRules() {
    this.checkVersion();

    const actions = this.getActions();
    const filters = this.getFilters();


    return config.rules.map(rule => {
      console.log('xxx', actions[rule.action], filters[rule.filter], rule);
      return (new Rule())
        .setFilter(filters[rule.filter])
        .setAction(actions[rule.action])
    })
  }

  getAutomata() {
    this.checkVersion();

    return (new Automata())
      .setWorkingDir(this.getDirectory())
      .setRules(this.getRules());
  }
}

module.exports = new JsonConfig();
