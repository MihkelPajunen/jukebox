import { createRouter, createWebHistory } from 'vue-router';

import ArtistsView from '../views/ArtistsView.vue';
import ArtistView from '../views/ArtistView.vue';
import TracksView from '../views/TracksView.vue';
import TrackView from '../views/TrackView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/artists'
    },
    {
      path: '/artists',
      name: 'artists',
      component: ArtistsView
    },
    {
      path: '/artists/:id',
      name: 'artist',
      component: ArtistView
    },
    {
      path: '/tracks',
      name: 'tracks',
      component: TracksView
    },
    {
      path: '/tracks/:id',
      name: 'track',
      component: TrackView
    }
  ]
});

export default router;
