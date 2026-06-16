<template>
  <v-app>

    <!-- ═══════════════ SIDEBAR ═══════════════ -->
    <v-navigation-drawer
      v-if="auth.isAuthenticated"
      :rail="rail"
      permanent
      color="#1e293b"
    >
      <!-- Brand / Toggle -->
      <v-list-item
        prepend-icon="mdi-check-circle-outline"
        title="Minha App"
        nav
        class="py-4"
        style="color:white"
      >
        <template #append>
          <v-btn
            :icon="rail ? 'mdi-chevron-right' : 'mdi-chevron-left'"
            variant="text"
            size="small"
            style="color:rgba(255,255,255,0.6)"
            @click.stop="rail = !rail"
          />
        </template>
      </v-list-item>

      <v-divider style="border-color:rgba(255,255,255,0.1)" />

      <!-- Links de navegação -->
      <v-list density="compact" nav class="mt-2">
        <v-list-item
          v-for="item in navItems"
          :key="item.to"
          :prepend-icon="item.icon"
          :title="item.title"
          :to="item.to"
          :exact="item.exact"
          rounded="lg"
          class="mb-1"
          style="color:rgba(255,255,255,0.75)"
          active-color="#38bdf8"
        />
      </v-list>

      <!-- Usuário + Sair (rodapé) -->
      <template #append>
        <v-divider style="border-color:rgba(255,255,255,0.1)" />
        <v-list density="compact" nav class="py-3">
          <v-list-item
            :title="auth.user?.name"
            :subtitle="!rail ? auth.user?.email : undefined"
            nav
            style="color:rgba(255,255,255,0.75)"
          >
            <template #prepend>
              <v-avatar size="32">
                <v-img :src="auth.user?.avatar" />
              </v-avatar>
            </template>
          </v-list-item>
          <v-list-item
            prepend-icon="mdi-logout"
            title="Sair"
            rounded="lg"
            style="color:#f87171"
            @click="logout"
          />
        </v-list>
      </template>
    </v-navigation-drawer>

    <!-- ═══════════════ APP BAR ═══════════════ -->
    <v-app-bar v-if="auth.isAuthenticated" elevation="0" border="b" color="white">
      <v-app-bar-nav-icon color="grey-darken-1" @click="rail = !rail" />

      <v-app-bar-title>
        <span class="font-weight-bold text-grey-darken-3">{{ currentTitle }}</span>
      </v-app-bar-title>

      <v-spacer />

      <!-- Data atual -->
      <span class="text-caption text-grey mr-4 d-none d-md-inline">
        {{ dataAtual }}
      </span>

      <!-- Avatar com menu rápido -->
      <v-menu location="bottom end">
        <template #activator="{ props }">
          <v-btn v-bind="props" variant="text" class="mr-2 pa-1">
            <v-avatar size="34">
              <v-img :src="auth.user?.avatar" />
            </v-avatar>
            <span class="ml-2 text-body-2 font-weight-medium d-none d-sm-inline">
              {{ auth.user?.name?.split(' ')[0] }}
            </span>
          </v-btn>
        </template>
        <v-list rounded="xl" elevation="8" min-width="220" class="pa-1">
          <v-list-item class="mb-1">
            <template #prepend>
              <v-avatar size="42">
                <v-img :src="auth.user?.avatar" />
              </v-avatar>
            </template>
            <v-list-item-title class="font-weight-bold">{{ auth.user?.name }}</v-list-item-title>
            <v-list-item-subtitle class="text-caption">{{ auth.user?.email }}</v-list-item-subtitle>
          </v-list-item>
          <v-divider class="my-1" />
          <v-list-item prepend-icon="mdi-logout" title="Sair" color="error" rounded="lg" @click="logout" />
        </v-list>
      </v-menu>
    </v-app-bar>

    <!-- ═══════════════ CONTEÚDO ═══════════════ -->
    <v-main>
      <router-view />
    </v-main>

  </v-app>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAuthStore } from './stores/auth'
import { useRouter, useRoute } from 'vue-router'

const auth   = useAuthStore()
const router = useRouter()
const route  = useRoute()

// Sidebar começa em modo rail (compacto — só ícones)
const rail = ref(true)

const navItems = [
  { title: 'Home',    icon: 'mdi-home-outline',          to: '/',        exact: true  },
  { title: 'Tarefas', icon: 'mdi-format-list-checks',    to: '/tarefas', exact: false },
]

const pageTitles = { '/': 'Home', '/tarefas': 'Minhas Tarefas' }
const currentTitle = computed(() => pageTitles[route.path] || 'Minha App')

const dataAtual = new Date().toLocaleDateString('pt-BR', {
  weekday: 'long', day: 'numeric', month: 'long'
})

function logout() {
  auth.logout()
  router.push('/login')
}
</script>
