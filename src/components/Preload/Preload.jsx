import React from "react";
import styles from "./Preload.module.css"; // Используем CSS Modules

const Preload = () => {
  return (
    <div className={styles.preload}>
      <div className={styles.preloadContent}>
        <h1 className={styles.preloadText}>ImageGallery!</h1>
      </div>
    </div>
  );
};

export default Preload;