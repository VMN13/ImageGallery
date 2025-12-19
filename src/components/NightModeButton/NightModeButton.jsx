import React from 'react';
import styles from './NightModeButton.module.css';

const NightModeButton = ({ nightMode, setNightMode }) => {
  return (
    <>
      {nightMode && <div className="night-overlay"></div>} {/* Оставлено как глобальный класс (из global.css) */}
      <button 
        className={`${styles.nightModeButton} ${nightMode ? styles.nightModeButtonGlowing : ''}`} 
        onClick={() => setNightMode(!nightMode)}
      >
        {nightMode ? "🌞" : "🌜"}
      </button>
    </>
  );
};

export default NightModeButton;