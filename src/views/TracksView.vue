<template>
  <div class="tracks">
    <Teleport to="#navbar-start">
      <div class="navbar-item">
        <AppSearch v-model="searchString" placeholder="Search for a track" :focus="true" />
      </div>
    </Teleport>
    <AppLoader v-if="isLoading" />
    <div v-else class="columns is-centered is-mobile is-multiline">
      <div v-if="storeTracks.isEmpty" class="column is-narrow">
        <div :class="['notification has-text-centered', notification.type, 'p-4']">
          <p>{{ notification.message }}</p>
        </div>
      </div>
      <template v-else>
        <div v-for="track in filteredTracks" :key="track.id" class="column is-12-mobile">
          <RouterLink :to="{ name: 'track', params: { id: track.id } }">
            <AppCard
              :id="track.id"
              :text="`${getArtistName(track.artist)} - ${track.title}`"
              :image-url="track.imageUrl"
            />
          </RouterLink>
        </div>
        <!-- insert (n - 1) empty columns to push content to the left -->
        <div class="column is-12-mobile"></div>
        <div class="column is-12-mobile"></div>
        <div class="column is-12-mobile"></div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useStoreTracks } from '@/store/storeTracks';
import { useStoreArtists } from '@/store/storeArtists';
import { tokenize, getErrorMessage } from '@/utils/functions';

import AppLoader from '@/components/AppLoader.vue';
import AppSearch from '@/components/AppSearch.vue';
import AppCard from '@/components/AppCard.vue';

import type { Track } from '@/types/Track';

const isLoading = ref(true);

const notification = ref({
  type: 'is-warning',
  message: 'There is no track data to be found.'
});

const storeTracks = useStoreTracks();
const storeArtists = useStoreArtists();

const getArtistName = (id: string) => storeArtists.getArtist(id)?.name || 'Unknown';

const searchString = ref('');

const filteredTracks = computed(() => {
  const searchTerms = tokenize(searchString.value.toLowerCase());
  const searchResults: Array<{ track: Track; accuracy: number }> = [];

  storeTracks.tracks.forEach((track) => {
    const artist = tokenize(getArtistName(track.artist).toLowerCase());
    const title = tokenize(track.title.toLowerCase());

    searchTerms.forEach((keyword) => {
      let index = searchResults.findIndex((element) => element.track.id === track.id);
      const regex = new RegExp(`^${keyword}`, 'i');

      const appendSearchResult = (track: Track) => {
        searchResults.push({ track: track, accuracy: 0 });
        index = searchResults.length - 1;
      };

      if (artist.find((element) => element.match(regex))) {
        index === -1 && appendSearchResult(track);
        index !== -1 && searchResults[index].accuracy++;
      }

      if (title.find((element) => element.match(regex))) {
        index === -1 && appendSearchResult(track);
        index !== -1 && searchResults[index].accuracy++;
      }
    });
  });

  searchResults.sort((a, b) => b.accuracy - a.accuracy);
  const results = searchResults.map((result) => result.track);
  return results.length > 0 ? results : storeTracks.tracks;
});

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
  max-width: 372.5px
  @include from($tablet)
    min-width: 372.5px
</style>
