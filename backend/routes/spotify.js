/* eslint-disable no-undef */
const express = require('express');
const router = express.Router();
const SpotifyWebApi = require('spotify-web-api-node');
const { titleize } = require('../utils/functions');

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET
});

const authenticate = async () => {
  const data = await spotifyApi.clientCredentialsGrant();
  spotifyApi.setAccessToken(data.body.access_token);
};

const getSpotifyArtist = async (artist) => {
  if (!artist) return null;

  await authenticate();

  try {
    const response = await spotifyApi.getArtist(artist);

    return {
      name: titleize(response.body.name),
      imageUrl: response.body.images[0].url
    };
  } catch {
    return null;
  }
};

router.get('/artists/:artist', async (request, response) => {
  const artist = await getSpotifyArtist(request.params.artist);

  if (!artist) return response.status(404).json({ success: false, artist: {} });
  response.status(200).json({ success: true, artist });
});

const getSpotifyTrack = async (artist, track, album = undefined) => {
  if (!artist || !track) return null;

  await authenticate();

  const query = `${artist.toLowerCase()} - ${track.toLowerCase()}`;
  const response = await spotifyApi.searchTracks(query);

  if (response.body.tracks.total === 0) return null;

  // search for a track that is included in a certain album
  let result = Object.keys(response.body.tracks.items).forEach((key) => {
    if (!album) return null;

    if (response.body.tracks.items[key].album.name.toLowerCase() === album.toLowerCase()) {
      return {
        artist: {
          id: response.body.tracks.items[key].artists[0].id,
          name: titleize(response.body.tracks.items[key].artists[0].name)
        },
        title: titleize(response.body.tracks.items[key].name),
        album: {
          title: titleize(response.body.tracks.items[key].album.name),
          imageUrl: response.body.tracks.items[key].album.images[0].url
        }
      };
    }
  });

  if (!result) {
    return {
      artist: {
        id: response.body.tracks.items[0].artists[0].id,
        name: titleize(response.body.tracks.items[0].artists[0].name)
      },
      title: titleize(response.body.tracks.items[0].name),
      album: {
        title: titleize(response.body.tracks.items[0].album.name),
        imageUrl: response.body.tracks.items[0].album.images[0].url
      }
    };
  }
};

router.get('/artists/:artist/tracks/:track', async (request, response) => {
  const track = await getSpotifyTrack(
    decodeURI(request.params.artist),
    decodeURI(request.params.track),
    request.query?.album ?? decodeURI(request.query.album)
  );

  if (!track) return response.status(404).json({ success: false, track: {} });
  response.status(200).json({ success: true, track });
});

module.exports = { router, getSpotifyArtist, getSpotifyTrack };
