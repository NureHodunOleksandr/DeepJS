<script setup>
import { RouterLink } from 'vue-router'

import { useTaskStore } from '@/stores/taskStore'

const taskStore = useTaskStore()

function formatDate(deadline) {
  return new Intl.DateTimeFormat('en', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(`${deadline}T00:00:00`))
}
</script>

<template>
  <section class="view-stack">
    <div class="page-heading">
      <div>
        <p class="eyebrow">Pinia getters</p>
        <h1>Statistics</h1>
      </div>

      <RouterLink class="button button-primary" to="/tasks/new">Create task</RouterLink>
    </div>

    <div class="stats-grid">
      <article class="metric-card">
        <span>Total</span>
        <strong>{{ taskStore.totalTasks }}</strong>
      </article>
      <article class="metric-card">
        <span>Active</span>
        <strong>{{ taskStore.activeTasks.length }}</strong>
      </article>
      <article class="metric-card">
        <span>Completed</span>
        <strong>{{ taskStore.completedTasks.length }}</strong>
      </article>
      <article class="metric-card">
        <span>Overdue</span>
        <strong>{{ taskStore.overdueTasks.length }}</strong>
      </article>
    </div>

    <section class="stats-panel">
      <div class="panel-heading">
        <h2>Completion progress</h2>
        <span>{{ taskStore.completionPercent }}%</span>
      </div>
      <div class="progress-track" aria-label="Task completion progress">
        <div class="progress-fill" :style="{ width: `${taskStore.completionPercent}%` }"></div>
      </div>
    </section>

    <div class="stats-columns">
      <section class="stats-panel">
        <h2>Tasks by status</h2>
        <dl class="breakdown-list">
          <div v-for="(count, status) in taskStore.tasksByStatus" :key="status">
            <dt>{{ status }}</dt>
            <dd>{{ count }}</dd>
          </div>
        </dl>
      </section>

      <section class="stats-panel">
        <h2>Tasks by category</h2>
        <dl class="breakdown-list">
          <div v-for="(count, category) in taskStore.tasksByCategory" :key="category">
            <dt>{{ category }}</dt>
            <dd>{{ count }}</dd>
          </div>
        </dl>
      </section>
    </div>

    <section class="stats-panel">
      <div class="panel-heading">
        <h2>Upcoming deadlines</h2>
        <span>Next 3 days</span>
      </div>

      <ul v-if="taskStore.upcomingDeadlines.length" class="deadline-list">
        <li v-for="task in taskStore.upcomingDeadlines" :key="task.id">
          <div>
            <RouterLink :to="`/tasks/${task.id}`">{{ task.title }}</RouterLink>
            <span>{{ task.category }} · {{ task.priority }}</span>
          </div>
          <time :datetime="task.deadline">{{ formatDate(task.deadline) }}</time>
        </li>
      </ul>

      <p v-else class="muted-text">There are no active tasks due in the next 3 days.</p>
    </section>
  </section>
</template>
