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

  const artist = {};
  const track = { id: uuidv4() };

  bb.on('field', (name, value) => {
    switch (name) {
      case 'artist': {
        artist['name'] = value;
        break;
      }
      default: {
        track[name] = value;
      }
    }
  });

  const fileObject = { fileSize: 0 };

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

    file.on('data', (data) => {
      stream.write(data);
      fileObject.fileSize += data.length;
    });

    file.on('end', () => stream.close());
  });

  bb.on('error', () => errorResponse(500, 'Request could not be parsed.'));

  bb.on('close', async () => {
    if (!artist?.name || !track?.title || !track?.album) {
      return errorResponse(422, 'Request did not specify all required fields.');
    }

    if (!fileObject) return errorResponse(422, 'Request did not contain a file.');

    const spotifyTrack = await getSpotifyTrack(artist.name, track.title, track.album);

    if (spotifyTrack) {
      track.title = spotifyTrack.title;
      track.album = spotifyTrack.album.title;
      track['imageUrl'] = spotifyTrack.album.imageUrl;

      const artistExists = await getArtist(spotifyTrack.artist.name);

      if (artistExists) {
        artist['id'] = artistExists.id;
        artist.name = artistExists.name;
      } else {
        const spotifyArtist = await getSpotifyArtist(spotifyTrack.artist.id);

        artist['id'] = uuidv4();
        artist.name = spotifyArtist.name;
        artist['imageUrl'] = spotifyArtist.imageUrl;

        createArtist(artist);
        artist['new'] = true;
      }
    }

    response.status(200).json({ success: true, artist, track });
  });

  request.pipe(bb);
});

module.exports = router;
