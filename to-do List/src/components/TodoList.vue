<script setup>
import TodoItem from './TodoItem.vue'

defineProps({
  tasks: {
    type: Array,
    required: true,
  },
})

defineEmits(['toggle-task', 'delete-task'])
</script>

<template>
  <ul v-if="tasks.length" class="todo__list">
    <TodoItem
      v-for="task in tasks"
      :key="task.id"
      :task="task"
      @toggle-task="$emit('toggle-task', $event)"
      @delete-task="$emit('delete-task', $event)"
    />
  </ul>

  <p v-else class="todo__empty">No tasks for this filter.</p>
</template>
