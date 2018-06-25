import axios from 'axios';

const client_id = '66f676c9b547414d8ec914f66eea325d';
const redirect_uri = 'http://localhost:3000/';
const api_base_url = 'https://api/spotify.com/v1/'
let accessToken = '';
let expires_in = '';

const Spotify = {

  search(term) {
    let tracks = [];
    let accessToken = this.getAccessToken();
    return axios.get({
              method: 'get',
              responseType: 'json',
              headers: { Authorization: `Bearer ${accessToken}`},
              url: `${api_base_url}search?type=track&q=${term}`
            }).then(res => {
              console.log(res);
              return res.data.tracks.items.map(track => ({
                    id: track.id,
                    name: track.name,
                    artist: track.artists[0].name,
                    album: track.album.name,
                    uri: track.uri
                })
              );
            }).catch(e => {
              console.log(e)
            })
  },

  getAccessToken() {
    if (accessToken !== '') {
      return accessToken;
    } else if (window.location.href.match(/access_token=([^&]*)/)) {
      accessToken=window.location.href.match(/access_token=([^&]*)/);
      expires_in=window.location.href.match(/expires_in=([^&]*)/);
      window.setTimeout(() => accessToken = '', expires_in * 1000);
      window.history.pushState('Access Token', null, '/');
      return accessToken;
    } else {
      window.location.href='https://accounts.spotify.com/authorize?client_id='+client_id+'&response_type=token&scope=playlist-modify-public&redirect_uri='+redirect_uri;
    }
  },

  savePlaylist(playlistName, trackURIs) {
    let currentUser = this.getAccessToken();
    let headers = {Authorization: `Bearer ${currentUser}`};
    let userID = '';
    let playlistID = '';
    if (playlistName === '' || trackURIs === '') {
      // returns playlist if empty
      return;
    } else {
      axios.get({
        url: `${api_base_url}me`,
        headers: headers,
        responseType: 'json'
      }).then(res => {
        userID = res.data.id
      }).catch(e => {
        console.log(e)
      })
      axios.post({
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
        }).catch(e => {
          console.log(e);
        });
      axios.post({
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
    }
  }

};

export default Spotify;
