// src/stores/userStore.js
import { ref, computed } from 'vue'

const user = ref(JSON.parse(localStorage.getItem('user')))

export function useUserStore() {
  const isAdmin = computed(() => user.value && user.value.role === 'admin')

  function setUser(newUser) {
    user.value = newUser
    if (newUser) {
      localStorage.setItem('user', JSON.stringify(newUser))
    } else {
      localStorage.removeItem('user')
      localStorage.removeItem('token')
    }
  }

  return { user, isAdmin, setUser }
}
