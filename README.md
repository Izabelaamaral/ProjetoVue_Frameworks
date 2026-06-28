# MINHA APP

Aplicação Vue 3 com CRUD completo e autenticação Google real via Firebase + Pinia.

## COMO RODAR

```bash
npm install
npm run dev
```

Acesse: http://localhost:5173

Para o login funcionar, o backend também precisa estar rodando — veja a seção **Backend** abaixo.

## REQUISITOS IMPLEMENTADOS

| Requisito | Implementação |
|---|---|
| Vue 3 + Vuetify | `main.js` com `createVuetify` |
| Vue Router | `src/router/index.js` com `createWebHashHistory` |
| Componente reutilizável | `src/components/TaskCard.vue` |
| CRUD completo (memória) | `src/stores/tasks.js` — `ref([...])` |
| Autenticação Google | `src/firebase.js` + `signInWithPopup` |
| Estado com Pinia | `src/stores/auth.js` — `defineStore('auth', ...)` |
| Rota protegida | `router.beforeEach` em `main.js` |
| Validação do token no backend | `server/index.js` — `firebase-admin.verifyIdToken()` |

## ESTRUTURA

```
src/
├── main.js              # Bootstrap: Pinia + Router + Vuetify
├── firebase.js          # Configuração do Firebase
├── App.vue              # Layout + AppBar + Sidebar
├── router/
│   └── index.js         # Rotas: /login, /, /tarefas
├── stores/
│   ├── auth.js          # Pinia: login Google real, logout, isAuthenticated
│   └── tasks.js         # Pinia: CRUD de tarefas em memória
├── views/
│   ├── LoginView.vue    # Tela de login
│   ├── HomeView.vue     # Home pós-login
│   └── TasksView.vue    # CRUD de tarefas
└── components/
    └── TaskCard.vue     # Componente reutilizável de tarefa

server/                  # Backend: valida o token do Google
├── index.js
└── firebase-admin.js
```

## BACKEND

O backend valida o token do Google usando o SDK Admin do Firebase. Ele precisa de uma chave privada (`server/key.json`) que **não está no repositório** por segurança.

Para rodar:
1. No [Firebase Console](https://console.firebase.google.com), vá em **Configurações do projeto → Contas de serviço → Gerar nova chave privada**
2. Salve o arquivo baixado como `server/key.json`
3. Rode:
```bash
   cd server
   npm install
   npm run dev
```

## TECNOLOGIAS

- **Vue 3** — Composition API (`script setup`)
- **Vuetify 3** — Componentes de UI
- **Vue Router 4** — Navegação com guarda de rotas
- **Pinia** — Gerenciamento de estado (autenticação e tarefas)
- **Firebase Authentication** — Login real com Google
- **Express + firebase-admin** — Backend que valida o token
- **Vite** — Bundler