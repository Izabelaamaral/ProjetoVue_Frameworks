<template>
  <v-container fluid class="pa-6" style="max-width:900px">

    <!-- ── Cabeçalho ──────────────────────────────────── -->
    <div class="d-flex align-center flex-wrap mb-5" style="gap:12px">
      <div>
        <h1 class="text-h5 font-weight-black">Minhas Tarefas</h1>
        <p class="text-body-2 text-grey mt-1">
          {{ filtradas.length }} tarefa{{ filtradas.length !== 1 ? 's' : '' }} encontrada{{ filtradas.length !== 1 ? 's' : '' }}
        </p>
      </div>
      <v-spacer />
      <v-btn
        color="primary"
        prepend-icon="mdi-plus"
        rounded="lg"
        @click="abrirCriacao"
      >
        Nova Tarefa
      </v-btn>
    </div>

    <!-- ── Cards de resumo ────────────────────────────── -->
    <v-row class="mb-4">
      <v-col cols="4">
        <v-card rounded="lg" variant="tonal" color="primary" class="text-center pa-3">
          <div class="text-h5 font-weight-black">{{ store.total }}</div>
          <div class="text-caption">Total</div>
        </v-card>
      </v-col>
      <v-col cols="4">
        <v-card rounded="lg" variant="tonal" color="success" class="text-center pa-3">
          <div class="text-h5 font-weight-black">{{ store.concluidas }}</div>
          <div class="text-caption">Concluídas</div>
        </v-card>
      </v-col>
      <v-col cols="4">
        <v-card rounded="lg" variant="tonal" color="warning" class="text-center pa-3">
          <div class="text-h5 font-weight-black">{{ store.pendentes }}</div>
          <div class="text-caption">Pendentes</div>
        </v-card>
      </v-col>
    </v-row>

    <!-- ── Barra de busca + filtros ───────────────────── -->
    <v-card rounded="xl" elevation="1" class="mb-4 pa-4">
      <v-text-field
        v-model="busca"
        placeholder="Buscar tarefas..."
        prepend-inner-icon="mdi-magnify"
        variant="outlined"
        density="compact"
        hide-details
        clearable
        class="mb-3"
      />

      <!-- Filtros por status -->
      <div class="d-flex flex-wrap align-center" style="gap:8px">
        <span class="text-caption text-grey mr-1">Filtrar:</span>
        <v-chip
          v-for="f in filtros"
          :key="f.value"
          :color="filtroAtivo === f.value ? 'primary' : undefined"
          :variant="filtroAtivo === f.value ? 'flat' : 'outlined'"
          size="small"
          rounded="lg"
          style="cursor:pointer"
          @click="filtroAtivo = f.value"
        >
          {{ f.label }}
          <span class="ml-1 font-weight-bold">({{ f.count }})</span>
        </v-chip>

        <v-spacer />

        <!-- Ordenação -->
        <v-select
          v-model="ordem"
          :items="ordens"
          item-title="label"
          item-value="value"
          variant="outlined"
          density="compact"
          hide-details
          style="max-width:160px"
        />
      </div>
    </v-card>

    <!-- ── Lista de tarefas ────────────────────────────── -->
    <task-card
      v-for="task in filtradas"
      :key="task.id"
      :task="task"
      @edit="abrirEdicao"
      @delete="excluir"
      @toggle="toggleDone"
    />

    <!-- Estado vazio -->
    <v-card v-if="filtradas.length === 0" rounded="xl" elevation="1" class="text-center pa-10">
      <v-icon size="72" color="grey-lighten-2" class="mb-3">mdi-clipboard-text-search-outline</v-icon>
      <h3 class="text-h6 text-grey-darken-1">Nenhuma tarefa encontrada</h3>
      <p class="text-body-2 text-grey mt-1 mb-5">
        {{ busca ? 'Tente um termo de busca diferente.' : 'Clique em "Nova Tarefa" para começar!' }}
      </p>
      <v-btn color="primary" prepend-icon="mdi-plus" rounded="lg" @click="abrirCriacao">
        Nova Tarefa
      </v-btn>
    </v-card>

    <!-- ═══════════ DIALOG: Criar / Editar ═══════════ -->
    <v-dialog v-model="dialog" max-width="500" persistent>
      <v-card rounded="xl">
        <v-card-title class="pa-5 pb-3 d-flex align-center">
          <v-icon :color="editando ? 'primary' : 'success'" class="mr-2">
            {{ editando ? 'mdi-pencil' : 'mdi-plus-circle' }}
          </v-icon>
          {{ editando ? 'Editar Tarefa' : 'Nova Tarefa' }}
        </v-card-title>

        <v-card-text class="pa-5 pt-2">
          <v-form ref="formRef">
            <v-text-field
              v-model="form.title"
              label="Título *"
              prepend-inner-icon="mdi-format-title"
              variant="outlined"
              :rules="[v => !!v || 'Título obrigatório']"
              class="mb-3"
            />
            <v-textarea
              v-model="form.desc"
              label="Descrição (opcional)"
              prepend-inner-icon="mdi-text"
              variant="outlined"
              rows="2"
              auto-grow
              class="mb-3"
            />

            <v-row>
              <v-col cols="6">
                <v-select
                  v-model="form.priority"
                  :items="[
                    { title: '🔴 Alta',  value: 'alta'  },
                    { title: '🟡 Média', value: 'media' },
                    { title: '🟢 Baixa', value: 'baixa' },
                  ]"
                  item-title="title"
                  item-value="value"
                  label="Prioridade *"
                  variant="outlined"
                  :rules="[v => !!v || 'Obrigatório']"
                />
              </v-col>
              <v-col cols="6" class="d-flex align-center">
                <v-checkbox
                  v-model="form.done"
                  label="Concluída"
                  color="success"
                  hide-details
                />
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>

        <v-divider />
        <v-card-actions class="pa-4">
          <v-spacer />
          <v-btn variant="text" @click="dialog = false">Cancelar</v-btn>
          <v-btn color="primary" variant="flat" rounded="lg" @click="salvar">
            {{ editando ? 'Salvar Alterações' : 'Adicionar' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Snackbar -->
    <v-snackbar v-model="snack.show" :color="snack.color" timeout="2000" location="bottom right" rounded="pill">
      <v-icon start>{{ snack.icon }}</v-icon>
      {{ snack.msg }}
    </v-snackbar>

  </v-container>
</template>

<script setup>
import { ref, computed } from 'vue'
import TaskCard from '../components/TaskCard.vue'
import { useTasksStore } from '../stores/tasks'

const store = useTasksStore()

// ── Busca e Filtros ─────────────────────────────────────────
const busca       = ref('')
const filtroAtivo = ref('todas')
const ordem       = ref('padrao')

const filtros = computed(() => [
  { label: 'Todas',      value: 'todas',      count: store.total      },
  { label: 'Pendentes',  value: 'pendentes',  count: store.pendentes  },
  { label: 'Concluídas', value: 'concluidas', count: store.concluidas },
])

const ordens = [
  { label: 'Padrão',      value: 'padrao'    },
  { label: 'A → Z',       value: 'az'        },
  { label: 'Prioridade',  value: 'prioridade'},
]

const prioOrdem = { alta: 0, media: 1, baixa: 2 }

const filtradas = computed(() => {
  let lista = store.tasks.filter(t => {
    const q   = busca.value.toLowerCase()
    const okQ = !q || t.title.toLowerCase().includes(q) || t.desc?.toLowerCase().includes(q)
    const okF = filtroAtivo.value === 'todas'
      || (filtroAtivo.value === 'pendentes'  && !t.done)
      || (filtroAtivo.value === 'concluidas' &&  t.done)
    return okQ && okF
  })
  if (ordem.value === 'az')
    lista = [...lista].sort((a, b) => a.title.localeCompare(b.title))
  if (ordem.value === 'prioridade')
    lista = [...lista].sort((a, b) => (prioOrdem[a.priority] ?? 9) - (prioOrdem[b.priority] ?? 9))
  return lista
})

// ── Dialog ──────────────────────────────────────────────────
const dialog  = ref(false)
const editando = ref(false)
const formRef  = ref(null)
const form = ref({ title: '', desc: '', priority: 'media', done: false })

const snack = ref({ show: false, msg: '', color: 'success', icon: 'mdi-check' })
function notify(msg, color = 'success', icon = 'mdi-check-circle') {
  snack.value = { show: true, msg, color, icon }
}

function abrirCriacao() {
  editando.value = false
  form.value = { title: '', desc: '', priority: 'media', done: false }
  dialog.value  = true
}
function abrirEdicao(task) {
  editando.value = true
  form.value = { ...task }
  dialog.value  = true
}

async function salvar() {
  const { valid } = await formRef.value.validate()
  if (!valid) return
  if (editando.value) {
    store.update({ ...form.value })
    notify('Tarefa atualizada!', 'primary', 'mdi-pencil')
  } else {
    store.add({ ...form.value })
    notify('Tarefa adicionada!', 'success', 'mdi-check-circle')
  }
  dialog.value = false
}

function excluir(id) {
  store.remove(id)
  notify('Tarefa excluída!', 'error', 'mdi-delete')
}

function toggleDone(task) {
  store.update({ ...task, done: !task.done })
}
</script>
