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
          @blur="touched.fullName = true"
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
          @blur="touched.email = true"
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

    <button class="button primary submit-button" type="submit" :disabled="busy || !isFormValid">
      <span v-if="busy">Sending...</span>
      <span v-else>Submit registration</span>
    </button>
  </form>
</template>

<script setup>
import { computed, reactive, ref } from 'vue'
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

const touched = reactive({
  fullName: false,
  email: false,
})

const wasSubmitted = ref(false)
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const isFull = computed(() => props.registeredCount >= props.event.capacity)

const fullNameError = computed(() => {
  if (!wasSubmitted.value && !touched.fullName) {
    return ''
  }

  return form.fullName ? '' : 'Name is required.'
})

const emailError = computed(() => {
  const email = form.email.trim()
  const canShowRequiredError = wasSubmitted.value || touched.email

  if (!email) {
    return canShowRequiredError ? 'Email is required.' : ''
  }

  if (!emailPattern.test(email)) {
    return canShowRequiredError ? 'Enter a valid email address.' : ''
  }

  if (isAlreadyRegistered(props.event.id, email)) {
    return 'This email is already registered for this event.'
  }

  return ''
})

const errors = computed(() => ({
  fullName: fullNameError.value,
  email: emailError.value,
}))

const isFormValid = computed(() => {
  const email = form.email.trim()

  return (
    !isFull.value &&
    Boolean(form.fullName) &&
    emailPattern.test(email) &&
    !isAlreadyRegistered(props.event.id, email)
  )
})

function handleSubmit() {
  wasSubmitted.value = true

  if (!isFormValid.value) {
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
