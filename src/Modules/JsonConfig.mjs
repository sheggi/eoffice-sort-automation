import _ from 'lodash'
import fs from 'fs/promises'
import { dirname } from 'path';
import { fileURLToPath } from 'url';

import Rule from './Rule.mjs'

const __dirname = dirname(fileURLToPath(import.meta.url));
let config = null

const hydrate = async function (Model, raw, cache) {
  const type = raw['@type'];

  let Class = cache[type];
  if (!Class) {
    Class = cache[type] = (await import(`./${Model}/${type}.mjs`)).default; // todo sanitation
  }
  if (!Class) {
    console.error(`Class ./${Model}/${type} not found!`);
  }
  let instance = new Class();

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
    this.conditionsCache = {};
    this.actionsCache = {};
  }

  async load() {
    config = JSON.parse(await fs.readFile(__dirname + '/../../config.json'))

    this.checkVersion();
  }

  checkVersion() {
    if (
      !config ||
      config.version !== 2 ||
      !_.isArray(config.rules)
    ) {
      console.error(`expected config version is 2 got ${(config || {}).version}`);
      process.exit(1)
    }
  }

  _resolveWithEnv(original) {
    if (typeof original !== 'string') return original;
    return original.replace(/%([^%]+)%/g, (_, n) => process.env[n]);
  }

  getDirectory() {
    this.checkVersion();

    return this._resolveWithEnv(config.directory);
  }

  async getRules() {
    this.checkVersion();

    const rules = await Promise.all(
      config.rules.map(async (rule) => {
        const conditions = await Promise.all(rule.conditions.map(
          async (condition) => await hydrate('Conditions', condition, this.conditionsCache)
        ))
        if (rule.action.destination)
          rule.action.destination = this._resolveWithEnv(rule.action.destination)
        const action = await hydrate('Actions', rule.action, this.actionsCache)

        return await (new Rule(rule.name))
          .setId(rule.id)
          .setParseFileName(rule.parseFileName)
          .setConditions(conditions)
          .setAction(action)
      })
    );

    return rules;
  }

  getRaw() {
    return config;
  }

  async setRaw(raw) {
    config = raw

    await fs.writeFile(__dirname + '/../../config.json', JSON.stringify(raw, null, 2))
  }
}

export default new JsonConfig();
