<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useMagicKeys, useMouseInElement } from '@vueuse/core'
import CharacterIcon from '@/components/icons/CharacterIcon.vue'

const contentWindow = ref<HTMLElement | null>(null)
const content = ref<HTMLElement | null>(null)
const { elementX: x, elementY: y } = useMouseInElement(contentWindow)

const toolbarData = ref({
  mode: 'select',
  zoom: 1,
  dragStart: { x: 0, y: 0 },
  dragEnd: { x: 0, y: 0 },
  dragging: false
})

const dragStartContentPosition = ref({ x: 0, y: 0 })
const contentPosition = ref({ x: 0, y: 0 })

const marqueePosition = ref({ start: { x: 0, y: 0 }, end: { x: 0, y: 0 } })

// deconstructing the toolbarData object
const zoomValue = ref(toolbarData.value.zoom)
const { space, a } = useMagicKeys()

function handleZoom(e: WheelEvent) {
  if (!e.ctrlKey) return
  e.preventDefault()
  if (e.deltaY > 0) {
    zoomValue.value -= 0.1
  } else {
    zoomValue.value += 0.2
  }
}

function handleMouseDown(e: MouseEvent) {
  toolbarData.value.dragging = true
  toolbarData.value.dragStart = { x: x.value, y: y.value }

  if (space.value) {
    dragStartContentPosition.value = { x: contentPosition.value.x, y: contentPosition.value.y }
  } else {
    marqueePosition.value.start = { x: x.value, y: y.value }
  }
}

function handleMouseUp() {
  toolbarData.value.dragging = false
}

function handleMouseMove(e: MouseEvent) {
  if (!toolbarData.value.dragging) return

  if (space.value) {
    const deltaX = x.value - toolbarData.value.dragStart.x
    const deltaY = y.value - toolbarData.value.dragStart.y
    console.log('delta', deltaX, deltaY)

    contentPosition.value.x = dragStartContentPosition.value.x + deltaX
    contentPosition.value.y = dragStartContentPosition.value.y + deltaY
  } else {
    marqueePosition.value.end = { x: x.value, y: y.value }
  }
}
</script>

<template>
  <div
    ref="contentWindow"
    class="w-full h-full bg-white overflow-auto relative"
    :class="{ 'cursor-grab': space }"
    :style="{
      backgroundSize: `${zoomValue * 100}px ${zoomValue * 100}px`,
      transition: 'background-size 0.1s ease-out'
    }"
    id="content-window"
    @wheel="handleZoom"
    @mousedown="handleMouseDown"
    @mouseup="handleMouseUp"
    @mousemove="handleMouseMove"
  >
    <!-- Toolbar -->
    <div
      class="toolbar flex flex-col gap-2 bg-accent/20 rounded p-2 absolute z-10 top-1/2 transform -translate-y-1/2"
    >
      <button @click="zoomValue = 1">R</button>
      <button @click="zoomValue += 0.4">+</button>
      <button @click="zoomValue -= 0.4">-</button>
      <span> {{ Math.round(zoomValue * 100) }}% </span>
      <span> {{ Math.round(x) }}, {{ Math.round(y) }} </span>
    </div>

    <!-- Marquee -->
    <textarea
      class="absolute border-dashed border-2 border-black bg-black bg-opacity-10 z-10 text-xl"
      :style="{
        top: `${Math.min(marqueePosition.start.y, marqueePosition.end.y)}px`,
        left: `${Math.min(marqueePosition.start.x, marqueePosition.end.x)}px`,
        width: `${Math.abs(marqueePosition.start.x - marqueePosition.end.x)}px`,
        height: `${Math.abs(marqueePosition.start.y - marqueePosition.end.y)}px`
      }"
    ></textarea>

    <div
      ref="content"
      :style="{
        top: `${contentPosition.y}px`,
        left: `${contentPosition.x}px`,
        transform: `scale(${zoomValue})`,
        transformOrigin: 'top left',
        transition: 'transform 0.1s ease-out'
      }"
      class="absolute bg-gray-300"
    >
      <CharacterIcon class="w-32 h-32 text-primary" />
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
