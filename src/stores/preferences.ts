import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export const usePreferenceStore = defineStore('preferences', () => {
  const THEMES = ref(['light', 'dark'])
  const theme = ref<string>(localStorage.getItem('theme') || 'light')

  watch(theme, (newTheme) => {
    localStorage.setItem('theme', newTheme)
    // add a class to the body to change the theme
    document.body.className = newTheme
  })

  return {
    THEMES,
    theme
  }
})
