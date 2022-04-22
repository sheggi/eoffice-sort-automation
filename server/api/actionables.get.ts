import Automation from "~~/src/Modules/Automation.mjs"
import JsonConfig from "~~/src/Modules/JsonConfig.mjs"

export default async (req, res) => {

  JsonConfig.checkVersion();


  const automata = (new Automation())
    .setWorkingDir(await JsonConfig.getDirectory())
    .setRules(await JsonConfig.getRules());


  await automata.readWorkingDir()
  const actionables = await automata.getActionables()

  return {
    actionables
  }
}
