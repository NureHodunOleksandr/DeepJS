import { computed, ref, unref } from 'vue'
import { useLocalStorage } from './useLocalStorage.js'

const registrations = useLocalStorage('lab4-event-registrations', [])
const isRegistering = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

function createRegistrationId() {
  if (globalThis.crypto?.randomUUID) {
    return globalThis.crypto.randomUUID()
  }

  return `registration-${Date.now()}-${Math.random().toString(16).slice(2)}`
}

function normalizeEmail(email) {
  return email.trim().toLowerCase()
}

function simulateRegistrationRequest({ simulateError = false } = {}) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (simulateError) {
        reject(new Error('The server rejected this registration. The optimistic update was rolled back.'))
        return
      }

      resolve()
    }, 1200)
  })
}

export function useRegistrations() {
  function getRegistrationsByEventId(eventId) {
    return computed(() => {
      const selectedEventId = String(unref(eventId))

      return registrations.value
        .filter((registration) => registration.eventId === selectedEventId)
        .sort((firstRegistration, secondRegistration) => {
          return new Date(secondRegistration.createdAt) - new Date(firstRegistration.createdAt)
        })
    })
  }

  function getRegistrationCountByEventId(eventId) {
    return registrations.value.filter((registration) => registration.eventId === String(eventId)).length
  }

  function isAlreadyRegistered(eventId, email) {
    const normalizedEmail = normalizeEmail(email)

    return registrations.value.some((registration) => {
      return registration.eventId === String(eventId) && registration.email === normalizedEmail
    })
  }

  async function registerUser(eventId, userData, options = {}) {
    const selectedEventId = String(eventId)
    const normalizedEmail = normalizeEmail(userData.email)

    errorMessage.value = ''
    successMessage.value = ''

    if (isAlreadyRegistered(selectedEventId, normalizedEmail)) {
      errorMessage.value = 'This email is already registered for the selected event.'
      throw new Error(errorMessage.value)
    }

    const optimisticRegistration = {
      id: createRegistrationId(),
      eventId: selectedEventId,
      fullName: userData.fullName.trim(),
      email: normalizedEmail,
      phone: userData.phone.trim(),
      comment: userData.comment.trim(),
      createdAt: new Date().toISOString(),
      status: 'pending',
    }

    registrations.value = [optimisticRegistration, ...registrations.value]
    isRegistering.value = true

    try {
      await simulateRegistrationRequest(options)

      registrations.value = registrations.value.map((registration) =>
        registration.id === optimisticRegistration.id
          ? { ...registration, status: 'confirmed' }
          : registration,
      )

      successMessage.value = 'Registration confirmed successfully.'
      return registrations.value.find((registration) => registration.id === optimisticRegistration.id)
    } catch (error) {
      registrations.value = registrations.value.filter((registration) => {
        return registration.id !== optimisticRegistration.id
      })

      errorMessage.value = error.message || 'Registration failed. Please try again.'
      throw error
    } finally {
      isRegistering.value = false
    }
  }

  return {
    registrations,
    isRegistering,
    errorMessage,
    successMessage,
    getRegistrationsByEventId,
    getRegistrationCountByEventId,
    isAlreadyRegistered,
    registerUser,
  }
}
