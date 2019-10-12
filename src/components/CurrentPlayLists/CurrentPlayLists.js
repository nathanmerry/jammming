import React from "react";
import "./CurrentPlayLists.css";
import LocalPlayListTracks from "../LocalPlayListTracks/LocalPlayListTracks";

class CurrentPlayLists extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      localPlayListTracks: [],
      playListsActive: false,
      selectedPlayList: ""
    };

    this.renderCurrentPlaylists = this.renderCurrentPlaylists.bind(this);
    this.selectPlayList = this.selectPlayList.bind(this);
  }

  selectPlayList(id, name) {
    this.setState({ playListsActive: true });
    this.setState({ selectedPlayList: name });
    this.props.selectPlayList(id, name);
  }

  renderCurrentPlaylists() {
    let currentPlayLists = this.props.playlists.map(playlist => {
      return (
        <li className="playList" key={playlist.id}>
          <a
            onClick={() => {
              this.selectPlayList(playlist.id, playlist.name);
            }}
          >
            {playlist.name}
          </a>
        </li>
      );
    });
    return <ul>{currentPlayLists}</ul>;
  }

  render() {
    return (
      <div className="CurrentPlayLists">
        <h2>Local PlayLists</h2>

        {this.renderCurrentPlaylists()}
      </div>
    );
  }
}

export default CurrentPlayLists;
