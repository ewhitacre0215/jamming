import axios from 'axios';

const client_id = '66f676c9b547414d8ec914f66eea325d';
const redirect_uri = 'http://localhost:3000/';
const api_base_url = 'https://api/spotify.com/v1/'
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
    let currentUser = Spotify.getAccessToken();
    let headers = {Authorization: `Bearer ${currentUser}`};
    let userID = '';
    let playlistID = '';
    if (playlistName === '' || trackURIs === '') {
      // returns playlist if empty
      return;
    } else {
      axios.get('https://api.spotify.com/v1/me', {
        headers: headers,
      }).then(res => {
        userID = res.data.id
        axios({
            method: 'post',
            url: `${api_base_url}users/${userID}/playlists`,
            responseType: 'json',
            headers: headers,
            data: {
              name: `${playlistName}`,
              public: false
            }
          }).then(res => {
            console.log(res);
            playlistID = res.data.id;
            axios({
              method: 'post',
              url: `${api_base_url}users/${userID}/playlists/${playlistID}/tracks`,
              responseType: 'json',
              headers: headers,
              data: {
                uris: `${trackURIs}`
              }
            }).then(res => {
              console.log(res)
            }).catch(e => {
              console.log(e)
            })
          }).catch(e => {
            console.log(e);
          });
      }).catch(e => {
        console.log(e)
      })
    }
  }

};

export default Spotify;
