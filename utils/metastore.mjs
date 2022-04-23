import { getJson, postJson } from './http.mjs'

class MetaStore {
    constructor(options = {}) {
        this.api = options.api
        this.token = options.token
        this.prefix = options.prefix || ''
    }

    async get(key) {
        const data = await getJson(
            this.api,
            {
                key: this.prefix + key,
            },
            this.token
        )
        return data.values
    }

    async set(key, value) {
        const data = await postJson(
            this.api,
            {
                key: this.prefix + key,
                value
            },
            this.token
        )
        return data
    }
}

export function useMetaStore(prefix) {
    return new MetaStore({
        api: process.env['META_STORE_API'],
        token: process.env['META_STORE_TOKEN'],
        prefix: prefix
    })
}