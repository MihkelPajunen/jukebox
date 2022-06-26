/* eslint-disable no-undef */
const express = require('express');
const router = express.Router();
const busboy = require('busboy');
const path = require('path');
const os = require('os');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const { getArtist, createArtist } = require('./artists');
const { getSpotifyTrack, getSpotifyArtist } = require('./spotify');
const mm = require('music-metadata');
const { bucket } = require('../firebase');
const { titleize } = require('../utils/functions');
const { createTrack } = require('./tracks');

router.post('/', (request, response) => {
  const bb = busboy({ headers: request.headers });

  const fields = {};
  bb.on('field', (name, value) => (fields[name] = value));

  const errorResponse = (status, message = '') => {
    request.unpipe(bb);
    response.writeHead(status, { Connection: 'close' });
    message.length > 0 ? response.end(message) : response.end();
  };

  const fileObject = { fileSize: 0 };

  bb.on('file', (_name, file, info) => {
    fileObject['mimeType'] = info.mimeType;

    if (!['audio/flac', 'audio/x-flac'].includes(fileObject.mimeType)) {
      errorResponse(415, 'Request includes an unsupported file type.');
    }

    fileObject['filePath'] = path.join(os.tmpdir(), `${uuidv4()}.flac`);

    const stream = fs.createWriteStream(fileObject.filePath);

    file.on('data', (data) => {
      stream.write(data);
      fileObject.fileSize += data.length;
    });

    file.on('end', () => stream.close());
  });

  bb.on('error', () => errorResponse(500, 'Request could not be parsed.'));

  bb.on('close', async () => {
    if (!fields?.artist || !fields?.title || !fields?.album) {
      return errorResponse(422, 'Request did not specify all required fields.');
    }

    if (!fileObject) return errorResponse(422, 'Request did not contain a file.');

    const track = {
      id: uuidv4(),
      title: titleize(fields.title),
      album: titleize(fields.album),
      artist: titleize(fields.artist),
      imageUrl: '',
      fileUrl: '',
      metadata: {
        size: fileObject.fileSize,
        format: fileObject.mimeType,
        bitrate: '',
        duration: ''
      }
    };

    try {
      const metdata = await mm.parseFile(fileObject.filePath);
      track.metadata.bitrate = metdata.format.bitrate;
      track.metadata.duration = metdata.format.duration;
    } catch {
      console.log('Metadata could not be extracted.');
    }

    let newArtist = false;

    const spotifyTrack = await getSpotifyTrack(track.artist, track.title, track.album);

    if (spotifyTrack) {
      track.title = spotifyTrack.title;
      track.album = spotifyTrack.album.title;
      track.imageUrl = spotifyTrack.album.imageUrl;

      const artistExists = await getArtist(spotifyTrack.artist.name);

      if (artistExists) {
        track.artist = artistExists.id;
      } else {
        const spotifyArtist = await getSpotifyArtist(spotifyTrack.artist.id);

        const artist = {
          id: uuidv4(),
          name: spotifyArtist.name,
          imageUrl: spotifyArtist.imageUrl
        };

        createArtist(artist);
        track.artist = artist.id;
        newArtist = true;
      }
    }

    const options = {
      uploadType: 'resumable',
      metadata: {
        metadata: {
          contentType: track.format,
          firebaseStorageDownloadTokens: track.id
        }
      }
    };

    bucket.upload(fileObject.filePath, options, (error, file) => {
      if (error) return errorResponse(500, 'File could not be uploaded.');

      track.fileUrl = 'https://firebasestorage.googleapis.com';
      track.fileUrl += `/v0/b/${bucket.name}/o/${file.name}?alt=media&token=${track.id}`;

      createTrack(track);
    });

    response.status(200).json({ success: true, newArtist, track });
  });

  request.pipe(bb);
});

module.exports = router;
