import { useMetaStore } from '~/utils/metastore.mjs'
import JsonConfig from '~~/src/Modules/JsonConfig.mjs'
import hash from 'object-hash'

export default defineEventHandler(async (event) => {
    try {
        await JsonConfig.load()
        const config = await sync()
        return { success: true, config }
    } catch (error) {
        event.res.statusCode = 400

        return {
            error: error instanceof Error ? { message: error.message } : error
        }
    }
})

async function sync() {
    const prefix = 'eoffice-sort-automation.'
    const metaStore = useMetaStore(prefix)

    const config = {
        version: -1,
        directory: null,
        rules: null,
    }

    const local = JsonConfig.getRaw()

    const fetched = await Promise.all([
        metaStore.get('config.version'),
        metaStore.get('config.directory'),
        metaStore.get('config.rules.*'),
    ])

    config.version = fetched[0]?.[0]?.value
    config.directory = fetched[1]?.[0]?.value
    config.rules = fetched[2].map(store => store.value)

    for (const index in local.rules) {
        const rule = local.rules[index]
        const origin = config.rules.find(originRule => originRule.id === rule.id)
        if (rule.version && rule.version > origin.version) {
            await metaStore.set(`config.rules.${rule.id}`, rule)
            const versionHash = hash(rule)
            await metaStore.set(`config.rule-hisory.${rule.id}.${versionHash}`, rule)
        } else {
            local.rules[index] = origin
        }
    }

    await JsonConfig.setRaw(local)

    return config
}