<script setup lang="ts">
import NavBar from './components/NavBar.vue'
</script>

<template>
  <div class="flex h-screen">
    <header>
      <NavBar class="h-full" />
    </header>
    <main class="flex-1 overflow-auto">
      <router-view />
    </main>
  </div>
</template>

<style scoped></style>
