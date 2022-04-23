<template>
  <div class="card" data-aos="fade-left">
    <div class="card-image">
      <AppImage :image-url="imageUrl" />
    </div>
    <div class="card-content has-background-dark">
      <p class="title is-size-6 has-text-centered has-text-white">
        {{ truncateString(name, 30) }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { truncateString } from '@/utils/functions';

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
