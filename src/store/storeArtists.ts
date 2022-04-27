import { defineStore } from 'pinia';
import axios from 'axios';
import { hasProperty } from '@/utils/functions';

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
    },
    getArtist(state) {
      return (id: string) => state.artists.find((artist) => artist.id === id);
    }
  },
  actions: {
    async downloadArtists() {
      try {
        const response = await axios.get<{ success: boolean; artists: Artist[] }>(
          `${import.meta.env.VITE_APP_API}/artists`
        );
        this.artists = response.data.artists;
      } catch (error) {
        if (!hasProperty(error, 'response')) {
          throw new Error('Could not download any artist data.');
        }
      }
    },
    async downloadArtist(id: string) {
      try {
        const response = await axios.get<{ success: boolean; artist: Artist }>(
          `${import.meta.env.VITE_APP_API}/artists/${id}`
        );

        response.data.success && this.artists.push(response.data.artist);
      } catch (error) {
        if (!hasProperty(error, 'response')) {
          throw new Error('Could not download any artist data.');
        }
      }
    }
  }
});
