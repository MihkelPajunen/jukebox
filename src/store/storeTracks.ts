import { defineStore } from 'pinia';
import axios from 'axios';

import type { Track } from '@/types/Track';
import type { Unreliable } from '@/types/Unreliable';

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
    },
    getTracksByArtist(state) {
      return (id: string) => state.tracks.filter((track) => track.artist === id);
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
        if ((<Unreliable<{ response: unknown }>>error)?.response === undefined) {
          throw new Error('Could not download any track data.');
        }
      }
    },
    async downloadTrack(id: string) {
      try {
        const response = await axios.get<{ success: boolean; track: Track }>(
          `${import.meta.env.VITE_APP_API}/tracks/${id}`
        );

        const availableTracks = new Set(this.tracks.map((track) => track.id));
        !availableTracks.has(response.data.track.id) && this.tracks.push(response.data.track);
      } catch (error) {
        if ((<Unreliable<{ response: unknown }>>error)?.response === undefined) {
          throw new Error('Could not download any track data.');
        }
      }
    },
    async downloadTracksByArtist(id: string) {
      try {
        const response = await axios.get<{ success: boolean; tracks: Track[] }>(
          `${import.meta.env.VITE_APP_API}/artists/${id}/tracks`
        );

        const availableTracks = new Set(this.tracks.map((track) => track.id));

        this.tracks = [
          ...this.tracks,
          ...response.data.tracks.filter((track) => !availableTracks.has(track.id))
        ];
      } catch (error) {
        if ((<Unreliable<{ response: unknown }>>error)?.response === undefined) {
          throw new Error('Could not download any track data.');
        }
      }
    }
  }
});
