import { createRouter, createWebHistory } from 'vue-router'

import NotFoundView from '@/views/NotFoundView.vue'
import StatsView from '@/views/StatsView.vue'
import TaskDetailView from '@/views/TaskDetailView.vue'
import TaskFormView from '@/views/TaskFormView.vue'
import TaskListView from '@/views/TaskListView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'tasks',
      component: TaskListView,
    },
    {
      path: '/tasks/new',
      name: 'task-create',
      component: TaskFormView,
    },
    {
      path: '/tasks/:id/edit',
      name: 'task-edit',
      component: TaskFormView,
    },
    {
      path: '/tasks/:id',
      name: 'task-detail',
      component: TaskDetailView,
    },
    {
      path: '/stats',
      name: 'stats',
      component: StatsView,
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: NotFoundView,
    },
  ],
})

export default router
