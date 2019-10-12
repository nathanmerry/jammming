import React from "react";
import "./LocalPlayListTracks.css";

class LocalPlayListTracks extends React.Component {
  render() {
    return (
      <div className="TrackListLocal">
        <h2>{this.props.playListName}</h2>
        <div>
          {this.props.tracks.map(track => {
            return (
              <div className="Track-info">
                <h3>{track.name}</h3>
                <p>
                  {track.artist} | {track.album}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

export default LocalPlayListTracks;

/*<div className="Track">
 */
