// stores/auth.js — PARTE 2: Autenticação Google com Pinia
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  // Estado
  const user    = ref(null)
  const loading = ref(false)

  // Computed
  const isAuthenticated = computed(() => user.value !== null)

  // Actions
  async function loginWithGoogle(email) {
    loading.value = true
    // Simula latência do OAuth do Google
    await new Promise(r => setTimeout(r, 1000))

    const raw  = email.split('@')[0].replace(/[._\-]/g, ' ')
    const name = raw.split(' ')
      .map(w => w ? w[0].toUpperCase() + w.slice(1) : '')
      .join(' ')
      .trim()

    user.value = {
      email,
      name,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=1976D2&color=fff&size=128`,
    }
    loading.value = false
  }

  function logout() {
    user.value = null
  }

  return { user, loading, isAuthenticated, loginWithGoogle, logout }
})
