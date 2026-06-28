<template>
  <v-container class="fill-height" fluid>
    <v-row justify="center" align="center" class="fill-height">
      <v-col cols="12" sm="8" md="5" lg="4">

        <div class="text-center mb-6">
          <v-icon color="primary" size="64">mdi-format-list-checks</v-icon>
          <h1 class="text-h4 font-weight-bold mt-2">Minha App</h1>
          <p class="text-body-2 text-grey">Gerenciador de tarefas pessoal</p>
        </div>

        <v-card rounded="xl" elevation="8">
          <v-card-text class="pa-6">
            <h2 class="text-h6 text-center mb-2">Acesse sua conta</h2>
            <p class="text-center text-caption text-grey mb-5">
              Use sua conta Google para continuar
            </p>

            <v-alert v-if="erro" type="error" variant="tonal" density="compact" class="mb-4">
              {{ erro }}
            </v-alert>

            <v-btn
              block
              size="large"
              variant="outlined"
              :loading="auth.loading"
              @click="login"
            >
              <template #prepend>
                <svg width="18" height="18" viewBox="0 0 24 24" style="margin-right:6px">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
              </template>
              Entrar com Google
            </v-btn>
          </v-card-text>

          <v-divider />
          <v-card-text class="text-center text-caption text-grey pa-3">
            Autenticação real via <strong>Firebase</strong> + validação no backend
          </v-card-text>
        </v-card>

      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const auth   = useAuthStore()
const router = useRouter()
const erro   = ref('')

async function login() {
  erro.value = ''
  try {
    await auth.loginWithGoogle()
    router.push('/')
  } catch (err) {
    erro.value = 'Não foi possível entrar com Google. Tente novamente.'
  }
}
</script>