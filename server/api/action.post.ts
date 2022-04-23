import Automation from "~~/src/Modules/Automation.mjs"
import JsonConfig from "~~/src/Modules/JsonConfig.mjs"

export default defineEventHandler(async (event) => {
  const body = await useBody(event.req)

  const automata = (new Automation())
    .setWorkingDir(await JsonConfig.getDirectory())
    .setRules(await JsonConfig.getRules());


  await automata.readWorkingDir()

  try {
    const result = await automata.handleActionable(body)

    return { success: true, result }
  } catch (error) {
    event.res.statusCode = 400
    
    return { error }
  }
})
