// Loader.js
import React from 'react';
import styles from '../compoments/Loader.module.css'; // Assurez-vous de créer un fichier CSS correspondant

const Loader = ({ bubbleBackgroundColor, bubbleColor }) => {
  return (
    <div className={styles.loaderContainer}>
      <div className={styles.loaderBubble} style={{ backgroundColor: bubbleBackgroundColor }}>
        <div className={styles.bubble} style={{ backgroundColor: bubbleColor }}></div>
        <div className={styles.bubble} style={{ backgroundColor: bubbleColor }}></div>
        <div className={styles.bubble} style={{ backgroundColor: bubbleColor }}></div>
      </div>
    </div>
  );
};

export default Loader;
