<template>
  <article class="event-card">
    <EventBanner :event="event" />

    <div class="event-card-body">
      <div class="event-card-meta">
        <span>{{ event.category }}</span>
        <span>{{ formattedDate }}</span>
      </div>

      <h2>{{ event.title }}</h2>
      <p>{{ event.shortDescription }}</p>

      <div class="event-card-footer">
        <div>
          <strong>{{ availablePlaces }}</strong>
          <span>places left</span>
        </div>

        <div class="action-row">
          <RouterLink class="button secondary" :to="{ name: 'event-details', params: { id: event.id } }">
            Details
          </RouterLink>
          <RouterLink class="button primary" :to="{ name: 'event-register', params: { id: event.id } }">
            Register
          </RouterLink>
        </div>
      </div>
    </div>
  </article>
</template>

<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import EventBanner from './EventBanner.vue'

const props = defineProps({
  event: {
    type: Object,
    required: true,
  },
  registeredCount: {
    type: Number,
    default: 0,
  },
})

const formattedDate = computed(() =>
  new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(props.event.date)),
)

const availablePlaces = computed(() => Math.max(props.event.capacity - props.registeredCount, 0))
</script>
