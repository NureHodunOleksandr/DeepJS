<script setup>
import { computed, ref } from 'vue'
import { RouterLink } from 'vue-router'

import { TASK_CATEGORIES, TASK_PRIORITIES, useTaskStore } from '@/stores/taskStore'

const taskStore = useTaskStore()

const searchQuery = ref('')
const selectedCategory = ref('all')
const selectedPriority = ref('all')
const sortBy = ref('deadline')

const priorityWeight = {
  high: 3,
  medium: 2,
  low: 1,
}

const overdueTaskIds = computed(() => {
  return new Set(taskStore.overdueTasks.map((task) => String(task.id)))
})

const filteredAndSortedTasks = computed(() => {
  const normalizedSearch = searchQuery.value.trim().toLowerCase()

  return [...taskStore.tasks]
    .filter((task) => {
      const matchesTitle = task.title.toLowerCase().includes(normalizedSearch)
      const matchesCategory =
        selectedCategory.value === 'all' || task.category === selectedCategory.value
      const matchesPriority =
        selectedPriority.value === 'all' || task.priority === selectedPriority.value

      return matchesTitle && matchesCategory && matchesPriority
    })
    .sort((firstTask, secondTask) => {
      if (sortBy.value === 'priority') {
        return priorityWeight[secondTask.priority] - priorityWeight[firstTask.priority]
      }

      return deadlineTime(firstTask.deadline) - deadlineTime(secondTask.deadline)
    })
})

const hasFilters = computed(() => {
  return searchQuery.value || selectedCategory.value !== 'all' || selectedPriority.value !== 'all'
})

function deadlineTime(deadline) {
  return deadline ? new Date(`${deadline}T00:00:00`).getTime() : Number.POSITIVE_INFINITY
}

function formatDate(deadline) {
  if (!deadline) {
    return 'No deadline'
  }

  return new Intl.DateTimeFormat('en', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(`${deadline}T00:00:00`))
}

function isOverdue(task) {
  return overdueTaskIds.value.has(String(task.id))
}

function deleteTask(task) {
  const shouldDelete = window.confirm(`Delete "${task.title}"?`)

  if (shouldDelete) {
    taskStore.deleteTask(task.id)
  }
}
</script>

<template>
  <section class="view-stack">
    <div class="page-heading">
      <div>
        <p class="eyebrow">Global state laboratory</p>
        <h1>Tasks</h1>
      </div>

      <RouterLink class="button button-primary" to="/tasks/new">Create task</RouterLink>
    </div>

    <form class="toolbar" @submit.prevent>
      <label class="field compact-field">
        <span>Search</span>
        <input v-model="searchQuery" type="search" placeholder="Search by title" />
      </label>

      <label class="field compact-field">
        <span>Category</span>
        <select v-model="selectedCategory">
          <option value="all">All categories</option>
          <option v-for="category in TASK_CATEGORIES" :key="category" :value="category">
            {{ category }}
          </option>
        </select>
      </label>

      <label class="field compact-field">
        <span>Priority</span>
        <select v-model="selectedPriority">
          <option value="all">All priorities</option>
          <option v-for="priority in TASK_PRIORITIES" :key="priority" :value="priority">
            {{ priority }}
          </option>
        </select>
      </label>

      <label class="field compact-field">
        <span>Sort</span>
        <select v-model="sortBy">
          <option value="deadline">Deadline</option>
          <option value="priority">Priority</option>
        </select>
      </label>
    </form>

    <div v-if="filteredAndSortedTasks.length" class="task-grid">
      <article
        v-for="task in filteredAndSortedTasks"
        :key="task.id"
        class="task-card"
        :class="{ 'is-overdue': isOverdue(task), 'is-completed': task.status === 'completed' }"
      >
        <div class="task-card-header">
          <div>
            <p class="task-meta">{{ task.category }}</p>
            <h2>{{ task.title }}</h2>
          </div>
          <span class="status-badge" :class="`status-${task.status}`">
            {{ task.status }}
          </span>
        </div>

        <div class="task-facts">
          <span class="priority-badge" :class="`priority-${task.priority}`">
            {{ task.priority }}
          </span>
          <span>Deadline: {{ formatDate(task.deadline) }}</span>
        </div>

        <p v-if="isOverdue(task)" class="overdue-note">Overdue and still active</p>

        <div class="task-actions">
          <RouterLink class="button button-ghost" :to="`/tasks/${task.id}`">View</RouterLink>
          <RouterLink class="button button-ghost" :to="`/tasks/${task.id}/edit`">Edit</RouterLink>
          <button class="button button-ghost" type="button" @click="taskStore.toggleTaskStatus(task.id)">
            {{ task.status === 'completed' ? 'Mark active' : 'Complete' }}
          </button>
          <button class="button button-danger" type="button" @click="deleteTask(task)">
            Delete
          </button>
        </div>
      </article>
    </div>

    <div v-else class="empty-state">
      <h2>{{ hasFilters ? 'No matching tasks' : 'No tasks yet' }}</h2>
      <p>
        {{
          hasFilters
            ? 'Change the search, category, or priority filters to see more tasks.'
            : 'Create your first task to start tracking work with Pinia state.'
        }}
      </p>
      <RouterLink class="button button-primary" to="/tasks/new">Create task</RouterLink>
    </div>
  </section>
</template>
