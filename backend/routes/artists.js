/* eslint-disable no-undef */
const express = require('express');
const router = express.Router();
const busboy = require('busboy');
const { v4: uuidv4, validate } = require('uuid');
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

router.post('/new', (request, response) => {
  const bb = busboy({ headers: request.headers });

  const fields = {};

  bb.on('field', (name, value) => (fields[name] = value));

  const exit = (message = '') => {
    request.unpipe(bb);
    response.writeHead(500, { Connection: 'close' });
    message.length > 0 ? response.end(message) : response.end();
  };

  bb.on('error', () => exit('Could not parse request'));

  bb.on('close', () => {
    if (!(fields?.name && fields?.name.length > 0)) {
      return exit("Field 'name' was invalid.");
    }

    if (!(fields?.imageUrl && fields?.imageUrl.length > 0)) {
      return exit("Field 'imageUrl' was invalid.");
    }

    const artist = {
      id: uuidv4(),
      name: fields.name,
      imageUrl: fields.imageUrl
    };

    db.collection('artists').doc(artist.id).set(artist);
    response.status(200).json({ success: true, artist });
  });

  request.pipe(bb);
});

module.exports = router;
