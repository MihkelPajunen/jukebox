/* eslint-disable no-undef */
const express = require('express');
const router = express.Router();
require('dotenv').config();
const SpotifyWebApi = require('spotify-web-api-node');
const { capitalize } = require('./utils/functions');

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET
});

const authenticate = async (_request, _response, next) => {
  const data = await spotifyApi.clientCredentialsGrant();
  spotifyApi.setAccessToken(data.body.access_token);
  next();
};

router.get('/artists/:id', authenticate, async (request, response) => {
  const artist = {};

  try {
    const result = await spotifyApi.getArtist(request.params.id);

    artist['name'] = result.body.name;
    artist['imageUrl'] = result.body.images[0].url;

    response.status(200).json({ success: true, artist });
  } catch {
    response.status(404).json({ success: false, artist });
  }
});

router.get('/artists/:artist/tracks/:title', authenticate, async (request, response) => {
  const track = {};

  const parameters = {
    ...request.params,
    ...request.query
  };

  for (const key of Object.keys(parameters)) {
    let value = decodeURI(parameters[key]).split(' ');
    value = value.map((element) => capitalize(element));

    if (key === 'title') {
      track[key] = value.join(' ');
      continue;
    }

    track[key] = { name: value.join(' ') };
  }

  const result = await spotifyApi.searchTracks(`${track.artist.name} - ${track.title}`);

  if (result.statusCode !== 200 || result.body.tracks.total === 0) {
    return response.status(404).json({ success: false, track: {} });
  }

  // choose a search result based on optional query parameter
  for (const key of Object.keys(result.body.tracks.items)) {
    if (!track?.album?.name) break; // check for the existence of said query parameter

    if (result.body.tracks.items[key].album.name === track.album.name) {
      track.artist['id'] = result.body.tracks.items[key].artists[0].id;
      track.title = result.body.tracks.items[key].name;
      track.album['imageUrl'] = result.body.tracks.items[key].album.images[0].url;
      break;
    }
  }

  // choose the top search result as a last resort
  if (!track.artist?.id) {
    track.artist['id'] = result.body.tracks.items[0].artists[0].id;
    track.title = result.body.tracks.items[0].name;

    track['album'] = {
      name: result.body.tracks.items[0].album.name,
      imageUrl: result.body.tracks.items[0].album.images[0].url
    };
  }

  response.status(200).json({ success: true, track });
});

module.exports = router;
