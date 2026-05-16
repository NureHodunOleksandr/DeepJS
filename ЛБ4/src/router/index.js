import { createRouter, createWebHistory } from 'vue-router'
import EventsView from '../views/EventsView.vue'
import EventDetailsView from '../views/EventDetailsView.vue'
import RegisterView from '../views/RegisterView.vue'
import NotFoundView from '../views/NotFoundView.vue'

const routes = [
  {
    path: '/',
    redirect: '/events',
  },
  {
    path: '/events',
    name: 'events',
    component: EventsView,
  },
  {
    path: '/events/:id',
    name: 'event-details',
    component: EventDetailsView,
  },
  {
    path: '/events/:id/register',
    name: 'event-register',
    component: RegisterView,
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: NotFoundView,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  },
})

export default router
