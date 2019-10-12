import React from "react";
import "./App.css";
import SearchBar from "../SearchBar/SearchBar";
import SearchResults from "../SearchResults/SearchResults";
import Playlist from "../Playlist/Playlist";
import Spotify from "../../util/Spotify";
import UserDetails from "../UserDetails/UserDetails";
import CurrentPlayLists from "../CurrentPlayLists/CurrentPlayLists";
import LocalPlayListTracks from "../LocalPlayListTracks/LocalPlayListTracks";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchResults: [],
      playListName: "PlayList Name",
      playListTracks: [],
      userName: "",
      currentPlayLists: [],
      localPlayListTracks: [],
      localPlayListName: ""
    };
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);
    this.changeLogin = this.changeLogin.bind(this);
    this.test = this.test.bind(this);
    this.selectPlayList = this.selectPlayList.bind(this);
  }

  addTrack(track) {
    let tracks = this.state.playListTracks;
    if (tracks.find(savedTrack => savedTrack.id === track.id)) {
      return;
    }
    tracks.push(track);
    this.setState({ playListTrack: tracks });
  }

  removeTrack(track) {
    let tracks = this.state.playListTracks;

    tracks = tracks.filter(currentTrack => currentTrack.id !== track.id);
    this.setState({ playListTracks: tracks });
  }

  updatePlaylistName(name) {
    this.setState({
      playListName: name
    });
  }

  savePlaylist() {
    const trackURIS = this.state.playListTracks.map(track => track.uri);
    Spotify.savePlaylist(this.state.playListName, trackURIS).then(() => {
      this.setState({ playListName: "New Playlist", playListTracks: [] });
    });
  }

  search(term) {
    Spotify.search(term).then(searchResults => {
      this.setState({ searchResults: searchResults });
    });
  }

  changeLogin() {
    Spotify.getAccessTokenLogin();
  }

  componentDidMount() {
    Spotify.getCurrentUserId().then(userName => {
      this.setState({
        userName: userName.userId
      });
    });
    Spotify.getUserPlaylist().then(playlists => {
      this.setState({ currentPlayLists: playlists });
    });
  }

  test() {}

  selectPlayList(playListId, playListName) {
    Spotify.getPlayListTracks(playListId).then(songs => {
      this.setState({ localPlayListTracks: songs });
      this.setState({ localPlayListName: playListName });
    });
  }

  render() {
    return (
      <div>
        <h1>
          Ja<span className="highlight">mmm</span>ing
        </h1>
        {/* <button onClick={this.test}>test</button> */}
        <div className="App">
          <UserDetails
            userName={this.state.userName}
            changeLogin={this.changeLogin}
          />
          <SearchBar onSearch={this.search} test={this.state.userName} />
          <div className="App-playlist">
            <SearchResults
              searchResults={this.state.searchResults}
              onAdd={this.addTrack}
            />
            <Playlist
              playListName={this.state.playListName}
              playListTracks={this.state.playListTracks}
              onRemove={this.removeTrack}
              onNameChange={this.updatePlaylistName}
              onSave={this.savePlaylist}
            />

            <CurrentPlayLists
              playlists={this.state.currentPlayLists}
              selectPlayList={this.selectPlayList}
            />

            <LocalPlayListTracks
              playListName={this.state.localPlayListName}
              tracks={this.state.localPlayListTracks}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
