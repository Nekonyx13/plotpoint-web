<script setup lang="ts">
import type { Component } from 'vue'

const props = defineProps<{
  items: Array<{ name: string; icon: Component; tooltip?: string; action?: () => void }>
}>()

const mode = defineModel<string>()

function handleClick(item: { action?: () => void; name: string }) {
  if (item.action) item.action()
  else mode.value = item.name
}
</script>

<template>
  <div class="p-2 h-full bg-background flex flex-col gap-2 border-r border-text/25">
    <div
      v-for="item in props.items"
      :key="item.name"
      class="w-8 h-8 p-2 rounded hover:bg-text/10 cursor-pointer"
      :class="{ 'bg-secondary/20 text-secondary': item.name === mode }"
      @click="handleClick(item)"
      :title="item.tooltip"
    >
      <component :is="item.icon" :title="item.tooltip" class="w-full h-full" />
    </div>
  </div>
</template>

<style scoped>
/* Your component styles go here */
</style>
