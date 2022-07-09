<template>
  <div class="artists">
    <Teleport to="#navbar-start">
      <div class="navbar-item">
        <AppSearch v-model="searchString" placeholder="Search for an artist" :focus="true" />
      </div>
    </Teleport>
    <AppLoader v-if="isLoading" />
    <div v-else class="columns is-centered is-mobile is-multiline">
      <div v-if="storeArtists.isEmpty" class="column is-narrow">
        <div :class="['notification has-text-centered', notification.type, 'p-4']">
          <p>{{ notification.message }}</p>
        </div>
      </div>
      <template v-else>
        <div v-for="artist in filteredArtists" :key="artist.id" class="column is-12-mobile">
          <RouterLink :to="{ name: 'artist', params: { id: artist.id } }">
            <AppCard :id="artist.id" :text="artist.name" :image-url="artist.imageUrl" />
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
import { useStoreArtists } from '@/store/storeArtists';
import { tokenize, getErrorMessage } from '@/utils/functions';

import AppLoader from '@/components/AppLoader.vue';
import AppSearch from '@/components/AppSearch.vue';
import AppCard from '@/components/AppCard.vue';

import type { Artist } from '@/types/Artist';

const isLoading = ref(true);

const notification = ref({
  type: 'is-warning',
  message: 'There is no artist data to be found.'
});

const storeArtists = useStoreArtists();

const searchString = ref('');

const filteredArtists = computed(() => {
  const searchTerms = tokenize(searchString.value.toLowerCase());
  const searchResults: Array<{ artist: Artist; accuracy: number }> = [];

  storeArtists.artists.forEach((artist) => {
    const name = tokenize(artist.name.toLowerCase());

    searchTerms.forEach((keyword) => {
      const index = searchResults.findIndex((element) => element.artist.id === artist.id);
      const regex = new RegExp(`^${keyword}`, 'i');

      if (name.find((element) => element.match(regex))) {
        index === -1 && searchResults.push({ artist: artist, accuracy: 1 });
        index !== -1 && searchResults[index].accuracy++;
      }
    });
  });

  searchResults.sort((a, b) => b.accuracy - a.accuracy);
  const results = searchResults.map((result) => result.artist);
  return results.length > 0 ? results : storeArtists.artists;
});

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
  max-width: 372.5px
  @include from($tablet)
    min-width: 372.5px
</style>
