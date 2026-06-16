<template>
  <v-card rounded="xl" elevation="2" class="mb-3 task-card" :class="{ 'opacity-60': task.done }">
    <v-card-item class="py-4">

      <!-- Checkbox de conclusão -->
      <template #prepend>
        <v-btn
          :icon="task.done ? 'mdi-check-circle' : 'mdi-circle-outline'"
          :color="task.done ? 'success' : 'grey-lighten-2'"
          variant="text"
          size="small"
          @click="$emit('toggle', task)"
        />
      </template>

      <!-- Título e descrição -->
      <v-card-title
        class="text-body-1 font-weight-bold pa-0"
        :class="{ 'text-decoration-line-through text-grey': task.done }"
        style="white-space:normal"
      >
        {{ task.title }}
      </v-card-title>
      <v-card-subtitle v-if="task.desc" class="pa-0 mt-1">
        {{ task.desc }}
      </v-card-subtitle>

      <!-- Chips + Ações -->
      <template #append>
        <div class="d-flex align-center" style="gap:8px">
          <!-- Prioridade -->
          <v-chip
            :color="priorityColor"
            size="x-small"
            variant="tonal"
            label
            class="d-none d-sm-inline-flex"
          >
            <v-icon start size="10">mdi-flag</v-icon>
            {{ task.priority }}
          </v-chip>

          <!-- Status -->
          <v-chip
            :color="task.done ? 'success' : 'warning'"
            size="x-small"
            variant="tonal"
            label
            class="d-none d-sm-inline-flex"
          >
            {{ task.done ? 'Concluída' : 'Pendente' }}
          </v-chip>

          <!-- Editar -->
          <v-tooltip text="Editar" location="top">
            <template #activator="{ props }">
              <v-btn
                v-bind="props"
                icon="mdi-pencil-outline"
                size="small"
                variant="text"
                color="primary"
                @click="$emit('edit', task)"
              />
            </template>
          </v-tooltip>

          <!-- Excluir -->
          <v-tooltip text="Excluir" location="top">
            <template #activator="{ props }">
              <v-btn
                v-bind="props"
                icon="mdi-delete-outline"
                size="small"
                variant="text"
                color="error"
                @click="$emit('delete', task.id)"
              />
            </template>
          </v-tooltip>
        </div>
      </template>
    </v-card-item>
  </v-card>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  task: { type: Object, required: true },
})

defineEmits(['edit', 'delete', 'toggle'])

const priorityColor = computed(() => (
  { alta: 'error', media: 'warning', baixa: 'success' }[props.task.priority] || 'grey'
))
</script>

<style scoped>
.task-card {
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}
.task-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0,0,0,0.1) !important;
}
</style>
