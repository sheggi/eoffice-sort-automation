import { use } from "~~/src/lib/emphasize.mjs";
import Automation from "~~/src/Modules/Automation.mjs"

export default defineEventHandler(async (event) => {
  use(text => `<em>${text}</em>`)

  try {
    const JsonConfig = (await import('~~/src/Modules/JsonConfig.mjs')).default

    const automata = (new Automation())
      .setWorkingDir(await JsonConfig.getDirectory())
      .setRules(await JsonConfig.getRules());


    await automata.readWorkingDir()
    const actionables = await automata.findActionables()

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
