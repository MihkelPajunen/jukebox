/* eslint-disable no-undef */
const express = require('express');
const router = express.Router();

const db = require('../firebase');

router.get('/', async (_request, response) => {
  const tracks = [];

  const snapshot = await db.collection('tracks').get();
  snapshot.forEach((document) => tracks.push(document.data()));

  if (tracks.length < 1) {
    return response.status(404).json({ success: false, tracks });
  }

  response.status(200).json({ success: true, tracks });
});

router.get('/:id', async (request, response) => {
  const snapshot = await db.collection('tracks').doc(request.params.id).get();

  if (!snapshot.data()) {
    return response.status(404).json({ success: false, track: {} });
  }

  response.status(200).json({ success: true, track: snapshot.data() });
});

module.exports = router;
