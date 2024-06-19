<script setup lang="ts">
import { ref } from 'vue'
import ChracterIcon from './icons/CharacterIcon.vue'
import { usePreferenceStore } from '@/stores/preferences'
import { storeToRefs } from 'pinia'

const preferenceStore = usePreferenceStore()
const { theme } = storeToRefs(preferenceStore)

const sidebarItems = ref([
  { title: 'Characters', name: 'characters' },
  { title: 'Timelines', name: 'timelines' },
  { title: 'About', name: 'about' }
])
</script>

<template>
  <div class="font-heading flex flex-col gap-4 border-r border-text/25 p-2 text-text/75">
    <nav class="flex flex-col">
      <router-link class="nav-link" :to="{ name: 'home' }">
        <div class="nav-icon">
          <ChracterIcon class="w-full h-full" />
        </div>
        <span class="inline-flex items-center">Home</span>
      </router-link>

      <router-link v-for="item in sidebarItems" :key="item.title" class="nav-link" :to="item.name">
        <div class="nav-icon">
          <ChracterIcon class="w-full h-full" />
        </div>
        <span class="inline-flex items-center">{{ item.title }}</span>
      </router-link>
    </nav>

    <select v-model="theme">
      <option v-for="t in preferenceStore.THEMES" :value="t" :key="t">
        {{ t.charAt(0).toUpperCase() + t.slice(1) }}
      </option>
    </select>
  </div>
</template>

<style scoped>
.nav-link {
  @apply flex gap-2 py-2 pr-4 hover:bg-text/10 rounded transition-colors;
}

.router-link-active {
  @apply bg-primary/20 text-text hover:bg-primary/20;
}

.router-link-active .nav-icon {
  @apply text-primary;
}

.nav-icon {
  @apply w-8 h-8 p-1;
}
</style>
