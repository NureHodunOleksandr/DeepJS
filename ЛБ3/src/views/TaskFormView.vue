<script setup>
import { computed, reactive, watch } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'

import {
  TASK_CATEGORIES,
  TASK_PRIORITIES,
  TASK_STATUSES,
  useTaskStore,
} from '@/stores/taskStore'

const route = useRoute()
const router = useRouter()
const taskStore = useTaskStore()

const form = reactive({
  title: '',
  description: '',
  category: 'Study',
  priority: 'medium',
  deadline: '',
  status: 'active',
})

const errors = reactive({
  title: '',
  deadline: '',
})

const isEditMode = computed(() => Boolean(route.params.id))
const editedTask = computed(() => {
  return isEditMode.value ? taskStore.getTaskById(route.params.id) : null
})

const canShowForm = computed(() => !isEditMode.value || Boolean(editedTask.value))

watch(
  () => route.params.id,
  () => {
    clearErrors()

    if (isEditMode.value && editedTask.value) {
      form.title = editedTask.value.title
      form.description = editedTask.value.description
      form.category = editedTask.value.category
      form.priority = editedTask.value.priority
      form.deadline = editedTask.value.deadline
      form.status = editedTask.value.status
      return
    }

    form.title = ''
    form.description = ''
    form.category = 'Study'
    form.priority = 'medium'
    form.deadline = ''
    form.status = 'active'
  },
  { immediate: true },
)

function validateForm() {
  clearErrors()

  if (!form.title.trim()) {
    errors.title = 'Task title is required.'
  }

  if (!form.deadline) {
    errors.deadline = 'Deadline is required.'
  } else if (!isEditMode.value && isPastDate(form.deadline)) {
    errors.deadline = 'Deadline cannot be in the past for a new task.'
  }

  return !errors.title && !errors.deadline
}

function saveTask() {
  if (!validateForm()) {
    return
  }

  const taskData = {
    title: form.title,
    description: form.description,
    category: form.category,
    priority: form.priority,
    deadline: form.deadline,
    status: form.status,
  }

  if (isEditMode.value) {
    const updatedTask = taskStore.updateTask(route.params.id, taskData)

    if (updatedTask) {
      clearErrors()
      router.push(`/tasks/${updatedTask.id}`)
    }

    return
  }

  const createdTask = taskStore.addTask(taskData)
  clearErrors()
  router.push(`/tasks/${createdTask.id}`)
}

function clearErrors() {
  errors.title = ''
  errors.deadline = ''
}

function isPastDate(deadline) {
  const selectedDate = new Date(`${deadline}T00:00:00`)
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())

  return selectedDate < today
}
</script>

<template>
  <section class="view-stack">
    <div v-if="canShowForm" class="form-layout">
      <div class="page-heading">
        <div>
          <p class="eyebrow">{{ isEditMode ? 'Edit task' : 'New task' }}</p>
          <h1>{{ isEditMode ? 'Update task' : 'Create task' }}</h1>
        </div>

        <RouterLink class="button button-ghost" to="/">Back to list</RouterLink>
      </div>

      <form class="task-form" novalidate @submit.prevent="saveTask">
        <label class="field">
          <span>Task title</span>
          <input
            v-model="form.title"
            type="text"
            placeholder="Enter task title"
            :aria-invalid="Boolean(errors.title)"
            @input="errors.title = ''"
          />
          <small v-if="errors.title" class="field-error">{{ errors.title }}</small>
        </label>

        <label class="field">
          <span>Description</span>
          <textarea
            v-model="form.description"
            rows="5"
            placeholder="Describe the task"
          ></textarea>
        </label>

        <div class="form-grid">
          <label class="field">
            <span>Category</span>
            <select v-model="form.category">
              <option v-for="category in TASK_CATEGORIES" :key="category" :value="category">
                {{ category }}
              </option>
            </select>
          </label>

          <label class="field">
            <span>Priority</span>
            <select v-model="form.priority">
              <option v-for="priority in TASK_PRIORITIES" :key="priority" :value="priority">
                {{ priority }}
              </option>
            </select>
          </label>

          <label class="field">
            <span>Deadline</span>
            <input
              v-model="form.deadline"
              type="date"
              :aria-invalid="Boolean(errors.deadline)"
              @input="errors.deadline = ''"
            />
            <small v-if="errors.deadline" class="field-error">{{ errors.deadline }}</small>
          </label>

          <label class="field">
            <span>Status</span>
            <select v-model="form.status">
              <option v-for="status in TASK_STATUSES" :key="status" :value="status">
                {{ status }}
              </option>
            </select>
          </label>
        </div>

        <div class="form-actions">
          <button class="button button-primary" type="submit">
            {{ isEditMode ? 'Save changes' : 'Create task' }}
          </button>
          <RouterLink class="button button-ghost" to="/">Cancel</RouterLink>
        </div>
      </form>
    </div>

    <div v-else class="empty-state">
      <h1>Task not found</h1>
      <p>The task selected for editing does not exist.</p>
      <RouterLink class="button button-primary" to="/">Back to task list</RouterLink>
    </div>
  </section>
</template>
