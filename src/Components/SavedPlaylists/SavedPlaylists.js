import React from 'react';
import './SavedPlaylists.css';
import PlaylistInfo from '../PlaylistInfo/PlaylistInfo';
import Spotify from '../../util/Spotify';

class SavedPlaylists extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      savedPlaylists: []
    };
  }

  renderPlaylists() {
    if (this.state.savedPlaylists !== []) {
      return this.state.savedPlaylists.map(playlist => (
                  <PlaylistInfo key={playlist.id}
                                playlist={playlist} />
                ))
    } else {
      <p>Nothing here...</p>
    }
  }

  getPlaylists() {
    Spotify.savedPlaylists().then(res => {
      this.setState({
        savedPlaylists: res
      });
    })
  }

  render() {
    return(
      <div className="SavedPlaylists">
        <h2>Saved Playlists</h2>
        <button onClick={this.getPlaylists()}>Get Playlists</button>
        { this.renderPlaylists() }
      </div>
    );
  }
}

export default SavedPlaylists;
