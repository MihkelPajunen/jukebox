<template>
  <div class="artist">
    <AppLoader v-if="isLoading" />
    <div v-else class="columns is-centered is-mobile is-multiline" data-aos="fade-left">
      <div v-if="!artist" class="column is-narrow">
        <div :class="['notification has-text-centered', notification.type, 'p-4']">
          <p>{{ notification.message }}</p>
        </div>
      </div>
      <template v-else>
        <div class="column is-12-mobile is-flex is-flex-direction-column">
          <AppImage :imageUrl="artist.imageUrl" />
          <button v-if="tracks.length > 0" @click="viewRandomTrack" class="button is-info mt-2">
            <FontAwesome class="mr-2" icon="music" />Explore their music
          </button>
        </div>
        <div class="column is-12-mobile">
          <h1 class="title is-size-2 mb-4">{{ artist.name }}</h1>
          <h2 class="title is-size-6 mb-2">Members</h2>
          <ul class="mb-4">
            <li v-for="member in artist.members.slice(0, 4)" :key="member">
              <p>{{ member }}</p>
            </li>
          </ul>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useStoreArtists } from '@/store/storeArtists';
import { useStoreTracks } from '@/store/storeTracks';
import { useRoute, useRouter } from 'vue-router';
import { getErrorMessage } from '@/utils/functions';

import AppLoader from '@/components/AppLoader.vue';
import AppImage from '@/components/AppImage.vue';

import type { Artist } from '@/types/Artist';
import type { Track } from '@/types/Track';
import type { RouteLocationNormalizedLoaded } from 'vue-router';

const isLoading = ref(true);

const notification = ref({
  type: 'is-warning',
  message: 'There is no artist data to be found.'
});

const artist = ref<Artist | undefined>(undefined);
const tracks = ref<Track[]>([]);

const storeArtists = useStoreArtists();
const storeTracks = useStoreTracks();

const router = useRouter();
const route = useRoute() as RouteLocationNormalizedLoaded & { params: { id: string } };

const viewRandomTrack = () => {
  const index = Math.floor(Math.random() * tracks.value.length);
  router.push({ path: `/tracks/${tracks.value[index].id}` });
};

onMounted(async () => {
  artist.value = storeArtists.getArtist(route.params.id);

  if (!artist.value) {
    try {
      await storeArtists.downloadArtist(route.params.id);
      artist.value = storeArtists.getArtist(route.params.id);
    } catch (error) {
      notification.value.type = 'is-danger';
      notification.value.message = getErrorMessage(error);
    }
  }

  if (artist.value?.id) {
    await storeTracks.downloadTracksByArtist(artist.value.id);
    tracks.value = storeTracks.getTracksByArtist(artist.value.id);
  }

  if (!artist.value) {
    document.title = `${import.meta.env.VITE_APP_TITLE} | There is no artist data to be found`;
  }

  if (artist.value) {
    document.title = `${import.meta.env.VITE_APP_TITLE} | ${artist.value.name}`;
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
