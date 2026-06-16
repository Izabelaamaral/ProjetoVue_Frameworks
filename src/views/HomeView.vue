<template>
  <v-container fluid class="pa-6" style="max-width:1100px">

    <!-- ── Cabeçalho de boas-vindas ──────────────────────── -->
    <v-card
      rounded="xl"
      class="mb-6 pa-6"
      style="background: linear-gradient(135deg, #1e293b 0%, #0f4c75 100%); color:white"
      elevation="4"
    >
      <div class="d-flex align-center justify-space-between flex-wrap" style="gap:16px">
        <div>
          <p class="text-caption mb-1" style="opacity:.7; text-transform:uppercase; letter-spacing:1px">
            {{ dataAtual }}
          </p>
          <h1 class="text-h4 font-weight-bold mb-1">
            Olá, {{ primeiroNome }}! 👋
          </h1>
          <p style="opacity:.8" class="text-body-1">
            Você tem
            <strong>{{ store.pendentes }} tarefa{{ store.pendentes !== 1 ? 's' : '' }} pendente{{ store.pendentes !== 1 ? 's' : '' }}</strong>
            hoje.
          </p>
        </div>
        <v-avatar size="72" style="border: 3px solid rgba(255,255,255,0.3)">
          <v-img :src="auth.user?.avatar" />
        </v-avatar>
      </div>

      <!-- Barra de progresso geral -->
      <div class="mt-5">
        <div class="d-flex justify-space-between text-body-2 mb-2" style="opacity:.9">
          <span>Progresso geral</span>
          <strong>{{ store.progresso }}%</strong>
        </div>
        <v-progress-linear
          :model-value="store.progresso"
          color="light-blue-lighten-2"
          bg-color="rgba(255,255,255,0.2)"
          rounded
          height="10"
        />
      </div>
    </v-card>

    <!-- ── Cards de estatísticas ─────────────────────────── -->
    <v-row class="mb-6">
      <v-col v-for="card in statCards" :key="card.label" cols="6" md="3">
        <v-card rounded="xl" elevation="2" height="100%">
          <v-card-text class="pa-5">
            <div class="d-flex justify-space-between align-start">
              <div>
                <p class="text-caption text-grey mb-1">{{ card.label }}</p>
                <p class="text-h3 font-weight-black" :style="{ color: card.color }">
                  {{ card.value }}
                </p>
              </div>
              <v-avatar :color="card.bgColor" size="46" rounded="lg">
                <v-icon :color="card.color" size="24">{{ card.icon }}</v-icon>
              </v-avatar>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-row>
      <!-- ── Tarefas recentes ──────────────────────────── -->
      <v-col cols="12" md="7">
        <v-card rounded="xl" elevation="2" height="100%">
          <v-card-title class="pa-5 pb-3 d-flex align-center">
            <v-icon color="primary" class="mr-2">mdi-history</v-icon>
            Tarefas Recentes
            <v-spacer />
            <v-btn size="small" variant="text" color="primary" to="/tarefas">
              Ver todas →
            </v-btn>
          </v-card-title>
          <v-divider />
          <v-list lines="two">
            <template v-for="(task, i) in store.recentes" :key="task.id">
              <v-list-item>
                <template #prepend>
                  <v-icon :color="task.done ? 'success' : 'grey-lighten-1'" size="22">
                    {{ task.done ? 'mdi-check-circle' : 'mdi-circle-outline' }}
                  </v-icon>
                </template>
                <template #title>
                  <span
                    class="text-body-2 font-weight-medium"
                    :class="{ 'text-decoration-line-through text-grey': task.done }"
                  >
                    {{ task.title }}
                  </span>
                </template>
                <template #subtitle>
                  <span class="text-caption">{{ task.desc }}</span>
                </template>
                <template #append>
                  <v-chip
                    :color="priorityColor(task.priority)"
                    size="x-small"
                    variant="tonal"
                    label
                  >
                    {{ task.priority }}
                  </v-chip>
                </template>
              </v-list-item>
              <v-divider v-if="i < store.recentes.length - 1" inset />
            </template>
          </v-list>
          <v-card-actions class="pa-4 pt-2">
            <v-btn
              color="primary"
              variant="tonal"
              prepend-icon="mdi-plus"
              rounded="lg"
              to="/tarefas"
            >
              Adicionar Tarefa
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>

      <!-- ── Painel lateral ───────────────────────────── -->
      <v-col cols="12" md="5">

        <!-- Anel de progresso -->
        <v-card rounded="xl" elevation="2" class="mb-4 text-center pa-5">
          <p class="text-subtitle-2 font-weight-bold text-grey-darken-2 mb-4">
            <v-icon size="18" class="mr-1">mdi-chart-donut</v-icon>
            Conclusão
          </p>
          <v-progress-circular
            :model-value="store.progresso"
            :size="120"
            :width="12"
            color="primary"
            class="mb-3"
          >
            <div>
              <div class="text-h5 font-weight-black">{{ store.progresso }}%</div>
              <div class="text-caption text-grey">concluído</div>
            </div>
          </v-progress-circular>
          <div class="d-flex justify-center mt-2" style="gap:16px">
            <div class="text-center">
              <div class="text-h6 font-weight-bold text-success">{{ store.concluidas }}</div>
              <div class="text-caption text-grey">Concluídas</div>
            </div>
            <v-divider vertical />
            <div class="text-center">
              <div class="text-h6 font-weight-bold text-warning">{{ store.pendentes }}</div>
              <div class="text-caption text-grey">Pendentes</div>
            </div>
          </div>
        </v-card>

        <!-- Por prioridade -->
        <v-card rounded="xl" elevation="2" class="pa-5">
          <p class="text-subtitle-2 font-weight-bold text-grey-darken-2 mb-4">
            <v-icon size="18" class="mr-1">mdi-flag-outline</v-icon>
            Por Prioridade
          </p>
          <div v-for="p in priorities" :key="p.label" class="mb-3">
            <div class="d-flex justify-space-between text-body-2 mb-1">
              <span class="d-flex align-center" style="gap:6px">
                <v-icon :color="p.color" size="14">mdi-circle</v-icon>
                {{ p.label }}
              </span>
              <strong>{{ p.count }}</strong>
            </div>
            <v-progress-linear
              :model-value="store.total ? p.count / store.total * 100 : 0"
              :color="p.color"
              rounded
              height="6"
              bg-color="grey-lighten-3"
            />
          </div>
        </v-card>
      </v-col>
    </v-row>

  </v-container>
</template>

<script setup>
import { computed } from 'vue'
import { useAuthStore }  from '../stores/auth'
import { useTasksStore } from '../stores/tasks'

const auth  = useAuthStore()
const store = useTasksStore()

const primeiroNome = computed(() => auth.user?.name?.split(' ')[0] || '')

const dataAtual = new Date().toLocaleDateString('pt-BR', {
  weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
})

const statCards = computed(() => [
  {
    label: 'Total de Tarefas', value: store.total,
    icon: 'mdi-format-list-bulleted', color: '#3b82f6', bgColor: '#eff6ff'
  },
  {
    label: 'Concluídas', value: store.concluidas,
    icon: 'mdi-check-circle', color: '#22c55e', bgColor: '#f0fdf4'
  },
  {
    label: 'Pendentes', value: store.pendentes,
    icon: 'mdi-clock-outline', color: '#f59e0b', bgColor: '#fffbeb'
  },
  {
    label: 'Progresso', value: store.progresso + '%',
    icon: 'mdi-trending-up', color: '#8b5cf6', bgColor: '#f5f3ff'
  },
])

const priorities = computed(() => [
  { label: 'Alta',  color: '#ef4444', count: store.tasks.filter(t => t.priority === 'alta').length  },
  { label: 'Média', color: '#f59e0b', count: store.tasks.filter(t => t.priority === 'media').length },
  { label: 'Baixa', color: '#22c55e', count: store.tasks.filter(t => t.priority === 'baixa').length },
])

function priorityColor(p) {
  return { alta: 'error', media: 'warning', baixa: 'success' }[p] || 'grey'
}
</script>
