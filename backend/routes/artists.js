/* eslint-disable no-undef */
const express = require('express');
const router = express.Router();

const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

const serviceAccount = require('../serviceAccountKey.json');

initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore();

router.get('/', async (_request, response) => {
  response.set('Access-Control-Allow-Origin', '*');
  const artists = [];

  const snapshot = await db.collection('artists').get();
  snapshot.forEach((document) => artists.push(document.data()));

  response.status(200).json({ success: true, artists });
});

module.exports = router;
