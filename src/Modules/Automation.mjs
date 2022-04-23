import fs from 'fs/promises'
import path from 'path'
import glob from 'glob'

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
    console.log(`${this.directory}/*`)
    let files = await new Promise((resolve, reject) => {
      glob(`**/*`, { cwd: this.directory, stat: true }, function (err, files) {
        if (err) reject(err)
        resolve(files || [])
      })
    })

    // resolve file statistics for filename
    files = await Promise.all(
      files.map(async (filePath) => {
        const file = path.join(this.directory, filePath);
        const stat = await fs.stat(file)
        const name = path.basename(filePath)
        const ext = path.extname(filePath)
        return Object.assign(stat, { path: filePath, file, name, ext })
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

  async findActionables() {
    if (!this.fileStats) throw new Error('read working directory first')

    return this.fileStats.flatMap(fileStat =>
      this.rules
        .map(rule => rule.prepare(fileStat))
        .filter(rule => rule.match())
        .map(rule => ({
          id: rule.id,
          file: {
            name: fileStat.name
          },
          name: rule.name,
          description: rule.action.getDescription()
        }))
    )
  }

  async handleActionable(actionable) {

    const fileStat = this.fileStats.find(fileStat => !actionable || fileStat.name === actionable.file.name)
    if (!fileStat) throw new Error('file not found')

    const rule = this.rules.find(rule => rule.id === actionable.id)
    if (!rule) throw new Error('rule not found')

    return await rule.prepare(fileStat).action.do();
  }
};
