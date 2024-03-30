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
  <div class="font-heading flex flex-col gap-4 border-r-2 border-text/10">
    <nav>
      <div class="bg-background">
        <router-link class="p-2 flex gap-2 hover:bg-accent/10" :to="{ name: 'home' }">
          <div
            class="w-10 h-10 bg-background border-text/10 border-2 rounded flex items-center justify-center"
          >
            Home
          </div>
        </router-link>

        <router-link
          v-for="item in sidebarItems"
          :key="item.title"
          class="px-2 py-1 flex gap-2 hover:bg-accent/10"
          :to="item.name"
        >
          <div
            class="w-10 h-10 bg-background border-text/10 border-2 rounded flex items-center justify-center"
          >
            <ChracterIcon class="w-6 h-6 text-primary" />
          </div>
          <span class="inline-flex items-center">{{ item.title }}</span>
        </router-link>
      </div>
    </nav>

    <select v-model="theme" class="w-1/3">
      <option v-for="t in preferenceStore.THEMES" :value="t" :key="t">
        {{ t.charAt(0).toUpperCase() + t.slice(1) }}
      </option>
    </select>
  </div>
</template>

<style scoped></style>
