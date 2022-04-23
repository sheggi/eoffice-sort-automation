<template>
    <div class="m-4">
        <div>
            <NuxtLink to="/" class="text-blue-500 hover:text-blue-400">🔍 home</NuxtLink> |
            <button @click="sync" class="text-blue-500 hover:text-blue-400">🔄 sync</button>
        </div>

        <div v-if="config">
            <div>Version: {{config.version}}</div>
            <div>Directory: {{config.directory}}</div>

            <RuleConfig v-for="rule in config.rules" :key="rule.id" :rule="rule" @change="sync"/>
        </div>

    </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { postJson } from '~/utils/http.mjs'
const config = ref(null)

const sync = async () => {
    const response = await postJson('/api/config/sync')
    config.value = response.config
}

onMounted(() => sync())
</script>