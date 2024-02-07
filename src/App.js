import React, {useState, useEffect} from 'react';
import SearchBar from './SearchBar';
import SearchResults from './SearchResults';
import Playlist from './Playlist';
import Spotify from './Spotify';

//CSS:
import './App.css';
import styles from './Layout.module.css';


function App() {
  useEffect(() => {
    // Check for the access token when the component mounts
    Spotify.getAccessToken();
  }, []);
  /*const hardCodedResults = [
    { id: 1, name: 'Song 1', artist: 'Artist 1', album: 'Album 1' },
    { id: 2, name: 'Song 2', artist: 'Artist 2', album: 'Album 2' },
    { id: 3, name: 'Song 3', artist: 'Artist 3', album: 'Album 3' },
  ];*/
  //State for search results using spotify's API:
  const [searchResults, setSearchResults] = useState([]);
  //State for Playlist Name"
  const [playlistName, setPlaylistName] = useState('My Playlist');
  //State for Playlist Tracks:
  const [playlistTracks, setPlaylistTracks] = useState([]);

  //Method to add a track to the playlist:
  const addTrackToPlaylist = (track) => {
    const isTrackInPlaylist = playlistTracks.some((playlistTrack) => playlistTrack.id === track.id);

    if (!isTrackInPlaylist) {
      setPlaylistTracks((prevTracks) => [...prevTracks, track]);
    } else {
      alert(`This track is already in your playlist!`)
    }
  };
  //Method to remove a track from the playlist:
  const removeTrackFromPlaylist = (track) => {
    const updatedPlaylist = playlistTracks.filter((playlistTrack) => playlistTrack.id !== track.id);
    setPlaylistTracks(updatedPlaylist);
  };

  //Method to clear search results:
  const clearSearchResults = () => {
    setSearchResults([]);
  };



  return (
    <div className="App">
      <div>
      <header className="App-header">Jammming</header>
      </div>
      <div className={styles.container}>
      <div className={styles.leftContainer}>
      <SearchBar onSearch={setSearchResults} />
      <SearchResults tracks={searchResults} onAddTrack={addTrackToPlaylist} />
      </div>
      <div className={styles.rightContainer}>
      <Playlist name={playlistName} tracks={playlistTracks} onNameChange={setPlaylistName} onRemoveTrack={removeTrackFromPlaylist} onClearSearchResults={clearSearchResults} onUpdatePlaylistTracks={(newTracks) => setPlaylistTracks(newTracks)}/>
      </div>
      </div>
    </div>
  );
}

export default App;


