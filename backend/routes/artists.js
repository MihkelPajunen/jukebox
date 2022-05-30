/* eslint-disable no-undef */
const express = require('express');
const router = express.Router();

const db = require('../firebase');

router.get('/', async (_request, response) => {
  response.set('Access-Control-Allow-Origin', '*');

  const artists = [];

  const snapshot = await db.collection('artists').get();
  snapshot.forEach((document) => artists.push(document.data()));

  if (artists.length < 1) {
    return response.status(404).json({ success: false, artists });
  }

  response.status(200).json({ success: true, artists });
});

router.get('/:id', async (request, response) => {
  response.set('Access-Control-Allow-Origin', '*');

  const snapshot = await db.collection('artists').doc(request.params.id).get();

  if (!snapshot.data()) {
    return response.status(404).json({ success: false, artist: {} });
  }

  response.status(200).json({ success: true, artist: snapshot.data() });
});

router.get('/:id/tracks', async (request, response) => {
  response.set('Access-Control-Allow-Origin', '*');

  const tracks = [];

  const snapshot = await db.collection('tracks').where('artist', '==', request.params.id).get();
  snapshot.forEach((document) => tracks.push(document.data()));

  if (tracks.length < 1) {
    return response.status(404).json({ success: false, tracks });
  }

  response.status(200).json({ success: true, tracks: tracks });
});

module.exports = router;
