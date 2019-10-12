let accessToken;
const redirectUri = "http://localhost:3001/";
const clientId = "87e4990a583f4eb4abb6bafafd61a2df";

const Spotify = {
  getAccessToken() {
    if (accessToken) {
      return accessToken;
    }

    const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/);
    const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/);

    if (accessTokenMatch && expiresInMatch) {
      accessToken = accessTokenMatch[1];

      const expiresIn = Number(expiresInMatch[1]);

      window.setTimeout(() => (accessToken = ""), expiresIn * 1000);
      window.history.pushState("Access Token", null, "/");

      return accessToken;
    } else {
      const accessUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectUri}`;
      window.location = accessUrl;
    }
  },

  getAccessTokenLogin() {
    const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/);
    const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/);

    if (accessTokenMatch && expiresInMatch) {
      accessToken = accessTokenMatch[1];

      const expiresIn = Number(expiresInMatch[1]);

      window.setTimeout(() => (accessToken = ""), expiresIn * 1000);
      window.history.pushState("Access Token", null, "/");

      return accessToken;
    } else {
      const accessUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectUri}&show_dialog=true`;
      window.location = accessUrl;
    }
  },

  async search(term) {
    const accessToken = Spotify.getAccessToken(false);

    const response = await fetch(
      `https://api.spotify.com/v1/search?type=track&q=${term}`,
      {
        headers: { Authorization: `Bearer ${accessToken}` }
      }
    );

    const jsonResponse = await response.json();

    if (!jsonResponse.tracks) {
      return [];
    }
    return jsonResponse.tracks.items.map(track => {
      return {
        id: track.id,
        name: track.name,
        artist: track.artists[0].name,
        album: track.album.name,
        uri: track.uri
      };
    });
  },

  async getCurrentUserId() {
    const accessToken = Spotify.getAccessToken();

    const headers = { Authorization: `Bearer ${accessToken}` };

    const response = await fetch("https://api.spotify.com/v1/me", {
      headers: headers
    });
    let jsonResponse = await response.json();

    const currentUserId = {
      accessToken: accessToken,
      userId: jsonResponse.id,
      headers: headers
    };
    return currentUserId;
  },

  async savePlaylist(name, trackUris) {
    if (!name || !trackUris) {
      return;
    }

    const getCurrentUserId = this.getCurrentUserId();
    const currentUserId = await getCurrentUserId;

    const response = await fetch(
      `https://api.spotify.com/v1/users/${currentUserId.userId}/playlists`,
      {
        headers: currentUserId.headers,
        method: "POST",
        body: JSON.stringify({ name: name })
      }
    );
    const jsonResponse = await response.json();
    let playlistId = jsonResponse.id;
    return fetch(
      `https://api.spotify.com/v1/users/${currentUserId.userId}/playlists/${playlistId}/tracks`,
      {
        headers: currentUserId.headers,
        method: "POST",
        body: JSON.stringify({ uris: trackUris })
      }
    );
  },

  async getUserPlaylist() {
    const getCurrentUserId = this.getCurrentUserId();
    const currentUserId = await getCurrentUserId;

    const playlistResponse = await fetch(
      `https://api.spotify.com/v1/users/${currentUserId.userId}/playlists`,
      {
        headers: { Authorization: `Bearer ${currentUserId.accessToken}` }
      }
    );
    let jsonPlaylistResponse = await playlistResponse.json();

    return jsonPlaylistResponse.items.map(playlist => {
      return {
        name: playlist.name,
        id: playlist.id
      };
    });
  },

  async getPlayListTracks(playlistId) {
    const getCurrentUserId = this.getCurrentUserId();
    const currentUserId = await getCurrentUserId;

    const response = await fetch(
      `https://api.spotify.com/v1/users/${currentUserId.userId}/playlists/${playlistId}/tracks`,
      {
        headers: { Authorization: `Bearer ${currentUserId.accessToken}` }
      }
    );

    const jsonResponse = await response.json();

    const playListSongs = jsonResponse.items;

    return playListSongs.map(song => {
      let songTrack = song.track;
      return {
        name: songTrack.name,
        artist: songTrack.artists[0].name,
        album: songTrack.album.name
      };
    });
  }
};

export default Spotify;
