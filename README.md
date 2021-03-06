# Jukebox

This project presents a collection of artists and tracks, where each artist can have many tracks, and each track can have only one artist. These collections of objects are displayed neatly within a [Vue application](https://jukebox.mihkelpajunen.com) that runs in a browser.

## Features

- Each track contains detailed file information.
- Users can stream music from the web player.
- It is possible to directly download any track.

## Personal Ambitions

- Explore the Vue Framework and its ecosystem of libraries.
- Learn more about open web APIs for improved functionality.

## Keywords

- Vue
- Vue Router
- Pinia
- TypeScript
- Bulma
- Sass
- Node
- Express
- Firebase

# TypeScript Definitions

## Artist Object

```typescript
export interface Artist {
  id: string;
  name: string;
  imageUrl: string;
}
```

## Track Object

```typescript
export interface Track {
  id: string;
  title: string;
  album: string;
  artist: string;
  imageUrl: string;
  fileUrl: string;
  metadata: {
    size: number;
    format: string;
    bitrate: number;
    duration: number;
  };
  statistics: {
    playbacks: number;
    downloads: number;
  };
}
```

# API Documentation

This application builds upon a Node/Express server that returns JSON data. Note that this server is subject to <ins>cold starts</ins> after extended inactivity.

# Artists Endpoint

## Get all artists from /artists

```
https://jukebox-backend-europe.herokuapp.com/artists
```

This endpoint returns an `Array` of all the artists that exist in the database.

```json
{
  "success": true,
  "artists": [
    {
      "name": "Zero 7",
      "imageUrl": "https://i.scdn.co/image/ab6761610000e5eb85c10aefe83110535eea474c",
      "id": "b64a91f7-f8c0-4fcc-ba56-a0b9f19cdb29"
    }
  ]
}
```

## Get a specific artist from /artists/artist

```
https://jukebox-backend-europe.herokuapp.com/artists/b64a91f7-f8c0-4fcc-ba56-a0b9f19cdb29
```

**Note that this endpoint can also search for an artist by their name.**

```
https://jukebox-backend-europe.herokuapp.com/artists/zero 7
```

This endpoint returns an artist `Object` from the database if the artist exists.

```json
{
  "success": true,
  "artist": {
    "id": "b64a91f7-f8c0-4fcc-ba56-a0b9f19cdb29",
    "imageUrl": "https://i.scdn.co/image/ab6761610000e5eb85c10aefe83110535eea474c",
    "name": "Zero 7"
  }
}
```

## Get all tracks by a specific artist from /artists/artist/tracks

```
https://jukebox-backend-europe.herokuapp.com/artists/b64a91f7-f8c0-4fcc-ba56-a0b9f19cdb29/tracks
```

**Note that this endpoint can also search for an artist by their name.**

```
https://jukebox-backend-europe.herokuapp.com/artists/zero 7/tracks
```

This endpoint returns an `Array` of all the tracks by a specific artist.

```json
{
  "success": true,
  "tracks": [
    {
      "metadata": {
        "duration": 317.4,
        "format": "audio/flac",
        "size": 34747744,
        "bitrate": 874661.8021424072
      },
      "artist": "b64a91f7-f8c0-4fcc-ba56-a0b9f19cdb29",
      "title": "Give It Away",
      "statistics": {
        "downloads": 0,
        "playbacks": 0
      },
      "id": "541cdc6d-4a4e-41d7-aa02-0262c731e119",
      "album": "Simple Things",
      "imageUrl": "https://i.scdn.co/image/ab67616d0000b2730f387fd18dfdc5f0c18b80d3",
      "fileUrl": "https://firebasestorage.googleapis.com/v0/b/jukebox-50574.appspot.com/o/98bc1b94-600f-42c6-9070-bea16094f412.flac?alt=media&token=541cdc6d-4a4e-41d7-aa02-0262c731e119"
    }
  ]
}
```

# Tracks Endpoint

## Get all tracks from /tracks

```
https://jukebox-backend-europe.herokuapp.com/tracks
```

This endpoint returns an `Array` of all the tracks that exist in the database.

```json
{
  "success": true,
  "tracks": [
    {
      "id": "541cdc6d-4a4e-41d7-aa02-0262c731e119",
      "title": "Give It Away",
      "statistics": {
        "downloads": 0,
        "playbacks": 0
      },
      "album": "Simple Things",
      "artist": "b64a91f7-f8c0-4fcc-ba56-a0b9f19cdb29",
      "imageUrl": "https://i.scdn.co/image/ab67616d0000b2730f387fd18dfdc5f0c18b80d3",
      "fileUrl": "https://firebasestorage.googleapis.com/v0/b/jukebox-50574.appspot.com/o/98bc1b94-600f-42c6-9070-bea16094f412.flac?alt=media&token=541cdc6d-4a4e-41d7-aa02-0262c731e119",
      "metadata": {
        "duration": 317.4,
        "format": "audio/flac",
        "bitrate": 874661.8021424072,
        "size": 34747744
      }
    }
  ]
}
```

## Get a specific track from /tracks/track

```
https://jukebox-backend-europe.herokuapp.com/tracks/541cdc6d-4a4e-41d7-aa02-0262c731e119
```

**Note that this endpoint can also search for a track by its title.**

```
https://jukebox-backend-europe.herokuapp.com/tracks/give it away
```

This endpoint returns a track `Object` from the database if the track exists.

```json
{
  "success": true,
  "track": {
    "title": "Give It Away",
    "artist": "b64a91f7-f8c0-4fcc-ba56-a0b9f19cdb29",
    "fileUrl": "https://firebasestorage.googleapis.com/v0/b/jukebox-50574.appspot.com/o/98bc1b94-600f-42c6-9070-bea16094f412.flac?alt=media&token=541cdc6d-4a4e-41d7-aa02-0262c731e119",
    "album": "Simple Things",
    "statistics": {
      "downloads": 0,
      "playbacks": 0
    },
    "imageUrl": "https://i.scdn.co/image/ab67616d0000b2730f387fd18dfdc5f0c18b80d3",
    "id": "541cdc6d-4a4e-41d7-aa02-0262c731e119",
    "metadata": {
      "bitrate": 874661.8021424072,
      "format": "audio/flac",
      "size": 34747744,
      "duration": 317.4
    }
  }
}
```

# Spotify Endpoint

## Get a specific track from /spotify/artists/artist/tracks/track

```
https://jukebox-backend-europe.herokuapp.com/spotify/artists/zero 7/tracks/give it away
```

**Note that an optional query parameter can be appended to narrow down the search to a specific album. This is useful when a track is included in many different albums.**

```
https://jukebox-backend-europe.herokuapp.com/spotify/artists/zero 7/tracks/give it away?album=simple things
```

This endpoint returns a track `Object` from the **Spotify Web API** if the track exists.

```json
{
  "success": true,
  "track": {
    "artist": {
      "id": "14H7ag1wpQOsPPQJOD6Dqr",
      "name": "Zero 7"
    },
    "title": "Give It Away",
    "album": {
      "title": "Simple Things",
      "imageUrl": "https://i.scdn.co/image/ab67616d0000b2730f387fd18dfdc5f0c18b80d3"
    }
  }
}
```

## Get a specific artist from /spotify/artists/artist

```
https://jukebox-backend-europe.herokuapp.com/spotify/artists/14H7ag1wpQOsPPQJOD6Dqr
```

This endpoint returns an artist `Object` from the **Spotify Web API** if the artist exists.


```json
{
  "success": true,
  "artist": {
    "name": "Zero 7",
    "imageUrl": "https://i.scdn.co/image/ab6761610000e5eb85c10aefe83110535eea474c"
  }
}
```
