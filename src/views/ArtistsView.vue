<template>
  <div class="artists">
    <AppLoader v-if="isLoading" />
    <div v-else class="columns is-centered">
      <div v-if="storeArtists.isEmpty" class="column is-narrow">
        <div :class="['notification has-text-centered', notification.type, 'p-4']">
          {{ notification.message }}
        </div>
      </div>
      <div v-else class="column is-narrow">
        <p>Artists</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useStoreArtists } from '@/store/storeArtists';

import AppLoader from '@/components/AppLoader.vue';

const isLoading = ref(true);

const notification = ref({
  type: 'is-warning',
  message: 'There is no artist data to be found.'
});

const storeArtists = useStoreArtists();

onMounted(async () => {
  try {
    await storeArtists.downloadArtists();
  } catch (error) {
    notification.value.type = 'is-danger';
    notification.value.message = String(error);
  }

  isLoading.value = false;
});
</script>
