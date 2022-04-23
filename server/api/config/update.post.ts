import JsonConfig from '~~/src/Modules/JsonConfig.mjs'

export default defineEventHandler(async (event) => {
    try {
        const data = await useBody(event.req)
        await JsonConfig.load()

        if (!data.rule) throw new Error('expected rule')

        const rule = await update(data.rule)
        return { success: true, rule }
    } catch (error) {
        event.res.statusCode = 400

        return {
            error: error instanceof Error ? { message: error.message } : error
        }
    }
})

async function update(rule) {
    const local = JsonConfig.getRaw()

    const original = local.rules.find(original => original.id === rule.id)


    if (rule.parseFileName) {
        original.parseFileName = rule.parseFileName
    } else {
        delete original.parseFileName
    }
    original.action = rule.action
    original.conditions = rule.conditions
    original.version = Date.now()

    await JsonConfig.setRaw(local)

    return original
}