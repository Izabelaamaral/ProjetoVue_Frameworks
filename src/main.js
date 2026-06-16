import { createApp } from 'vue'
import { createPinia, setActivePinia } from 'pinia'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'

import router from './router'
import App from './App.vue'
import { useAuthStore } from './stores/auth'

// 1. Vuetify
const vuetify = createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'light',
  },
})

// 2. Pinia — setActivePinia antes do guard para poder usar stores no router
const pinia = createPinia()
setActivePinia(pinia)

// 3. Navigation Guard (protege rotas autenticadas)
router.beforeEach((to) => {
  const auth = useAuthStore()
  if (to.meta.auth   && !auth.isAuthenticated) return '/login'
  if (to.meta.public &&  auth.isAuthenticated) return '/'
})

// 4. Criar e montar o app
createApp(App)
  .use(pinia)
  .use(router)
  .use(vuetify)
  .mount('#app')
