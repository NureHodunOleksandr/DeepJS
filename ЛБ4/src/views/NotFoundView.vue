<template>
  <section class="not-found">
    <span class="eyebrow">404</span>
    <h1>Page not found</h1>
    <p>The route does not match any event page in this lab application.</p>
    <RouterLink class="button primary" to="/events">Open events</RouterLink>
  </section>
</template>

<script setup>
import { RouterLink } from 'vue-router'
</script>
