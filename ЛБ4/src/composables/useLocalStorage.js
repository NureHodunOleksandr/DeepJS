import { ref, watch } from 'vue'

function cloneDefaultValue(value) {
  return typeof structuredClone === 'function'
    ? structuredClone(value)
    : JSON.parse(JSON.stringify(value))
}

export function useLocalStorage(key, defaultValue) {
  const storedValue = ref(readValue())

  function readValue() {
    if (typeof localStorage === 'undefined') {
      return cloneDefaultValue(defaultValue)
    }

    try {
      const rawValue = localStorage.getItem(key)
      return rawValue ? JSON.parse(rawValue) : cloneDefaultValue(defaultValue)
    } catch {
      return cloneDefaultValue(defaultValue)
    }
  }

  watch(
    storedValue,
    (value) => {
      if (typeof localStorage === 'undefined') {
        return
      }

      try {
        localStorage.setItem(key, JSON.stringify(value))
      } catch {
        localStorage.removeItem(key)
      }
    },
    { deep: true },
  )

  return storedValue
}
