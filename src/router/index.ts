import { createRouter, createWebHistory } from 'vue-router';

import type { RouteLocationNormalized } from 'vue-router';

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
      path: '/:notFound(.*)',
      redirect: '/artists'
    },
    {
      path: '/artists',
      name: 'artists',
      component: ArtistsView,
      meta: { title: 'Artists' }
    },
    {
      path: '/artists/:id',
      name: 'artist',
      component: ArtistView
    },
    {
      path: '/tracks',
      name: 'tracks',
      component: TracksView,
      meta: { title: 'Tracks' }
    },
    {
      path: '/tracks/:id',
      name: 'track',
      component: TrackView
    }
  ]
});

router.beforeEach((to: RouteLocationNormalized & { meta: { title?: string } }, _from, next) => {
  document.title = `${import.meta.env.VITE_APP_TITLE} ${to.meta.title ? `| ${to.meta.title}` : ''}`;
  next();
});

export default router;
