<script setup lang="ts">
import { ref } from 'vue'
import { useMagicKeys, useMouseInElement } from '@vueuse/core'
import CharacterIcon from '@/components/icons/CharacterIcon.vue'
import CursorIcon from '@/components/icons/CursorIcon.vue'
import ToolBar from '@/components/ToolBar.vue'
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
    // reset marquee
    marqueePosition.value.start = { x: x.value, y: y.value }
    marqueePosition.value.end = { x: x.value, y: y.value }
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

const toolbarItems = [
  { name: 'select', icon: CursorIcon, tooltip: 'Select' },
  { name: 'move', icon: CursorIcon, tooltip: 'Move' },
  { name: 'zoom', icon: CursorIcon, tooltip: 'Zoom' },
  { name: 'rotate', icon: CursorIcon, tooltip: 'Rotate' },
  { name: 'flip', icon: CursorIcon, tooltip: 'Flip' }
]

const characterData = ref({
  title: '',
  name: 'Lydia Rudwell',
  age: 17,
  occupation: 'Student'
})
</script>

<template>
  <div class="w-full h-full flex">
    <ToolBar :items="toolbarItems" v-model="toolbarData.mode" />

    <!-- Zoombar -->
    <div
      class="zoombar border border-text/25 flex flex-col gap-2 bg-background items-center rounded-md absolute z-10 top-1/2 transform -translate-y-1/2 right-2"
    >
      <button @click="zoomValue = 1">R</button>
      <button @click="zoomValue += 0.4">+</button>
      <button @click="zoomValue -= 0.4">-</button>
      <span> {{ Math.round(zoomValue * 100) }}% </span>
      <span> {{ Math.round(x) }}</span>
      <span> {{ Math.round(y) }}</span>
      <span> {{ toolbarData.mode }}</span>
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
      <div
        ref="content"
        :style="{
          top: `${contentPosition.y}px`,
          left: `${contentPosition.x}px`,
          transform: `scale(${zoomValue})`,
          transformOrigin: 'top left',
          transition: 'transform 0.1s ease-out'
        }"
        class="absolute"
      >
        <input
          type="text"
          class="border-none bg-transparent font-heading text-5xl"
          v-model="characterData.title"
          placeholder="Enter a title..."
        />
      </div>

      <!-- Marquee -->
      <div
        v-if="marqueePosition.start.x !== marqueePosition.end.x"
        class="absolute border-dashed border-2 border-text bg-text bg-opacity-10 z-10 text-xl"
        :style="{
          top: `${Math.min(marqueePosition.start.y, marqueePosition.end.y)}px`,
          left: `${Math.min(marqueePosition.start.x, marqueePosition.end.x)}px`,
          width: `${Math.abs(marqueePosition.start.x - marqueePosition.end.x)}px`,
          height: `${Math.abs(marqueePosition.start.y - marqueePosition.end.y)}px`
        }"
      ></div>
    </div>
  </div>
</template>

<style scoped>
.zoombar button {
  @apply w-8 h-8 p-2 flex items-center justify-center rounded-md hover:bg-accent/20 active:text-accent;
}

#content-window {
  background: white;
  background-image: radial-gradient(theme('colors.text'), theme('colors.background') 2px);
}
</style>
