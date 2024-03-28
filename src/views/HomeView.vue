<script setup lang="ts">
import { onMounted, ref } from 'vue'

const zoomValue = ref(1)

onMounted(() => {
  // on mouse wheel event zoom in/out
  window.addEventListener('wheel', (e) => {
    e.preventDefault()
    zoomValue.value += e.deltaY > 0 ? -0.1 : 0.1
  })
})
</script>

<template>
  <h1 class="">Hello World!</h1>
  <p class="text-lg">This is the home view.</p>
  <p class="text-base">
    Lorem ipsum dolor sit amet, consectetur adipiscing elit sed do eiusmod tempor incididunt ut
    labore et dolore magna aliqua.
  </p>

  <div class="w-[600px] h-[400px] bg-gray-200 rounded-lg shadow-lg overflow-auto">
    <div
      :style="{ transform: `scale(${zoomValue})`, transformOrigin: 'top left' }"
      class="bg-gray-300"
    >
      <p class="text-lg">Zoom me!</p>
      <input v-model="zoomValue" type="range" min="0.5" max="2" step="0.1" class="" />
      <input type="text" class="w-20" />
      <textarea class="w-20 h-20"></textarea>
    </div>
  </div>
</template>
