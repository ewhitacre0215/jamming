const client_id = '66f676c9b547414d8ec914f66eea325d';
const redirect_uri = 'http://localhost:3000/';
let accessToken = '';

const Spotify = {
  getAccessToken() {
      if (accessToken !== '') {
        return accessToken;
      }
      const accessTokenArray=window.location.href.match(/access_token=([^&]*)/);
      const expires_inArray=window.location.href.match(/expires_in=([^&]*)/);
      if (accessTokenArray && expires_inArray) {
        accessToken = accessTokenArray[1];
        const expiresIn = Number(expires_inArray[1]);
        window.setTimeout(() => accessToken = '', expiresIn * 1000);
        window.history.pushState('Access Token', null, '/');
        return accessToken;
      } else {
        const accessUrl = `https://accounts.spotify.com/authorize?client_id=${client_id}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirect_uri}`;
        window.location=accessUrl;
      }
  },

  search(term) {
    accessToken = Spotify.getAccessToken();
    return fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    }).then(res => {
              return res.json();
    }).then(jsonResponse => {
              return jsonResponse.tracks.items.map(track => ({
                    id: track.id,
                    name: track.name,
                    artist: track.artists[0].name,
                    album: track.album.name,
                    uri: track.uri
                })
              );
            })
  },

  savePlaylist(playlistName, trackURIs) {
    if (!playlistName || !trackURIs ) {
      return;
    } else {
      let currentUser = Spotify.getAccessToken();
      let headers = {Authorization: `Bearer ${currentUser}`}
      return fetch('https://api.spotify.com/v1/me', {
        headers: headers,
      })
      .then(response => response.json())
      .then(jsonResponse => jsonResponse.id)
      .then(userID => {
        fetch(`https://api.spotify.com/v1/users/${userID}/playlists`, {
            headers: headers,
            body: JSON.stringify({name: `${playlistName}`, public: false}),
            method: 'POST'
          })
          .then(response => response.json())
          .then(jsonResponse => {
            let playlistID = jsonResponse.id;
            fetch(`https://api.spotify.com/v1/users/${userID}/playlists/${playlistID}/tracks`, {
              headers: headers,
              body: JSON.stringify({uris: `${trackURIs}`}),
              method: 'POST'
            })
          })
        })
      }
  }

};

export default Spotify;
