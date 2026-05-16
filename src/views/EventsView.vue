<template>
  <section class="hero-section">
    <div>
      <span class="eyebrow">Laboratory work 4</span>
      <h1>Event registration app</h1>
      <p>
        Choose a session, check the details, and keep track of everyone joining each event.
      </p>
    </div>
  </section>

  <section class="events-grid" aria-label="Events list">
    <EventCard
      v-for="event in upcomingEvents"
      :key="event.id"
      :event="event"
      :registered-count="getRegistrationCountByEventId(event.id)"
    />
  </section>
</template>

<script setup>
import EventCard from '../components/EventCard.vue'
import { useEvents } from '../composables/useEvents'
import { useRegistrations } from '../composables/useRegistrations'

defineOptions({
  name: 'EventsView',
})

const { upcomingEvents } = useEvents()
const { getRegistrationCountByEventId } = useRegistrations()
</script>
