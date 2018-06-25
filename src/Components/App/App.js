import React, { Component } from 'react';
import './App.css';
import SearchBar from '../SearchBar/SearchBar';
import SearchResults from '../SearchResults/SearchResults';
import Playlist from '../Playlist/Playlist';
import Spotify from '../../util/Spotify';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchResults: [],
      term: '',
      playlistName: 'New Jammms',
      playlistTracks: []
    };
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);
  };

  updatePlaylistName(name) {
    this.setState({
      playlistName: name
    });
  };

  savePlaylist() {
    let trackURIs = this.state.playlistTracks.map(track => {
      return track.uri
    });
    if (this.state.playlistTracks.length && this.state.playlistName) {
      Spotify.savePlaylist(this.state.playlistName, trackURIs)
    } else {
      this.setState({
        playlistName: 'New Jammms',
        playlistTracks: []
      })
    }
  };

  addTrack(track) {
    if (this.state.playlistTracks.find(savedTrack => savedTrack.id === track.id)) {
      return;
    } else {
      this.state.playlistTracks.push(track);
    }
  };

  removeTrack(track) {
    if (this.state.playlistTracks.filter(savedTrack => savedTrack.id === track.id)) {
      this.state.playlistTracks.pop(track);
    }
  }

  search() {
    Spotify.search(this.state.term).then(res => {
      this.setState({
        searchResults: res
      })
    });
  }

  render() {
    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
          <SearchBar onSearch={this.search}/>
          <div className="App-playlist">
            <SearchResults searchResults={this.state.searchResults}
                           onAdd={this.addTrack}/>
              <Playlist playlistName={this.state.playlistName}
                        playlistTracks={this.state.playlistTracks}
                        onRemove={this.removeTrack}
                        onNameChange={this.updatePlaylistName}
                        onSave={this.savePlaylist}/>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
