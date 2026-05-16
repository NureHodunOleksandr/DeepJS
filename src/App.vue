<template>
  <div class="app-shell">
    <AppHeader />

    <main class="page-shell">
      <RouterView v-slot="{ Component }">
        <KeepAlive include="EventsView">
          <component :is="Component" />
        </KeepAlive>
      </RouterView>
    </main>
  </div>
</template>

<script setup>
import { RouterView } from 'vue-router'
import AppHeader from './components/AppHeader.vue'
</script>
