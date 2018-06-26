import React from 'react';
import './PlaylistInfo.css';

class PlaylistInfo extends React.Component {
  render() {
    return(
      <div className="PlaylistInfo">
        <div className="PlaylistInfo-information">
          <h3>{this.props.playlist.name}</h3>
          <p>Owner: {this.props.playlist.owner.id}</p>
        </div>
      </div>
    );
  }
}

export default PlaylistInfo;
