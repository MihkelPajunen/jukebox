/* eslint-disable no-undef */
const express = require('express');
const router = express.Router();
const { validate } = require('uuid');
const { titleize } = require('../utils/functions');
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

const getArtist = async (artist) => {
  if (validate(artist)) {
    const snapshot = await db.collection('artists').doc(artist).get();

    if (!snapshot.data()) return null;
    return snapshot.data();
  }

  artist = titleize(decodeURI(artist));

  const snapshot = await db.collection('artists').where('name', '==', artist).limit(1).get();

  if (snapshot.empty) return null;
  return snapshot.docs[0].data();
};

router.get('/:artist', async (request, response) => {
  const artist = await getArtist(request.params.artist);

  if (!artist) return response.status(404).json({ success: false, artist: {} });
  response.status(200).json({ success: true, artist });
});

router.get('/:artist/tracks', async (request, response) => {
  const tracks = [];

  const artist = await getArtist(request.params.artist);
  if (!artist) return response.status(404).json({ success: false, tracks });

  const snapshot = await db.collection('tracks').where('artist', '==', artist.id).get();
  snapshot.forEach((document) => tracks.push(document.data()));

  if (tracks.length < 1) return response.status(404).json({ success: false, tracks });
  response.status(200).json({ success: true, tracks });
});

module.exports = { router, getArtist };
