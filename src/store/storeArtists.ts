import { defineStore } from 'pinia';
import axios from 'axios';

import type { Artist } from '@/types/Artist';
import type { Unreliable } from '@/types/Unreliable';

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
        if ((<Unreliable<{ response: unknown }>>error)?.response === undefined) {
          throw new Error('Could not download any artist data.');
        }
      }
    },
    async downloadArtist(id: string) {
      try {
        const response = await axios.get<{ success: boolean; artist: Artist }>(
          `${import.meta.env.VITE_APP_API}/artists/${id}`
        );

        const availableArtists = new Set(this.artists.map((artist) => artist.id));
        !availableArtists.has(response.data.artist.id) && this.artists.push(response.data.artist);
      } catch (error) {
        if ((<Unreliable<{ response: unknown }>>error)?.response === undefined) {
          throw new Error('Could not download any artist data.');
        }
      }
    }
  }
});
