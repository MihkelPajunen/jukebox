<template>
  <div class="card" :data-aos="width < 769 ? 'fade-up' : 'fade-left'">
    <div class="card-image">
      <AppImage :image-url="imageUrl" />
    </div>
    <div class="card-content has-background-dark">
      <p class="title is-size-6 has-text-centered has-text-white">
        {{ truncateString(text, 32) }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { truncateString } from '@/utils/functions';
import { useWindowSize } from '@vueuse/core';

import AppImage from './AppImage.vue';

defineProps({
  text: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String,
    required: true
  }
});

const { width } = useWindowSize();
</script>
