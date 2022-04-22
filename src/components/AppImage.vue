<template>
  <figure class="image is-square">
    <AppLoader v-if="isLoading" />
    <img v-else :src="image.src" />
  </figure>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

import AppLoader from '@/components/AppLoader.vue';
import placeholder from '@/assets/placeholder.png';

const props = defineProps({
  imageUrl: {
    type: String,
    required: true
  }
});

const isLoading = ref(true);

const image = ref(new Image());

onMounted(() => {
  image.value.src = props.imageUrl;

  image.value.onload = () => {
    isLoading.value = false;
  };

  image.value.onerror = () => {
    image.value.src = placeholder;
    isLoading.value = false;
  };
});
</script>
