/* eslint-disable no-undef */
const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const { getStorage } = require('firebase-admin/storage');

const serviceAccount = require('./serviceAccountKey.json');

initializeApp({
  credential: cert(serviceAccount),
  storageBucket: process.env.GOOGLE_CLOUD_STORAGE_BUCKET
});

const firestore = getFirestore();
const bucket = getStorage().bucket();

module.exports = { firestore, bucket };
