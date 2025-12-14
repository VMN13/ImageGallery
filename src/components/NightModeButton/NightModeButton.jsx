import React from 'react';

const NightModeButton = ({ nightMode, setNightMode }) => {
  return (
    <>
      {nightMode && <div className="night-overlay"></div>}
      <button 
        className={`night-mode-button ${nightMode ? 'glowing' : ''}`} 
        onClick={() => setNightMode(!nightMode)}
      >
        {nightMode ? "🌞" : "🌜"}
      </button>
    </>
  );
};

export default NightModeButton;