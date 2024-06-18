<script setup lang="ts">
import { ref } from 'vue'
import { useMagicKeys, useMouseInElement } from '@vueuse/core'
import CharacterIcon from '@/components/icons/CharacterIcon.vue'
import CursorIcon from '@/components/icons/CursorIcon.vue'
import type ToolbarData from '@/types/ToolbarData'

const contentWindow = ref<HTMLElement | null>(null)
const content = ref<HTMLElement | null>(null)
const { elementX: x, elementY: y } = useMouseInElement(contentWindow)

const toolbarData = ref<ToolbarData>({
  mode: 'select',
  zoom: 1,
  dragStart: { x: 0, y: 0 },
  dragEnd: { x: 0, y: 0 },
  dragging: false
})

const dragStartContentPosition = ref({ x: 0, y: 0 })
const contentPosition = ref({ x: 0, y: 0 })

const marqueePosition = ref({ start: { x: 0, y: 0 }, end: { x: 0, y: 0 } })

const zoomValue = ref(toolbarData.value.zoom)
const { space } = useMagicKeys()

function handleZoom(e: WheelEvent) {
  if (!e.ctrlKey) return
  e.preventDefault()
  if (e.deltaY > 0) {
    zoomValue.value -= 0.1
  } else {
    zoomValue.value += 0.2
  }
}

function handleMouseDown() {
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

function handleMouseMove() {
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
  <div class="w-full h-full flex">
    <!-- Sidebar -->
    <div class="sidebar p-2 h-full bg-accent/20 flex flex-col gap-2">
      +
      <div
        v-for="i in 10"
        :key="i"
        class="w-8 h-8 p-[0.4rem] bg-accent/30 rounded flex items-center justify-center"
      >
        <CursorIcon class="w-full h-full text-text" />
      </div>
    </div>

    <!-- Zoombar on the right side-->
    <div
      class="toolbar flex flex-col gap-2 bg-accent/20 rounded p-2 absolute z-10 top-1/2 transform -translate-y-1/2 right-2"
    >
      <button @click="zoomValue = 1">R</button>
      <button @click="zoomValue += 0.4">+</button>
      <button @click="zoomValue -= 0.4">-</button>
      <span> {{ Math.round(zoomValue * 100) }}% </span>
      <span> {{ Math.round(x) }}</span>
      <span> {{ Math.round(y) }}</span>
    </div>

    <div
      ref="contentWindow"
      class="w-full h-full bg-white overflow-auto relative flex-1"
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
      <!-- Marquee -->
      <div
        class="absolute border-dashed border-2 border-text bg-text bg-opacity-10 z-10 text-xl"
        :style="{
          top: `${Math.min(marqueePosition.start.y, marqueePosition.end.y)}px`,
          left: `${Math.min(marqueePosition.start.x, marqueePosition.end.x)}px`,
          width: `${Math.abs(marqueePosition.start.x - marqueePosition.end.x)}px`,
          height: `${Math.abs(marqueePosition.start.y - marqueePosition.end.y)}px`
        }"
      ></div>

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
