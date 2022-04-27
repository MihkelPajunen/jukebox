<template>
  <div class="artist">
    <AppLoader v-if="isLoading" />
    <div v-else class="columns is-centered is-mobile is-multiline">
      <div v-if="!artist" class="column is-narrow">
        <div :class="['notification has-text-centered', notification.type, 'p-4']">
          {{ notification.message }}
        </div>
      </div>
      <div v-else class="column">
        <p>{{ artist.name }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useStoreArtists } from '@/store/storeArtists';
import { useRoute } from 'vue-router';
import { getErrorMessage } from '@/utils/functions';

import AppLoader from '@/components/AppLoader.vue';

import type { Artist } from '@/types/Artist';

const isLoading = ref(true);

const notification = ref({
  type: 'is-warning',
  message: 'There is no artist data to be found.'
});

const artist = ref<Artist | undefined>(undefined);

const storeArtists = useStoreArtists();

const route = useRoute();

onMounted(async () => {
  artist.value = storeArtists.getArtist(route.params.id as string);

  if (!artist.value) {
    try {
      await storeArtists.downloadArtist(route.params.id as string);
      artist.value = storeArtists.getArtist(route.params.id as string);
    } catch (error) {
      notification.value.type = 'is-danger';
      notification.value.message = getErrorMessage(error);
    }
  }

  isLoading.value = false;
});
</script>
