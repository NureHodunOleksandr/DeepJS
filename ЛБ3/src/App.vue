<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <div class="app-shell">
    <header class="site-header">
      <RouterLink class="brand-link" to="/" aria-label="Task Manager home">
        Task Manager
      </RouterLink>

      <nav class="main-nav" aria-label="Primary navigation">
        <RouterLink to="/" active-class="is-active">Tasks</RouterLink>
        <RouterLink to="/tasks/new" active-class="is-active">Create</RouterLink>
        <RouterLink to="/stats" active-class="is-active">Stats</RouterLink>
      </nav>
    </header>

    <main class="page-container">
      <RouterView v-slot="{ Component, route }">
        <Transition name="route-fade" mode="out-in">
          <component :is="Component" :key="route.fullPath" />
        </Transition>
      </RouterView>
    </main>
  </div>
</template>
