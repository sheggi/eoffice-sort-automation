<template>
    <div class="mt-8 gap-y-2">
        <div><em>{{ rule.name }}</em></div>
        <div>🆔 ID: {{ rule.id }}</div>
        <div class="flex">
            <span>🔣 Parse FileName:</span>
            <input v-model="edit.parseFileName" class=" bg-dark text-light flex-grow  ml-4">
        </div>
        <div class="flex">
            <span>📥 Move To:</span>
            <input v-model="edit.action.destination" class=" bg-dark text-light flex-grow  ml-4">
        </div>
        <div>🔗 Conditions:
            <div v-for="(condition, index) in edit.conditions" :key="index" class="flex m-1 ml-8 hover:ring">
                <input v-model="condition.property" class=" bg-dark text-light">:
                <input v-model="condition.regexp" class=" bg-dark text-light flex-grow ml-4">
                <button @click="removeCondition(index)" class="text-blue-500 hover:text-blue-400">🗑 remove</button>
            </div>
            <button @click="addCondition()" class="text-blue-500 hover:text-blue-400 ml-8">✳️ add</button>
        </div>
        <div v-if="changed"><button @click="save(edit)" class="text-blue-500 hover:text-blue-400">🔄 save</button></div>
        <div v-else>🕛 {{ new Date(edit.version) }}</div>
    </div>
</template>

<script setup>
import hash from 'object-hash'
import { postJson } from '~/utils/http.mjs'

const { rule } = defineProps(['rule'])
const emit = defineEmits(['change'])

const original = ref(JSON.parse(JSON.stringify(rule)))
const edit = ref(JSON.parse(JSON.stringify(rule)))

const changed = ref(false)
watch([edit, rule], () => {
    changed.value = hash(original.value) !== hash(edit.value)
}, { deep: true })

const addCondition = () => {
    edit.value.conditions.push({ "@type": "FilePattern", "regexp": "^test.*\\.txt$", "property": "name" })
}

const removeCondition = (index) => {
    edit.value.conditions.splice(index, 1)
}

const save = async (rule) => {
    const response = await postJson('/api/config/update', {rule})
    
    original.value = response.rule
    edit.value = JSON.parse(JSON.stringify(response.rule))

    emit('change')
}

</script>
