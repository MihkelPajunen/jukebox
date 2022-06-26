/* eslint-disable no-undef */
const express = require('express');
const router = express.Router();
const { validate } = require('uuid');
const { titleize } = require('../utils/functions');
const { firestore } = require('../firebase');

router.get('/', async (_request, response) => {
  const tracks = [];

  const snapshot = await firestore.collection('tracks').get();
  snapshot.forEach((document) => tracks.push(document.data()));

  if (tracks.length < 1) {
    return response.status(404).json({ success: false, tracks });
  }

  response.status(200).json({ success: true, tracks });
});

const getTrack = async (track) => {
  if (validate(track)) {
    const snapshot = await firestore.collection('tracks').doc(track).get();

    if (!snapshot.data()) return null;
    return snapshot.data();
  }

  track = titleize(decodeURI(track));

  const snapshot = await firestore.collection('tracks').where('title', '==', track).limit(1).get();

  if (snapshot.empty) return null;
  return snapshot.docs[0].data();
};

router.get('/:track', async (request, response) => {
  const track = await getTrack(request.params.track);

  if (!track) return response.status(404).json({ success: false, track: {} });
  response.status(200).json({ success: true, track });
});

const createTrack = (track) => {
  const keys = ['id', 'title', 'album', 'artist', 'imageUrl', 'fileUrl'];
  for (key in keys) if (!(keys[key] in track)) return;
  firestore.collection('tracks').doc(track.id).set(track);
};

module.exports = { router, getTrack, createTrack };
