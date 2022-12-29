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
https://jukebox-backend-production.up.railway.app/artists
```

This endpoint returns an `Array` of all the artists that exist in the database.

```json
{
  "success": true,
  "artists": [
    {
      "name": "Zero 7",
      "imageUrl": "https://i.scdn.co/image/ab6761610000e5eb85c10aefe83110535eea474c",
      "id": "d927395f-d870-4ace-b370-e1e8e4dd5d1c"
    }
  ]
}
```

## Get a specific artist from /artists/artist

```
https://jukebox-backend-production.up.railway.app/artists/b64a91f7-f8c0-4fcc-ba56-a0b9f19cdb29
```

**Note that this endpoint can also search for an artist by their name.**

```
https://jukebox-backend-production.up.railway.app/artists/zero%207
```

This endpoint returns an artist `Object` from the database if the artist exists.

```json
{
  "success": true,
  "artist": {
    "id": "d927395f-d870-4ace-b370-e1e8e4dd5d1c",
    "imageUrl": "https://i.scdn.co/image/ab6761610000e5eb85c10aefe83110535eea474c",
    "name": "Zero 7"
  }
}
```

## Get all tracks by a specific artist from /artists/artist/tracks

```
https://jukebox-backend-production.up.railway.app/artists/b64a91f7-f8c0-4fcc-ba56-a0b9f19cdb29/tracks
```

**Note that this endpoint can also search for an artist by their name.**

```
https://jukebox-backend-production.up.railway.app/artists/zero%207/tracks
```

This endpoint returns an `Array` of all the tracks by a specific artist.

```json
{
  "success": true,
  "tracks": [
    {
      "imageUrl": "https://i.scdn.co/image/ab67616d0000b2730f387fd18dfdc5f0c18b80d3",
      "artist": "d927395f-d870-4ace-b370-e1e8e4dd5d1c",
      "id": "026e037f-e9b9-4bfd-be19-0104e825f80c",
      "metadata": {
        "format": "audio/flac",
        "duration": 317.4,
        "bitrate": 874661.8021424072,
        "size": 34747744
      },
      "fileUrl": "https://firebasestorage.googleapis.com/v0/b/jukebox-50574.appspot.com/o/61d73e03-840f-4e21-af96-8cbcddfc521b.flac?alt=media&token=026e037f-e9b9-4bfd-be19-0104e825f80c",
      "album": "Simple Things",
      "statistics": {
        "downloads": 0,
        "playbacks": 0
      },
      "title": "Give It Away"
    }
  ]
}
```

# Tracks Endpoint

## Get all tracks from /tracks

```
https://jukebox-backend-production.up.railway.app/tracks
```

This endpoint returns an `Array` of all the tracks that exist in the database.

```json
{
  "success": true,
  "tracks": [
    {
      "album": "Simple Things",
      "fileUrl": "https://firebasestorage.googleapis.com/v0/b/jukebox-50574.appspot.com/o/61d73e03-840f-4e21-af96-8cbcddfc521b.flac?alt=media&token=026e037f-e9b9-4bfd-be19-0104e825f80c",
      "imageUrl": "https://i.scdn.co/image/ab67616d0000b2730f387fd18dfdc5f0c18b80d3",
      "statistics": {
        "playbacks": 0,
        "downloads": 0
      },
      "title": "Give It Away",
      "id": "026e037f-e9b9-4bfd-be19-0104e825f80c",
      "metadata": {
        "size": 34747744,
        "duration": 317.4,
        "bitrate": 874661.8021424072,
        "format": "audio/flac"
      },
      "artist": "d927395f-d870-4ace-b370-e1e8e4dd5d1c"
    }
  ]
}
```

## Get a specific track from /tracks/track

```
https://jukebox-backend-production.up.railway.app/tracks/541cdc6d-4a4e-41d7-aa02-0262c731e119
```

**Note that this endpoint can also search for a track by its title.**

```
https://jukebox-backend-production.up.railway.app/tracks/give%20it%20away
```

This endpoint returns a track `Object` from the database if the track exists.

```json
{
  "success": true,
  "track": {
    "metadata": {
      "duration": 317.4,
      "size": 34747744,
      "format": "audio/flac",
      "bitrate": 874661.8021424072
    },
    "title": "Give It Away",
    "artist": "d927395f-d870-4ace-b370-e1e8e4dd5d1c",
    "fileUrl": "https://firebasestorage.googleapis.com/v0/b/jukebox-50574.appspot.com/o/61d73e03-840f-4e21-af96-8cbcddfc521b.flac?alt=media&token=026e037f-e9b9-4bfd-be19-0104e825f80c",
    "id": "026e037f-e9b9-4bfd-be19-0104e825f80c",
    "imageUrl": "https://i.scdn.co/image/ab67616d0000b2730f387fd18dfdc5f0c18b80d3",
    "statistics": {
      "downloads": 0,
      "playbacks": 0
    },
    "album": "Simple Things"
  }
}
```

# Spotify Endpoint

## Get a specific track from /spotify/artists/artist/tracks/track

```
https://jukebox-backend-production.up.railway.app/spotify/artists/zero%207/tracks/give%20it%20away
```

**Note that an optional query parameter can be appended to narrow down the search to a specific album. This is useful when a track is included in many different albums.**

```
https://jukebox-backend-production.up.railway.app/spotify/artists/zero%207/tracks/give%20it%20away?album=simple%20things
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
https://jukebox-backend-production.up.railway.app/spotify/artists/14H7ag1wpQOsPPQJOD6Dqr
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
