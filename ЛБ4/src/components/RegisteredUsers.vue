<template>
  <section class="registered-users">
    <div class="section-heading">
      <span>Registered users</span>
      <strong>{{ registrations.length }} / {{ capacity }}</strong>
    </div>

    <p v-if="registrations.length === 0" class="empty-state">
      No registrations yet.
    </p>

    <ul v-else class="user-list">
      <li v-for="registration in registrations" :key="registration.id">
        <div>
          <strong>{{ registration.fullName }}</strong>
          <span>{{ registration.email }}</span>
        </div>
        <span class="status-pill" :class="registration.status">
          {{ registration.status }}
        </span>
      </li>
    </ul>
  </section>
</template>

<script setup>
defineProps({
  registrations: {
    type: Array,
    required: true,
  },
  capacity: {
    type: Number,
    required: true,
  },
})
</script>
