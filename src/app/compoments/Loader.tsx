// Loader.js
import React from 'react';
import styles from '../compoments/Loader.module.css'; // Assurez-vous de créer un fichier CSS correspondant

const Loader = () => {
  return (
    <div className={styles.loaderContainer}>
      <div className={styles.spinner}></div>
    </div>
  );
};

export default Loader;
