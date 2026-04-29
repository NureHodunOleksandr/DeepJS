<script setup>
import { computed, onMounted, ref } from 'vue'
import ImageCard from './components/ImageCard.vue'
import { fetchImages } from './services/picsumApi'

const images = ref([])
const isLoading = ref(false)
const error = ref('')
const favorites = ref([])
const searchQuery = ref('')
const activeFilter = ref('all')
const page = ref(1)

const filteredImages = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()

  let result = images.value

  if (activeFilter.value === 'favorites') {
    result = result.filter((image) => favorites.value.includes(image.id))
  }

  if (query) {
    result = result.filter((image) => image.author.toLowerCase().includes(query))
  }

  return result
})

const emptyMessage = computed(() => {
  if (activeFilter.value === 'favorites' && favorites.value.length === 0) {
    return 'В обраному поки немає зображень'
  }

  if (filteredImages.value.length === 0) {
    return 'Нічого не знайдено'
  }

  return ''
})

async function loadImages(nextPage = 1) {
  isLoading.value = true
  error.value = ''

  try {
    const loadedImages = await fetchImages(nextPage, 20)

    if (nextPage === 1) {
      images.value = loadedImages
    } else {
      const existingIds = new Set(images.value.map((image) => image.id))
      const uniqueImages = loadedImages.filter((image) => !existingIds.has(image.id))

      images.value = [...images.value, ...uniqueImages]
    }

    page.value = nextPage
  } catch {
    error.value = 'Не вдалося завантажити зображення'
  } finally {
    isLoading.value = false
  }
}

function toggleFavorite(id) {
  if (favorites.value.includes(id)) {
    favorites.value = favorites.value.filter((favoriteId) => favoriteId !== id)
    return
  }

  favorites.value = [...favorites.value, id]
}

function isFavorite(id) {
  return favorites.value.includes(id)
}

function setFilter(filterName) {
  activeFilter.value = filterName
}

function retryLoading() {
  loadImages(1)
}

function loadMoreImages() {
  loadImages(page.value + 1)
}

onMounted(() => {
  loadImages()
})
</script>

<template>
  <main class="app">
    <section class="gallery-shell">
      <header class="gallery-header">
        <div>
          <p class="gallery-header__label">Picsum Photos API</p>
          <h1>Галерея зображень</h1>
        </div>
      </header>

      <div class="toolbar">
        <label class="search">
          <span class="sr-only">Пошук за автором</span>
          <input
            v-model="searchQuery"
            type="search"
            placeholder="Пошук за автором"
            :disabled="isLoading && images.length === 0"
          />
        </label>

        <div class="filters" aria-label="Фільтр зображень">
          <button
            class="filter-button"
            :class="{ 'filter-button--active': activeFilter === 'all' }"
            type="button"
            :disabled="isLoading && images.length === 0"
            @click="setFilter('all')"
          >
            Усі
          </button>
          <button
            class="filter-button"
            :class="{ 'filter-button--active': activeFilter === 'favorites' }"
            type="button"
            :disabled="isLoading && images.length === 0"
            @click="setFilter('favorites')"
          >
            Обрані
          </button>
        </div>
      </div>

      <div v-if="isLoading && images.length === 0" class="state-message">
        Завантаження...
      </div>

      <div v-else-if="error" class="state-message state-message--error">
        <p>{{ error }}</p>
        <button class="retry-button" type="button" @click="retryLoading">
          Спробувати ще раз
        </button>
      </div>

      <div v-else-if="emptyMessage" class="state-message">
        {{ emptyMessage }}
      </div>

      <template v-else>
        <div class="gallery-grid">
          <ImageCard
            v-for="image in filteredImages"
            :key="image.id"
            :image="image"
            :is-favorite="isFavorite(image.id)"
            @toggle-favorite="toggleFavorite"
          />
        </div>

        <div v-if="activeFilter === 'all' && !searchQuery.trim()" class="load-more">
          <button
            class="load-more__button"
            type="button"
            :disabled="isLoading"
            @click="loadMoreImages"
          >
            {{ isLoading ? 'Завантаження...' : 'Завантажити ще' }}
          </button>
        </div>
      </template>
    </section>
  </main>
</template>
