<template>
    <div class="actionable font-mono mt-8
    ">
        <div v-html="`# ${props.actionable.name}`"></div>
        <div v-html="props.actionable.description"></div>
        <div v-if="result" :class="{ ' text-green-600': status === 'success', 'text-red-800': status === 'error' }">&gt;
            {{
                    result
            }}
            <div v-if="status === 'error'">
                <button @click="confirm" class="text-blue-500 hover:text-blue-400">retry</button>
            </div>
        </div>
        <div v-else>?
            <button @click="confirm" class="text-blue-500 hover:text-blue-400">yes</button>
            or
            <button @click="decline" class="text-blue-500 hover:text-blue-400">no</button>
        </div>
    </div>
</template>

<script setup>
const props = defineProps(['actionable'])
const result = ref(null)
const status = ref(null)

const confirm = async () => {
    try {
        const response = await fetch('/api/action', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(props.actionable),
        })
        result.value = await response.json()
        status.value = response.status === 200 ? 'success' : 'error'
    } catch (error) {
        result.value = error
    }
}

const decline = () => {
    result.value = 'none'
}
</script>

