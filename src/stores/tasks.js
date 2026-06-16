// stores/tasks.js — Store de tarefas compartilhado entre as views
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useTasksStore = defineStore('tasks', () => {
  const tasks = ref([
    { id: 1, title: 'Estudar Vue 3',          desc: 'Composition API e componentes reutilizáveis', done: true,  priority: 'alta'  },
    { id: 2, title: 'Aprender Pinia',          desc: 'Gerenciamento de estado global com stores',  done: false, priority: 'alta'  },
    { id: 3, title: 'Configurar Vue Router',   desc: 'Rotas, navigation guards e histórico',       done: false, priority: 'media' },
    { id: 4, title: 'Criar componentes',       desc: 'TaskCard e outros componentes reutilizáveis',done: true,  priority: 'media' },
    { id: 5, title: 'Integrar Vuetify',        desc: 'UI responsiva com Material Design',          done: true,  priority: 'baixa' },
    { id: 6, title: 'Fazer deploy no GitHub',  desc: 'Publicar o projeto no GitHub Pages',         done: false, priority: 'alta'  },
    { id: 7, title: 'Escrever documentação',   desc: 'README e comentários no código',             done: false, priority: 'baixa' },
  ])
  let _nextId = 8

  // ── Computed stats ──────────────────────────────────────────────
  const total      = computed(() => tasks.value.length)
  const concluidas = computed(() => tasks.value.filter(t =>  t.done).length)
  const pendentes  = computed(() => tasks.value.filter(t => !t.done).length)
  const progresso  = computed(() =>
    total.value ? Math.round(concluidas.value / total.value * 100) : 0
  )
  const recentes = computed(() => [...tasks.value].reverse().slice(0, 5))

  // ── CRUD ────────────────────────────────────────────────────────
  function add(data) {
    tasks.value.push({ ...data, id: _nextId++ })
  }
  function update(data) {
    const i = tasks.value.findIndex(t => t.id === data.id)
    if (i !== -1) tasks.value[i] = { ...data }
  }
  function remove(id) {
    tasks.value = tasks.value.filter(t => t.id !== id)
  }

  return { tasks, total, concluidas, pendentes, progresso, recentes, add, update, remove }
})
