import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useCounterStore = defineStore('projects', () => {
  
  const projects = ref([])

  return {projects}
})
