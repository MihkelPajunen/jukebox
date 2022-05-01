import { defineStore } from 'pinia';
import axios from 'axios';
import { hasProperty } from '@/utils/functions';

import type { Track } from '@/types/Track';

export const useStoreTracks = defineStore('storeTracks', {
  state: () => {
    return {
      tracks: [] as Track[]
    };
  },
  getters: {
    isEmpty(state) {
      return state.tracks.length < 1;
    },
    getTrack(state) {
      return (id: string) => state.tracks.find((track) => track.id === id);
    }
  },
  actions: {
    async downloadTracks() {
      try {
        const response = await axios.get<{ success: boolean; tracks: Track[] }>(
          `${import.meta.env.VITE_APP_API}/tracks`
        );
        this.tracks = response.data.tracks;
      } catch (error) {
        if (!hasProperty(error, 'response')) {
          throw new Error('Could not download any track data.');
        }
      }
    },
    async downloadTrack(id: string) {
      try {
        const response = await axios.get<{ success: boolean; track: Track }>(
          `${import.meta.env.VITE_APP_API}/tracks/${id}`
        );

        response.data.success && this.tracks.push(response.data.track);
      } catch (error) {
        if (!hasProperty(error, 'response')) {
          throw new Error('Could not download any track data.');
        }
      }
    }
  }
});
