<script setup lang="ts">
import { ref } from 'vue'

const sidebarItems = ref([
  { title: 'Characters', name: 'characters' },
  { title: 'Timelines', name: 'timelines' },
  { title: 'About', name: 'about' }
])
</script>

<template>
  <nav class="bg-secondary font-heading flex flex-col gap-4">
    <div class="bg-background">
      <router-link
        v-for="item in sidebarItems"
        :key="item.title"
        class="p-2 flex gap-2 hover:bg-accent/10"
        :to="item.name"
      >
        <div class="w-8 h-8 bg-accent/20 rounded"></div>
        <span class="inline-flex items-center">{{ item.title }}</span>
      </router-link>
    </div>
  </nav>
</template>

<style scoped></style>
