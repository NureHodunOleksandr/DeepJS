<template>
  <form class="registration-form" novalidate @submit.prevent="handleSubmit">
    <div class="form-grid">
      <label>
        <span>Full name</span>
        <input
          v-model.trim="form.fullName"
          type="text"
          autocomplete="name"
          :aria-invalid="Boolean(errors.fullName)"
          placeholder="Oleksandr Hodun"
        />
        <small v-if="errors.fullName">{{ errors.fullName }}</small>
      </label>

      <label>
        <span>Email</span>
        <input
          v-model.trim="form.email"
          type="email"
          autocomplete="email"
          :aria-invalid="Boolean(errors.email)"
          placeholder="student@example.com"
        />
        <small v-if="errors.email">{{ errors.email }}</small>
      </label>

      <label>
        <span>Phone or contact</span>
        <input
          v-model.trim="form.phone"
          type="text"
          autocomplete="tel"
          placeholder="+380 00 000 00 00"
        />
      </label>

      <label class="checkbox-field">
        <input v-model="form.simulateError" type="checkbox" />
        <span>Simulate server error</span>
      </label>
    </div>

    <label>
      <span>Comment</span>
      <textarea
        v-model.trim="form.comment"
        rows="4"
        placeholder="Share expectations or questions for the organizers"
      ></textarea>
    </label>

    <div v-if="isFull" class="form-message warning">
      This event is full, so new registrations are closed.
    </div>

    <button class="button primary submit-button" type="submit" :disabled="busy || isFull">
      <span v-if="busy">Sending...</span>
      <span v-else>Submit registration</span>
    </button>
  </form>
</template>

<script setup>
import { computed, reactive } from 'vue'
import { useRegistrations } from '../composables/useRegistrations'

const props = defineProps({
  event: {
    type: Object,
    required: true,
  },
  registeredCount: {
    type: Number,
    required: true,
  },
  busy: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['submit'])
const { isAlreadyRegistered } = useRegistrations()

const form = reactive({
  fullName: '',
  email: '',
  phone: '',
  comment: '',
  simulateError: false,
})

const errors = reactive({
  fullName: '',
  email: '',
})

const isFull = computed(() => props.registeredCount >= props.event.capacity)

function validateForm() {
  errors.fullName = ''
  errors.email = ''

  if (!form.fullName) {
    errors.fullName = 'Name is required.'
  }

  if (!form.email) {
    errors.email = 'Email is required.'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = 'Enter a valid email address.'
  } else if (isAlreadyRegistered(props.event.id, form.email)) {
    errors.email = 'This email is already registered for this event.'
  }

  return !errors.fullName && !errors.email
}

function handleSubmit() {
  if (!validateForm() || isFull.value) {
    return
  }

  emit('submit', {
    userData: {
      fullName: form.fullName,
      email: form.email,
      phone: form.phone,
      comment: form.comment,
    },
    simulateError: form.simulateError,
  })
}
</script>
