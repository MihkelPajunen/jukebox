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

router.post('/', (request, response) => {
  const bb = busboy({ headers: request.headers });

  const fields = {};

  bb.on('field', (name, value) => (fields[name] = value));

  const fileObject = {};

  const errorResponse = (status, message = '') => {
    request.unpipe(bb);
    response.writeHead(status, { Connection: 'close' });
    message.length > 0 ? response.end(message) : response.end();
  };

  bb.on('file', (_name, file, info) => {
    fileObject['mimeType'] = info.mimeType;

    if (!['audio/flac', 'audio/x-flac'].includes(fileObject.mimeType)) {
      errorResponse(415, 'Request includes an unsupported file type.');
    }

    fileObject['filePath'] = path.join(os.tmpdir(), `${uuidv4()}.flac`);

    const stream = fs.createWriteStream(fileObject.filePath);

    fileObject['fileSize'] = 0;

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

    const spotifyTrack = await getSpotifyTrack(fields.artist, fields.title, fields.album);

    const extras = {};

    if (spotifyTrack) {
      fields.title = spotifyTrack.title;
      fields.album = spotifyTrack.album.title;
      fields['imageUrl'] = spotifyTrack.album.imageUrl;

      if (!(await getArtist(spotifyTrack.artist.name))) {
        const spotifyArtist = await getSpotifyArtist(spotifyTrack.artist.id);

        const artist = {
          id: uuidv4(),
          name: spotifyArtist.name,
          imageUrl: spotifyArtist.imageUrl
        };

        createArtist(artist);
        fields.artist = artist.id;
        extras['artist'] = artist;
      }
    }

    response.status(200).json({ success: true, ...extras });
  });

  request.pipe(bb);
});

module.exports = router;
