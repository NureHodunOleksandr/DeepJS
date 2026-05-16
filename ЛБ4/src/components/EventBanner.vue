<template>
  <div class="event-banner" :style="{ background: event.gradient }">
    <div class="banner-content">
      <span class="event-category">{{ event.category }}</span>
      <strong>{{ event.title }}</strong>
      <span>{{ event.format }} · {{ event.location }}</span>
    </div>
  </div>
</template>

<script setup>
defineProps({
  event: {
    type: Object,
    required: true,
  },
})
</script>
