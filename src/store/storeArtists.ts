import { defineStore } from 'pinia';
import axios from 'axios';

import type { Artist } from '@/types/Artist';

export const useStoreArtists = defineStore('storeArtists', {
  state: () => {
    return {
      artists: [] as Artist[]
    };
  },
  getters: {
    isEmpty(state) {
      return state.artists.length < 1;
    }
  },
  actions: {
    async downloadArtists() {
      try {
        const response = await axios.get<{ success: boolean; artists: Artist[] }>(
          `${import.meta.env.VITE_APP_API}/artists`
        );
        this.artists = response.data.artists;
      } catch {
        throw new Error('Could not download any artist data.');
      }
    }
  }
});
