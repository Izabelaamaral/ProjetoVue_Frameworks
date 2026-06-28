import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import {
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
} from 'firebase/auth'
import { auth, googleProvider } from '../firebase'

const BACKEND_URL = 'http://localhost:3001'

export const useAuthStore = defineStore('auth', () => {
  const user    = ref(null)
  const loading = ref(false)
  const idToken = ref(null)

  const isAuthenticated = computed(() => user.value !== null)

  onAuthStateChanged(auth, async (firebaseUser) => {
    if (firebaseUser) {
      user.value = {
        name:   firebaseUser.displayName,
        email:  firebaseUser.email,
        avatar: firebaseUser.photoURL,
        uid:    firebaseUser.uid,
      }
      idToken.value = await firebaseUser.getIdToken()
    } else {
      user.value = null
      idToken.value = null
    }
  })

  async function loginWithGoogle() {
    loading.value = true
    try {
      const result = await signInWithPopup(auth, googleProvider)
      idToken.value = await result.user.getIdToken()

      // Envia o token para o backend validar (Passo 4)
      await enviarTokenParaBackend(idToken.value)
    } catch (err) {
      console.error('Erro no login com Google:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function enviarTokenParaBackend(token) {
    try {
      const res = await fetch(`${BACKEND_URL}/api/auth/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken: token }),
      })
      const data = await res.json()
      console.log('✅ Backend validou o token:', data)
    } catch (err) {
      console.warn('⚠️ Backend não respondeu. Ele está rodando? (npm run dev na pasta server)', err)
    }
  }

  function logout() {
    firebaseSignOut(auth)
  }

  return { user, loading, idToken, isAuthenticated, loginWithGoogle, logout }
})