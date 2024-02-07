import React from 'react';

//CSS
import styles from './Tracklist.module.css';

const Tracklist = ({ tracks, onRemoveTrack }) => {
    const handleRemoveTrack = (track) => {
        onRemoveTrack(track);
    };

  return (
    <ul className={styles.tracklist}>
      {tracks.map((track) => (
          <li key={track.id} className={styles.trackItem}> 
            <div className={styles.trackItemInfo}>
                <h4>{track.name}</h4>
                <p>{track.artist} - {track.album}</p>
            </div>
            <button className={styles.removeBtn} onClick={() => handleRemoveTrack(track)}>
              Remove
            </button>
          </li>
      ))}
    </ul>
  );
};

export default Tracklist;