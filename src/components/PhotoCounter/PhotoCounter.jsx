import React, { useState } from "react";
import CountUp from 'react-countup';
import images from '../../data/images';
import '../../styles/global/Confetti.css';

const PhotoCounter = React.memo(() => {
  const totalPhotos = images.length;
  const [isCompleted, setIsCompleted] = useState(false);

  return (
    <div className="counter-wrapper">
      <div className="counter">
        <h2>
          Количество уникальных фотографий: 
          <CountUp
            end={totalPhotos}
            duration={2}
            onEnd={() => setIsCompleted(true)}
          />
        </h2>
      </div>
      {isCompleted && (
        <div className="confetti">
          {[...Array(30)].map((_, i) => {
            const left = Math.random() * 100;
            const delay = Math.random() * 0.5;
            const duration = 2 + Math.random() * 2;
            
            return (
              <div
                key={i}
                className="confetti-star"
                style={{
                  '--left': `${left}%`,
                  '--delay': `${delay}s`,
                  '--duration': `${duration}s`,
                }}
              >
                ★
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
});

export default PhotoCounter;