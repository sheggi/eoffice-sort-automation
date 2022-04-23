import { use } from "~~/src/lib/emphasize.mjs";
import Automation from "~~/src/Modules/Automation.mjs"
import JsonConfig from "~~/src/Modules/JsonConfig.mjs";

export default defineEventHandler(async (event) => {
  use(text => `<br><em>${text}</em>`)

  try {
    await JsonConfig.load()

    const automata = (new Automation())
      .setWorkingDir(await JsonConfig.getDirectory())
      .setRules(await JsonConfig.getRules());


    await automata.readWorkingDir()
    const actionables = await automata.findActionables({noop: false})

    return {
      actionables
    }
  } catch (error) {
    event.res.statusCode = 400
    return {
      error: error instanceof Error ? { message: error.message } : error
    }
  }
})
