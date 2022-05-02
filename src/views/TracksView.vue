<template>
  <div class="tracks">
    <AppLoader v-if="isLoading" />
    <div v-else class="columns is-centered is-mobile is-multiline">
      <div v-if="storeTracks.isEmpty" class="column is-narrow">
        <div :class="['notification has-text-centered', notification.type, 'p-4']">
          <p>{{ notification.message }}</p>
        </div>
      </div>
      <template v-else>
        <div v-for="track in storeTracks.tracks" :key="track.id" class="column is-12-mobile">
          <RouterLink :to="{ name: 'track', params: { id: track.id } }">
            <AppCard
              :id="track.id"
              :text="`${getName(track.artist)} - ${track.title}`"
              :image-url="track.imageUrl"
            />
          </RouterLink>
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
import { useStoreTracks } from '@/store/storeTracks';
import { useStoreArtists } from '@/store/storeArtists';
import { getErrorMessage } from '@/utils/functions';

import AppLoader from '@/components/AppLoader.vue';
import AppCard from '@/components/AppCard.vue';

const isLoading = ref(true);

const notification = ref({
  type: 'is-warning',
  message: 'There is no track data to be found.'
});

const storeTracks = useStoreTracks();
const storeArtists = useStoreArtists();

const getName = (id: string) => {
  return storeArtists.getArtist(id)?.name || 'Unknown';
};

onMounted(async () => {
  try {
    await storeTracks.downloadTracks();
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
