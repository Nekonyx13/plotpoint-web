<script setup lang="ts">
import { onMounted, ref } from 'vue'

const toolbarData = {
  mode: 'select',
  zoom: 1
}

const zoomValue = ref(toolbarData.zoom)

const contentWindow = ref<HTMLElement | null>(null)
const content = ref<HTMLElement | null>(null)

function handleZoom(e: WheelEvent) {
  if (!e.ctrlKey) return
  e.preventDefault()
  if (e.deltaY > 0) {
    zoomValue.value -= Math.min(0.1, Math.pow(zoomValue.value, 2) * 0.1)
  } else {
    zoomValue.value += 0.1
  }
}
</script>

<template>
  <div
    ref="content-window"
    class="w-full h-full bg-white overflow-auto relative"
    :style="{
      backgroundSize: `${zoomValue * 64}px ${zoomValue * 64}px`
    }"
    id="content-window"
    @wheel="handleZoom"
  >
    <!-- Toolbar -->
    <div
      class="toolbar flex flex-col gap-2 bg-accent/20 rounded p-2 absolute z-10 top-1/2 transform -translate-y-1/2"
    >
      <button @click="zoomValue = 1">R</button>
      <button @click="zoomValue += 0.4">+</button>
      <button @click="zoomValue -= 0.4">-</button>
      <span> {{ zoomValue }} </span>
    </div>

    <div
      ref="content"
      :style="{
        transform: `scale(${zoomValue})`,
        transformOrigin: 'top left',
        transition: 'transform 0.1s ease-out'
      }"
      class="bg-gray-300"
    >
      <p class="text-lg">Zoom me!</p>
      <input v-model="zoomValue" type="range" min="0.5" max="2" step="0.1" class="" />
      <input type="text" class="w-20" />
      <textarea class="w-20 h-20"></textarea>
    </div>
  </div>
</template>

<style scoped>
.toolbar button {
  @apply w-8 h-8 flex items-center justify-center rounded bg-accent text-white;
}

#content-window {
  background: white;
  background-image: radial-gradient(theme('colors.text'), theme('colors.background') 2px);
}
</style>
