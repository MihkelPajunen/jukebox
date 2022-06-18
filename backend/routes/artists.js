/* eslint-disable no-undef */
const express = require('express');
const router = express.Router();
const { validate } = require('uuid');
const { capitalize } = require('../utils/functions');

const db = require('../firebase');

router.get('/', async (_request, response) => {
  const artists = [];

  const snapshot = await db.collection('artists').get();
  snapshot.forEach((document) => artists.push(document.data()));

  if (artists.length < 1) {
    return response.status(404).json({ success: false, artists });
  }

  response.status(200).json({ success: true, artists });
});

router.get('/:artist', async (request, response) => {
  // retrieve artist data by valid uuid
  if (validate(request.params.artist)) {
    const snapshot = await db.collection('artists').doc(request.params.artist).get();

    if (!snapshot.data()) {
      return response.status(404).json({ success: false, artist: {} });
    }

    return response.status(200).json({ success: true, artist: snapshot.data() });
  }

  // retrieve artist data by artist name
  let artist = decodeURI(request.params.artist).split(' ');
  artist = artist.map((element) => capitalize(element));
  artist = artist.join(' ');

  const snapshot = await db.collection('artists').where('name', '==', artist).limit(1).get();

  if (snapshot.empty) {
    return response.status(404).json({ success: false, artist: {} });
  }

  response.status(200).json({ success: true, artist: snapshot.docs[0].data() });
});

router.get('/:id/tracks', async (request, response) => {
  const tracks = [];

  const snapshot = await db.collection('tracks').where('artist', '==', request.params.id).get();
  snapshot.forEach((document) => tracks.push(document.data()));

  if (tracks.length < 1) {
    return response.status(404).json({ success: false, tracks });
  }

  response.status(200).json({ success: true, tracks });
});

module.exports = router;
