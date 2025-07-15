import { SpotifyApi } from "@spotify/web-api-ts-sdk";

export const REDIRECT_URI = "http://127.0.0.1:5173/callback"
export const CLIENT_ID = "527b8735a7f54a7b8436b64d5c1bdfa3"
export const SCOPES = [
  // Playback control
  "user-read-playback-state",
  "user-modify-playback-state",
  "user-read-currently-playing",
  "app-remote-control",
  "streaming",

  // Playlists
  "playlist-read-private",
  "playlist-read-collaborative",
  "playlist-modify-private",
  "playlist-modify-public",

  // Library (save songs, albums)
  "user-library-read",
  "user-library-modify",

  // Listening history
  "user-read-recently-played",
  "user-top-read",
  "user-read-playback-position",

  // Shuffle + player context needs playback + playlist scopes (included above)

  // User identity (optional but useful)
  "user-read-email",
  "user-read-private"
];

type Spotify = {
  sdk?: SpotifyApi,
}

export const spotify = $state<Spotify>({
  sdk: SpotifyApi.withUserAuthorization(CLIENT_ID, REDIRECT_URI, SCOPES),
})