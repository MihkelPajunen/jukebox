import { defineStore } from 'pinia';
import axios from 'axios';

import type { Artist } from '@/types/Artist';

export const useStoreArtists = defineStore('storeArtists', {
  state: () => {
    return {
      artists: [] as Artist[]
    };
  },
  actions: {
    async downloadArtists() {
      try {
        const response = await axios.get<{ success: boolean; artists: Artist[] }>(
          `${import.meta.env.VITE_APP_API}/artists`
        );
        this.artists = response.data.artists;
      } catch (error) {
        console.log(error);
      }
    }
  }
});
