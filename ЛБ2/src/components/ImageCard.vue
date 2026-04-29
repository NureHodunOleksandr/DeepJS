<script setup>
defineProps({
  image: {
    type: Object,
    required: true,
  },
  isFavorite: {
    type: Boolean,
    required: true,
  },
})

defineEmits(['toggle-favorite'])
</script>

<template>
  <article class="image-card">
    <img
      class="image-card__preview"
      :src="`https://picsum.photos/id/${image.id}/600/400`"
      :alt="`Фото автора ${image.author}`"
      loading="lazy"
    />

    <div class="image-card__body">
      <div>
        <h2 class="image-card__author">{{ image.author }}</h2>
        <p class="image-card__id">ID: {{ image.id }}</p>
      </div>

      <button
        class="favorite-button"
        :class="{ 'favorite-button--active': isFavorite }"
        type="button"
        :aria-pressed="isFavorite"
        @click="$emit('toggle-favorite', image.id)"
      >
        <span aria-hidden="true">{{ isFavorite ? '★' : '☆' }}</span>
        {{ isFavorite ? 'В обраному' : 'В обране' }}
      </button>
    </div>
  </article>
</template>
