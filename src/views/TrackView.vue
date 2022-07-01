<template>
  <div class="track">
    <AppLoader v-if="isLoading" />
    <div v-else class="columns is-centered is-mobile is-multiline" data-aos="fade-left">
      <div v-if="!track" class="column is-narrow">
        <div :class="['notification has-text-centered', notification.type, 'p-4']">
          <p>{{ notification.message }}</p>
        </div>
      </div>
      <template v-else>
        <div class="column is-12-mobile is-flex is-flex-direction-column">
          <AppImage :imageUrl="track.imageUrl" />
        </div>
        <div class="column is-12-mobile">
          <h1 class="title is-size-4 mb-4">
            {{ getArtistName(track.artist) }} - {{ track.title }}
          </h1>
          <h2 class="title is-size-6 mb-2">Information</h2>
          <ul class="mb-4">
            <li>Artist: {{ getArtistName(track.artist) }}</li>
            <li>Track: {{ track.title }}</li>
            <li>Album: {{ track.album }}</li>
          </ul>
          <h2 class="title is-size-6 mb-2">Metadata</h2>
          <ul class="mb-4">
            <li>Size: {{ (track.metadata.size / 1000000).toFixed(2) }}MB</li>
            <li>Format: {{ track.metadata.format }}</li>
            <li>Bitrate: {{ (track.metadata.bitrate / 1000).toFixed(2) }}kbit/s</li>
            <li>Duration: {{ formatTime(track.metadata.duration) }}</li>
          </ul>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useStoreTracks } from '@/store/storeTracks';
import { useStoreArtists } from '@/store/storeArtists';
import { useRoute } from 'vue-router';
import { formatTime, getErrorMessage } from '@/utils/functions';

import AppLoader from '@/components/AppLoader.vue';
import AppImage from '@/components/AppImage.vue';

import type { Track } from '@/types/Track';
import type { RouteLocationNormalizedLoaded } from 'vue-router';

const isLoading = ref(true);

const notification = ref({
  type: 'is-warning',
  message: 'There is no track data to be found.'
});

const track = ref<Track | undefined>(undefined);

const storeTracks = useStoreTracks();
const storeArtists = useStoreArtists();

const getArtistName = (id: string) => storeArtists.getArtist(id)?.name || 'Unknown';

const route = useRoute() as RouteLocationNormalizedLoaded & { params: { id: string } };

onMounted(async () => {
  track.value = storeTracks.getTrack(route.params.id);

  if (!track.value) {
    try {
      await storeTracks.downloadTrack(route.params.id);
      track.value = storeTracks.getTrack(route.params.id);
      track.value?.artist && (await storeArtists.downloadArtist(track.value.artist));
    } catch (error) {
      notification.value.type = 'is-danger';
      notification.value.message = getErrorMessage(error);
    }
  }

  if (!track.value) {
    document.title = `${import.meta.env.VITE_APP_TITLE} | There is no track data to be found`;
  }

  if (track.value && getArtistName(track.value.artist)) {
    const trackDetails = `${getArtistName(track.value.artist)} - ${track.value.title}`;
    document.title = `${import.meta.env.VITE_APP_TITLE} | ${trackDetails}`;
  }

  isLoading.value = false;
});
</script>

<style scoped lang="sass">
@import 'bulma/bulma'

.is-12-mobile
  max-width: 426px
  @include from($tablet)
    max-width: 372px
</style>
