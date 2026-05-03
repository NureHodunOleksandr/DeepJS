<script setup>
import { computed } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'

import { useTaskStore } from '@/stores/taskStore'

const route = useRoute()
const router = useRouter()
const taskStore = useTaskStore()

const task = computed(() => taskStore.getTaskById(route.params.id))

function formatDate(value, withTime = false) {
  if (!value) {
    return 'Not set'
  }

  return new Intl.DateTimeFormat('en', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: withTime ? '2-digit' : undefined,
    minute: withTime ? '2-digit' : undefined,
  }).format(new Date(value.includes('T') ? value : `${value}T00:00:00`))
}

function deleteCurrentTask() {
  if (!task.value) {
    return
  }

  const shouldDelete = window.confirm(`Delete "${task.value.title}"?`)

  if (shouldDelete) {
    taskStore.deleteTask(task.value.id)
    router.push('/')
  }
}
</script>

<template>
  <section class="view-stack">
    <div v-if="task" class="detail-layout">
      <div class="page-heading">
        <div>
          <p class="eyebrow">Task details</p>
          <h1>{{ task.title }}</h1>
        </div>

        <div class="heading-actions">
          <RouterLink class="button button-ghost" to="/">Back to list</RouterLink>
          <RouterLink class="button button-primary" :to="`/tasks/${task.id}/edit`">Edit</RouterLink>
          <button class="button button-danger" type="button" @click="deleteCurrentTask">
            Delete
          </button>
        </div>
      </div>

      <article class="detail-panel">
        <p class="description-text">{{ task.description || 'No description provided.' }}</p>

        <dl class="detail-list">
          <div>
            <dt>ID</dt>
            <dd>{{ task.id }}</dd>
          </div>
          <div>
            <dt>Category</dt>
            <dd>{{ task.category }}</dd>
          </div>
          <div>
            <dt>Priority</dt>
            <dd>
              <span class="priority-badge" :class="`priority-${task.priority}`">
                {{ task.priority }}
              </span>
            </dd>
          </div>
          <div>
            <dt>Deadline</dt>
            <dd>{{ formatDate(task.deadline) }}</dd>
          </div>
          <div>
            <dt>Status</dt>
            <dd>
              <span class="status-badge" :class="`status-${task.status}`">
                {{ task.status }}
              </span>
            </dd>
          </div>
          <div>
            <dt>Created</dt>
            <dd>{{ formatDate(task.createdAt, true) }}</dd>
          </div>
          <div>
            <dt>Updated</dt>
            <dd>{{ formatDate(task.updatedAt, true) }}</dd>
          </div>
        </dl>
      </article>
    </div>

    <div v-else class="empty-state">
      <h1>Task not found</h1>
      <p>The task with this id does not exist or was deleted.</p>
      <RouterLink class="button button-primary" to="/">Back to task list</RouterLink>
    </div>
  </section>
</template>
