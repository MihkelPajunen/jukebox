<template>
  <div class="card">
    <div class="card-image">
      <AppImage :image-url="imageUrl" />
    </div>
    <div class="card-content has-background-dark">
      <p class="title is-size-6 has-text-centered has-text-white">
        {{ name }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import AppImage from './AppImage.vue';

defineProps({
  name: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String,
    required: true
  }
});
</script>
