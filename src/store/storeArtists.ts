import { defineStore } from 'pinia';

import type { Artist } from '@/types/Artist';

export const useStoreArtists = defineStore('storeArtists', {
  state: () => {
    return {
      artists: [] as Artist[]
    };
  }
});
