import fs from 'fs/promises'
import path from 'path'

export default class Automation {
  constructor() {
    this.rules = [];
    this.directory = '';
    this.fileStats = null;
    this.actionables = null;
  }

  setRules(rules) {
    this.rules = rules || [];
    return this;
  }

  setWorkingDir(directory) {
    this.directory = directory;
    return this
  }

  async readWorkingDir() {
    let files = await fs.readdir(this.directory)

    // resolve file statistics for filename
    files = await Promise.all(
      files.map(async (name) => {
        const file = path.join(this.directory, name);
        const stat = await fs.stat(file)
        return Object.assign(stat, { name, file })
      })
    )

    // filter files
    files = files.reduce((acc, file) => {
      if (file.isFile()) {
        acc.push(file)
      }
      return acc;
    }, []);

    this.fileStats = files
  }

  async getActionables() {
    if (!this.fileStats) throw new Error('read working directory first')

    return this.fileStats.flatMap(fileStat =>
      this.rules
        .filter(rule =>
          rule.conditions.reduce((prev, condition) =>
            prev || condition.match(fileStat), false)
        )
        .map(rule => ({
          id: rule.id,
          file: {
            name: fileStat.name
          },
          name: rule.name,
          description: rule.action.getDescription(fileStat)
        }))
    )
  }

  async handleActionable(actionable) {

    const fileStat = this.fileStats.find(fileStat => !actionable || fileStat.name === actionable.file.name)
    if (!fileStat) throw new Error('file not found')

    const rule = this.rules.find(rule => rule.id === actionable.id)
    if (!rule) throw new Error('rule not found')

    return await rule.action.do(fileStat);
  }
};
