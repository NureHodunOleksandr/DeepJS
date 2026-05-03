<script setup>
import { RouterLink } from 'vue-router'
</script>

<template>
  <section class="empty-state">
    <p class="eyebrow">404</p>
    <h1>Page not found</h1>
    <p>The address is incorrect or the page no longer exists.</p>
    <RouterLink class="button button-primary" to="/">Back to home</RouterLink>
  </section>
</template>
