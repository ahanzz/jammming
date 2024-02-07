import React from 'react';
import Tracklist from './Tracklist';
import Spotify from './Spotify';

//CSS:
import styles from './Playlist.module.css';

function Playlist({ name, tracks, onNameChange, onRemoveTrack, onClearSearchResults, onUpdatePlaylistTracks }) {
    const handlePlaylistNameChange = (e)=> {
        onNameChange(e.target.value);
    };

    // Update the onClick handler for the "Save to Spotify" button
    const handleSavePlaylist = async () => {
    // Check if the access token is valid
        if (!Spotify.isAccessTokenValid()) {
    // If not valid, initiate the authorization process
        Spotify.redirectToSpotifyAuthorization();
        return;
        }

    // Extract track URIs from the playlist
        const uriArray = tracks.map((track) => `spotify:track:${track.id}`);

        try {
    // Call the savePlaylist method from Spotify.js
        await Spotify.savePlaylist(name, uriArray, onRemoveTrack);

    // Reset the playlist (you can modify this part based on your app's logic)
        onNameChange('My Playlist');
        onUpdatePlaylistTracks([]);
        onClearSearchResults();
        } catch (error) {
        console.error('Error saving playlist:', error.message);
        }
    }


    return(
        <div className={styles.playlist}>
            <div className={styles.name}>
            <input 
             type='text'
             value={name}
             onChange={handlePlaylistNameChange}
             placeholder='My Playlist'
            />
            </div>
            <div className={styles.Tracklist}>
            <Tracklist tracks={tracks} onRemoveTrack={onRemoveTrack}/>
            </div>
            <button className={styles.saveButton} onClick={handleSavePlaylist}>Save to Spotify</button>
        </div>
    )
};

export default Playlist;