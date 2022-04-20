<template>
  <div class="artists">
    <AppLoader v-if="isLoading" />
    <p v-else>Artists</p>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useStoreArtists } from '@/store/storeArtists';

import AppLoader from '@/components/AppLoader.vue';

const isLoading = ref(true);

const storeArtists = useStoreArtists();

onMounted(async () => {
  await storeArtists.downloadArtists();
  isLoading.value = false;
});
</script>
