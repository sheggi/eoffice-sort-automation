import legacy from './config.json' assert {type: 'json'}
import fs from 'fs/promises'

if(legacy.version !== 1) {
    throw new Error(`expect config version to be 1 but got ${legacy.version}`)
}

const config = {
    version: 2,
    directory: legacy.directory,
    rules: []
}

config.rules = legacy.rules.map(rule => {
    const newRule = { name: rule.name }

    const filter = legacy.filters.find(filter => filter.id === rule.filter)
    newRule.conditions = filter.condition.map(condition => {
        condition['@type'] = filter['@type'] === 'FileConditionFilter' ? 'FilePattern' : filter['@type']
        return condition
    })
    newRule.action = legacy.actions.find(action => action.id === rule.action)
    newRule.action.destination+='\\{{name}}'

    newRule.id = newRule.action.id
    delete newRule.action.id

    return newRule
})

fs.writeFile('./config.json', JSON.stringify(config, null, 2))