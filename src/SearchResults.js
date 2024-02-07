import React from 'react';

import styles from './SearchResults.module.css';

const SearchResults = ({ tracks, onAddTrack }) => {
    const handleAddTrack = (track) => {
        onAddTrack(track);
    };

  return (
    <div className={styles.searchResults}>
      {tracks.map((track) => (
        <div key={track.id} className={styles.resultItem}>
          <div className={styles.resultItemInfo}>
            <h3>{track.name}</h3>
            <p>{track.artist} - {track.album}</p>
          </div>
          <button className={styles.addBtn} onClick={() => handleAddTrack(track)}>Add</button>
        </div>
      ))}
    </div>
  );
};

export default SearchResults;