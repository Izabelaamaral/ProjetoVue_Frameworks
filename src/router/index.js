// router/index.js — PARTE 1: Vue Router com rotas protegidas
import { createRouter, createWebHashHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import HomeView  from '../views/HomeView.vue'
import TasksView from '../views/TasksView.vue'

const routes = [
  { path: '/login',   component: LoginView, meta: { public: true } },
  { path: '/',        component: HomeView,  meta: { auth: true   } },
  { path: '/tarefas', component: TasksView, meta: { auth: true   } },
  { path: '/:pathMatch(.*)*', redirect: '/' },
]

export default createRouter({
  history: createWebHashHistory(),
  routes,
})
