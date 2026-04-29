<script setup>
import { computed, ref } from 'vue'
import TodoList from './components/TodoList.vue'

const tasks = ref([])
const newTaskText = ref('')
const currentFilter = ref('all')
const nextTaskId = ref(1)

const filters = [
  { value: 'all', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'completed', label: 'Completed' },
]

const filteredTasks = computed(() => {
  if (currentFilter.value === 'active') {
    return tasks.value.filter((task) => !task.completed)
  }

  if (currentFilter.value === 'completed') {
    return tasks.value.filter((task) => task.completed)
  }

  return tasks.value
})

const activeTasksCount = computed(
  () => tasks.value.filter((task) => !task.completed).length,
)

function addTask() {
  const text = newTaskText.value.trim()

  if (!text) {
    return
  }

  tasks.value.push({
    id: nextTaskId.value,
    text,
    completed: false,
  })

  nextTaskId.value += 1
  newTaskText.value = ''
}

function toggleTask(id) {
  const task = tasks.value.find((item) => item.id === id)

  if (task) {
    task.completed = !task.completed
  }
}

function deleteTask(id) {
  tasks.value = tasks.value.filter((task) => task.id !== id)
}
</script>

<template>
  <main class="todo">
    <section class="todo__card" aria-labelledby="todo-title">
      <header class="todo__header">
        <h1 id="todo-title" class="todo__title">Список задач TO-DO List</h1>
      </header>

      <form class="todo__form" @submit.prevent="addTask">
        <label class="todo__label" for="new-task">New task</label>
        <div class="todo__controls">
          <input
            id="new-task"
            v-model="newTaskText"
            class="todo__input"
            type="text"
            placeholder="Enter a task"
            autocomplete="off"
          />
          <button class="todo__button" type="submit">Add</button>
        </div>
      </form>

      <div class="todo__filters" aria-label="Task filters">
        <button
          v-for="filter in filters"
          :key="filter.value"
          class="todo__filter"
          :class="{ 'todo__filter--active': currentFilter === filter.value }"
          type="button"
          @click="currentFilter = filter.value"
        >
          {{ filter.label }}
        </button>
      </div>

      <TodoList
        :tasks="filteredTasks"
        @toggle-task="toggleTask"
        @delete-task="deleteTask"
      />

      <p class="todo__summary">
        {{ activeTasksCount }}
        {{ activeTasksCount === 1 ? 'task' : 'tasks' }} left
      </p>
    </section>
  </main>
</template>
