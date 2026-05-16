<template>
  <section v-if="event" class="details-layout">
    <div class="details-main">
      <RouterLink class="back-link" to="/events">Back to events</RouterLink>

      <EventBanner :event="event" />

      <div class="details-content">
        <div class="event-card-meta">
          <span>{{ event.category }}</span>
          <span>{{ formattedDate }}</span>
        </div>

        <h1>{{ event.title }}</h1>
        <p>{{ event.fullDescription }}</p>

        <dl class="event-facts">
          <div>
            <dt>Format</dt>
            <dd>{{ event.format }}</dd>
          </div>
          <div>
            <dt>Location</dt>
            <dd>{{ event.location }}</dd>
          </div>
          <div>
            <dt>Available</dt>
            <dd>{{ availablePlaces }} of {{ event.capacity }}</dd>
          </div>
        </dl>

        <RouterLink
          v-if="availablePlaces > 0"
          class="button primary"
          :to="{ name: 'event-register', params: { id: event.id } }"
        >
          Register for event
        </RouterLink>
        <button v-else class="button secondary" type="button" disabled>Registration closed</button>
      </div>
    </div>

    <RegisteredUsers :registrations="eventRegistrations" :capacity="event.capacity" />
  </section>

  <NotFoundView v-else />
</template>

<script setup>
import { computed } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import EventBanner from '../components/EventBanner.vue'
import RegisteredUsers from '../components/RegisteredUsers.vue'
import NotFoundView from './NotFoundView.vue'
import { useEvents } from '../composables/useEvents'
import { useRegistrations } from '../composables/useRegistrations'

const route = useRoute()
const { getEventById } = useEvents()
const { getRegistrationsByEventId } = useRegistrations()

const eventId = computed(() => route.params.id)
const event = computed(() => getEventById(eventId.value))
const eventRegistrations = getRegistrationsByEventId(eventId)

const formattedDate = computed(() => {
  if (!event.value) {
    return ''
  }

  return new Intl.DateTimeFormat('en', {
    weekday: 'short',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(event.value.date))
})

const availablePlaces = computed(() => {
  if (!event.value) {
    return 0
  }

  return Math.max(event.value.capacity - eventRegistrations.value.length, 0)
})
</script>
