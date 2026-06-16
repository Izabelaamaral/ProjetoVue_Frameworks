# Minha App — Atividade Avaliativa 2

Aplicação Vue 3 com CRUD completo e autenticação Google simulada via Pinia.

## 🚀 Como rodar

```bash
npm install
npm run dev
```

Acesse: http://localhost:5173

## 📋 Requisitos atendidos

| Requisito | Implementação |
|---|---|
| Vue 3 + Vuetify | `main.js` com `createVuetify` |
| Vue Router | `src/router/index.js` com `createWebHashHistory` |
| Componente reutilizável | `src/components/TaskCard.vue` |
| CRUD completo (memória) | `src/views/TasksView.vue` — `ref([...])` |
| Autenticação Google | `src/stores/auth.js` — `loginWithGoogle()` |
| Estado com Pinia | `defineStore('auth', ...)` |
| Rota protegida | `router.beforeEach` em `main.js` |

## 🗂️ Estrutura

```
src/
├── main.js              # Bootstrap: Pinia + Router + Vuetify
├── App.vue              # Layout + AppBar
├── router/
│   └── index.js         # Rotas: /login, /, /tarefas
├── stores/
│   └── auth.js          # Pinia: login Google, logout, isAuthenticated
├── views/
│   ├── LoginView.vue    # Tela de login
│   ├── HomeView.vue     # Home pós-login
│   └── TasksView.vue    # CRUD de tarefas
└── components/
    └── TaskCard.vue     # Componente reutilizável de tarefa
```

## 🛠️ Tecnologias

- **Vue 3** — Composition API (`script setup`)
- **Vuetify 3** — Componentes de UI
- **Vue Router 4** — Navegação com guarda de rotas
- **Pinia** — Gerenciamento de estado (autenticação)
- **Vite** — Bundler
