import React, { useState } from "react";
import Spotify from "./Spotify";

//CSS
import styles from './SearchBar.module.css';

const SearchBar = ({ onSearch }) => {
    const [searchTerm, setSearchTerm] = useState('');

const handleSearch = async () => {
    //Check if the access token is valid
    if (!Spotify.isAccessTokenValid()) {
        //if not valid, initiate authorization process
        Spotify.getAccessToken();
        return;
    }


try {
    //Make a request to the Spotify API or tracks matching the search term
    const response = await fetch(
        `https://api.spotify.com/v1/search?type=track&q=${encodeURIComponent(searchTerm)}`,
        {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${Spotify.getAccessToken()}`,
    
            },
        }
    );

    if (!response.ok) {
        const errorMessage = await response.text();
        console.error(`Failed to fetch search results. Status: ${response.status}, Message: ${errorMessage}`);
        return;
    }

    //Parse the JSON response
    const data = await response.json();

    const tracks = data.tracks.items.map((track) => ({
        id: track.id,
        name: track.name,
        artist: track.artists[0].name,
        album: track.album.name,
        uri: track.uri,
    }));

    //Pass the search resutls to parent component
    onSearch(tracks);
    //Reset the search bar once the search is finished
    setSearchTerm('');
} catch (error) {
    console.error('Error searching tracks:', error.message);
    }
};

const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
};

const handleSubmit = (e) => {
    e.preventDefault();
    handleSearch();
};

    return (
        <div className={styles.searchBar}>
            <form onSubmit={handleSubmit}>
                <input type='text' 
                       placeholder='Enter a Song, Album, or Artist'
                       value={searchTerm}
                       onChange={handleInputChange} />
                <button className={styles.searchButton}>SEARCH</button>
            </form>
        </div>
    );
};

export default SearchBar;