<script setup>
defineProps({
  task: {
    type: Object,
    required: true,
  },
})

defineEmits(['toggle-task', 'delete-task'])
</script>

<template>
  <li class="todo__item" :class="{ 'todo__item--completed': task.completed }">
    <label class="todo__status">
      <input
        class="todo__checkbox"
        type="checkbox"
        :checked="task.completed"
        @change="$emit('toggle-task', task.id)"
      />
      <span class="todo__text" :class="{ 'todo__text--completed': task.completed }">
        {{ task.text }}
      </span>
    </label>

    <button
      class="todo__delete"
      type="button"
      :aria-label="`Delete task: ${task.text}`"
      @click="$emit('delete-task', task.id)"
    >
      Delete
    </button>
  </li>
</template>
