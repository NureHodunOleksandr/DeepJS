<template>
  <Teleport to="body">
    <Transition name="toast-slide">
      <div v-if="message" class="toast" :class="type" role="status" aria-live="polite">
        <strong>{{ title }}</strong>
        <span>{{ message }}</span>
        <button type="button" aria-label="Close notification" @click="$emit('close')">
          Close
        </button>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    default: 'Notification',
  },
  message: {
    type: String,
    default: '',
  },
  type: {
    type: String,
    default: 'info',
  },
})

defineEmits(['close'])
</script>
