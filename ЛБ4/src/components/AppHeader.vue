<template>
  <header class="app-header">
    <RouterLink class="brand" to="/events" aria-label="Open events list">
      <span class="brand-mark">EF</span>
      <span>
        <strong>EventFlow</strong>
        <small>Advanced JavaScript Lab</small>
      </span>
    </RouterLink>

    <nav class="main-nav" aria-label="Main navigation">
      <RouterLink to="/events">Events</RouterLink>
    </nav>
  </header>
</template>

<script setup>
import { RouterLink } from 'vue-router'
</script>
