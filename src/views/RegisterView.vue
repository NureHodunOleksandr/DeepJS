<template>
  <section v-if="event" class="register-layout">
    <div class="register-panel">
      <RouterLink class="back-link" :to="{ name: 'event-details', params: { id: event.id } }">
        Back to details
      </RouterLink>

      <div class="register-summary">
        <span class="eyebrow">{{ event.category }}</span>
        <h1>Register for {{ event.title }}</h1>
        <p>{{ formattedDate }} · {{ event.location }}</p>
        <strong>{{ availablePlaces }} places left</strong>
      </div>

      <RegistrationForm
        :event="event"
        :registered-count="eventRegistrations.length"
        :busy="isRegistering"
        @submit="handleRegistration"
      />

      <div v-if="successfulRegistration" class="success-panel">
        <strong>Registration confirmed</strong>
        <span>{{ successfulRegistration.fullName }} is now on the event list.</span>
      </div>

      <div v-if="errorMessage" class="form-message error">
        {{ errorMessage }}
      </div>
    </div>

    <RegisteredUsers :registrations="eventRegistrations" :capacity="event.capacity" />

    <BaseToast
      :title="toast.title"
      :message="toast.message"
      :type="toast.type"
      @close="clearToast"
    />
  </section>

  <NotFoundView v-else />
</template>

<script setup>
import { computed, reactive, ref } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import BaseToast from '../components/BaseToast.vue'
import RegisteredUsers from '../components/RegisteredUsers.vue'
import RegistrationForm from '../components/RegistrationForm.vue'
import NotFoundView from './NotFoundView.vue'
import { useEvents } from '../composables/useEvents'
import { useRegistrations } from '../composables/useRegistrations'

const route = useRoute()
const { getEventById } = useEvents()
const {
  errorMessage,
  isRegistering,
  getRegistrationsByEventId,
  registerUser,
} = useRegistrations()

const eventId = computed(() => route.params.id)
const event = computed(() => getEventById(eventId.value))
const eventRegistrations = getRegistrationsByEventId(eventId)
const successfulRegistration = ref(null)
const toast = reactive({
  title: '',
  message: '',
  type: 'info',
})

const formattedDate = computed(() => {
  if (!event.value) {
    return ''
  }

  return new Intl.DateTimeFormat('en', {
    weekday: 'short',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(event.value.date))
})

const availablePlaces = computed(() => {
  if (!event.value) {
    return 0
  }

  return Math.max(event.value.capacity - eventRegistrations.value.length, 0)
})

function showToast(type, title, message) {
  toast.type = type
  toast.title = title
  toast.message = message
}

function clearToast() {
  toast.title = ''
  toast.message = ''
  toast.type = 'info'
}

async function handleRegistration({ userData, simulateError }) {
  successfulRegistration.value = null
  showToast('info', 'Registration started', 'Saving the participant now.')

  try {
    const registration = await registerUser(event.value.id, userData, { simulateError })
    successfulRegistration.value = registration
    showToast('success', 'Registration saved', 'The simulated server accepted the registration.')
  } catch {
    showToast('error', 'Registration failed', errorMessage.value)
  }
}
</script>
