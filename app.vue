<template>
  <div class="m-4">
    <pre class=" whitespace-pre text-yellow-300">
  ____                   _          _              _                                 _           
 / ___|    ___    _ __  | |_       / \     _   _  | |_    ___    _ __ ___     __ _  | |_    __ _ 
 \___ \   / _ \  | '__| | __|     / _ \   | | | | | __|  / _ \  | '_ ` _ \   / _` | | __|  / _` |
  ___) | | (_) | | |    | |_     / ___ \  | |_| | | |_  | (_) | | | | | | | | (_| | | |_  | (_| |
 |____/   \___/  |_|     \__|   /_/   \_\  \__,_|  \__|  \___/  |_| |_| |_|  \__,_|  \__|  \__,_|
 </pre>

    <div class="actionables">
      <button @click="findActionables" class=" text-blue-500 hover:text-blue-400">refresh</button>
      <div v-if="loading">loading ...</div>
      <Actionable v-else v-for="actionable in actionables" :actionable="actionable" :key="actionable.id" />
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';

const actionables = ref([])
const loading = ref(true)

const findActionables = async () => {
  loading.value = true
  const data = await (await fetch('/api/actionables')).json()

  actionables.value = data.actionables
  loading.value = false
}

onMounted(() => {
  findActionables()
})
</script>

<style >
body {
  background-color: #173347;
  color: #cecece;
  @apply font-mono;
}
</style>