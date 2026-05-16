import { computed, readonly, ref } from 'vue'

const eventItems = ref([
  {
    id: 'frontend-summit',
    title: 'Frontend Summit 2026',
    date: '2026-06-12T10:00:00',
    category: 'Conference',
    shortDescription: 'A practical day about Vue, modern UI architecture, and fast product delivery.',
    fullDescription:
      'Frontend Summit brings together students and engineers who build modern web interfaces. The program includes talks about Vue 3, Vite, design systems, performance budgets, accessibility, and practical teamwork in frontend projects.',
    location: 'Kharkiv IT Cluster Hall',
    format: 'Offline',
    capacity: 36,
    gradient: 'linear-gradient(135deg, #1d4ed8 0%, #14b8a6 52%, #f59e0b 100%)',
  },
  {
    id: 'vue-composition-lab',
    title: 'Vue Composition API Lab',
    date: '2026-06-19T16:30:00',
    category: 'Workshop',
    shortDescription: 'Hands-on practice with reusable composables, reactive state, and route-driven UI.',
    fullDescription:
      'This workshop focuses on the Composition API in real application scenarios. Participants will extract reusable logic into composables, handle route parameters, share state between views, and keep code readable under growing requirements.',
    location: 'Online, Zoom',
    format: 'Online',
    capacity: 24,
    gradient: 'linear-gradient(135deg, #0f766e 0%, #22c55e 48%, #a3e635 100%)',
  },
  {
    id: 'product-design-night',
    title: 'Product Design Night',
    date: '2026-07-03T18:00:00',
    category: 'Meetup',
    shortDescription: 'An evening about dark interfaces, event products, and user-centered decisions.',
    fullDescription:
      'Product Design Night is a meetup for people who want to connect frontend implementation with interface design. Speakers will discuss readable dark themes, form UX, registration flows, and how to reduce friction in multi-step products.',
    location: 'Creative Space B12',
    format: 'Offline',
    capacity: 42,
    gradient: 'linear-gradient(135deg, #7c3aed 0%, #db2777 50%, #fb7185 100%)',
  },
  {
    id: 'async-js-intensive',
    title: 'Async JavaScript Intensive',
    date: '2026-07-16T11:00:00',
    category: 'Training',
    shortDescription: 'Deep practice with promises, optimistic updates, rollback, and predictable errors.',
    fullDescription:
      'The intensive is dedicated to asynchronous JavaScript in frontend applications. Attendees will practice pending states, simulated API requests, optimistic UI, failure handling, rollback strategies, and persistent client-side state.',
    location: 'Online, Google Meet',
    format: 'Online',
    capacity: 30,
    gradient: 'linear-gradient(135deg, #be123c 0%, #f97316 52%, #facc15 100%)',
  },
])

export function useEvents() {
  const events = readonly(eventItems)

  const upcomingEvents = computed(() =>
    [...eventItems.value].sort((firstEvent, secondEvent) => {
      return new Date(firstEvent.date) - new Date(secondEvent.date)
    }),
  )

  function getEventById(id) {
    return eventItems.value.find((event) => event.id === String(id)) || null
  }

  return {
    events,
    upcomingEvents,
    getEventById,
  }
}
