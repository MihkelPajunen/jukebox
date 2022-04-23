<template>
  <div class="artists">
    <AppLoader v-if="isLoading" />
    <div v-else class="columns is-centered is-mobile is-multiline">
      <div v-if="storeArtists.isEmpty" class="column is-narrow">
        <div :class="['notification has-text-centered', notification.type, 'p-4']">
          {{ notification.message }}
        </div>
      </div>
      <template v-else>
        <div v-for="artist in storeArtists.artists" :key="artist.id" class="column is-12-mobile">
          <AppCard :name="artist.name" :image-url="artist.imageUrl" />
        </div>
        <!-- insert (n - 1) empty columns to push content to the left -->
        <div class="column is-12-mobile"></div>
        <div class="column is-12-mobile"></div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useStoreArtists } from '@/store/storeArtists';
import { getErrorMessage } from '@/utils/functions';

import AppLoader from '@/components/AppLoader.vue';
import AppCard from '@/components/AppCard.vue';

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
    notification.value.message = getErrorMessage(error);
  }

  isLoading.value = false;
});
</script>

<style scoped lang="sass">
@import 'bulma/bulma'

.is-12-mobile
  max-width: 328px
  @include from($tablet)
    min-width: 328px
</style>
