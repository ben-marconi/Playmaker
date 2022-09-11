import React from 'react'
import ReactDOM from 'react-dom';
import './App.css';
import {Playlist} from '../Playlist/Playlist';
import {SearchResults} from '../SearchResults/SearchResults';
import {SearchBar} from '../SearchBar/SearchBar';
import { render } from '@testing-library/react';
import {Spotify} from '../../util/Spotify';
import {Recommended} from '../Recommended/Recommended';



class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {searchResults : [],
                  playlistName: 'New Playlist',
                  playlistTracks: [],
                  previewSource: "https://open.spotify.com/embed/track/4Dvkj6JhhA12EX05fT7y2e?utm_source=generator",
                  recommendedTracks: []
    };
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);
    this.setURI = this.setURI.bind(this);
    this.recommendTracks = this.recommendTracks.bind(this);
    this.addTrackRecommended = this.addTrackRecommended.bind(this);
  }
  
  addTrack(track) {
    const trackId = track.id;
    let tracks = this.state.playlistTracks;
    let resultTracks = this.state.searchResults;
    if (tracks.find(track => track.id === trackId)){
      return;
    }
    const positionResult = resultTracks.indexOf(track);
    track.disc_number = positionResult;
    resultTracks = resultTracks.filter(track => trackId !== track.id)
    tracks.push(track);
    this.setState({playlistTracks: tracks, searchResults: resultTracks});
  }

  addTrackRecommended(track) {
    const trackId = track.id;
    let tracks = this.state.playlistTracks;
    if (tracks.find(track => track.id === trackId)){
      return;
    }
    tracks.push(track);
    this.setState({playlistTracks: tracks});
  }
  
  removeTrack(track) {
    const trackId = track.id;
    let tracks = this.state.playlistTracks;
    let resultTracks = this.state.searchResults;
    resultTracks.splice(track.disc_number, 0, track);
    tracks = tracks.filter(track => trackId !== track.id);
    this.setState({playlistTracks: tracks, searchResults: resultTracks});
  }
  
  updatePlaylistName(name) {
    this.setState({playlistName: name});
  }

  savePlaylist() {
    const trackURIs = this.state.playlistTracks.map(track => track.uri);
    Spotify.savePlaylist(this.state.playlistName, trackURIs).then(() => {
      this.setState({playlistName: 'New Playlist', playlistTracks: []});
    });
  }

  search(term) {
    console.log(term);
    Spotify.search(term).then(results => {
      this.setState({searchResults: results});
    });
  }

  setURI(uri) {
    let processed =  uri.slice(8, uri.length);
    processed = processed.replace(':', '/');
    const link = `https://open.spotify.com/embed/${processed}?utm_source=generator`
    this.setState({previewSource: link});
  }

  recommendTracks() {
    const trackIDs = this.state.playlistTracks.map(track => track.id);
    Spotify.recommend(trackIDs).then(results => {
      this.setState({recommendedTracks: results});
    })
  }

  render() {
    return (
      <div>
        <h1><span className="highlight">Play</span>maker by <a href="https://www.linkedin.com/in/ben-marconi/" target="_blank"><span className="highlight">Ben</span> Marconi</a></h1>
        <div className="App">
          <SearchBar onSearch = {this.search}/>
          <iframe src={this.state.previewSource} width="100%" height="80" frameBorder="0" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>
          <div className="App-playlist">
            <SearchResults searchResults = {this.state.searchResults} 
                           onAdd = {this.addTrack}
                           onPreview = {this.setURI}
                           recommend = {this.recommendTracks}/>
            <Recommended onPreview = {this.setURI}
                         recommended = {this.state.recommendedTracks}
                         recommend = {this.recommendTracks}
                         onAdd = {this.addTrackRecommended}/>
          </div>
            <Playlist playlistName = {this.state.playlistName} 
                        playlistTracks = {this.state.playlistTracks} 
                        onRemove = {this.removeTrack} 
                        onNameChange = {this.updatePlaylistName} 
                        onSave = {this.savePlaylist}
                        onPreview = {this.setURI}/>
        </div>
      </div>
    );
  }
}

export default App;
