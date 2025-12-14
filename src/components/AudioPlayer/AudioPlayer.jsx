import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';  // Import createPortal from 'react-dom'
import { useTheme } from '../ThemeContext';
import './AudioPlayer.css';

const soundUrls = {
  sea: '/sounds/sea.mp3',
  forest: '/sounds/forest.mp3',
  rain: '/sounds/rain.mp3',
  calm: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
};

const soundNames = {
  sea: 'Море',
  forest: 'Лес',
  rain: 'Дождь',
  calm: 'Спокойная погода',
};

const AudioPlayer = () => {
  const { isDarkMode } = useTheme();
  const audioRef = useRef(null);
  const intervalRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSound, setCurrentSound] = useState(null);
  const [playbackTime, setPlaybackTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [showFloatingPlayer, setShowFloatingPlayer] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [floatingPosition, setFloatingPosition] = useState({ top: 0, left: 20 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0 });

  const soundKeys = Object.keys(soundUrls);

  const formatTime = (time) => {
    if (isNaN(time)) return '00:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setPlaybackTime(audioRef.current?.currentTime || 0);
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const handlePlay = (sound) => {
    if (audioRef.current) {
      // Pause and reset if switching sounds
      if (currentSound && currentSound !== sound) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      
      // If resuming the same sound
      if (currentSound === sound && !isPlaying) {
        audioRef.current.play().catch(e => {
          if (e.name !== 'AbortError') console.error('Play error:', e);
        });
        setIsPlaying(true);
        setShowFloatingPlayer(true);
        return;
      }
      
      // Load and play new sound
      audioRef.current.src = soundUrls[sound];
      audioRef.current.play().catch(e => {
        if (e.name !== 'AbortError') console.error('Play error:', e);
      });
      setCurrentSound(sound);
      setIsPlaying(true);
      setShowFloatingPlayer(true);
      setIsMinimized(false);
    }
  };

  const handlePause = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleStop = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
      setPlaybackTime(0);
      setShowFloatingPlayer(false);
      setIsMinimized(false);
    }
  };

  const handleLoadedMetadata = () => {
    setDuration(audioRef.current?.duration || 0);
  };

  const handleSeek = (e) => {
    const newTime = parseFloat(e.target.value);
    if (audioRef.current) audioRef.current.currentTime = newTime;
    setPlaybackTime(newTime);
  };

  const handleVolumeChange = (e) => {
    setVolume(parseFloat(e.target.value));
  };

  const handlePrev = () => {
    const currentIndex = soundKeys.indexOf(currentSound || '');
    const prevIndex = (currentIndex - 1 + soundKeys.length) % soundKeys.length;
    handlePlay(soundKeys[prevIndex]);
  };

  const handleNext = () => {
    const currentIndex = soundKeys.indexOf(currentSound || '');
    const nextIndex = (currentIndex + 1) % soundKeys.length;
    handlePlay(soundKeys[nextIndex]);
  };

  const handleMouseDown = (e) => {
    setIsDragging(true);
    dragStartRef.current = { x: e.clientX - floatingPosition.left, y: e.clientY - floatingPosition.top };
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const newLeft = e.clientX - dragStartRef.current.x;
    const newTop = e.clientY - dragStartRef.current.y;
    const maxLeft = window.innerWidth - 250;
    const maxTop = window.innerHeight - 100;
    setFloatingPosition({
      left: Math.max(0, Math.min(newLeft, maxLeft)),
      top: Math.max(0, Math.min(newTop, maxTop)),
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e) => {
    setIsDragging(true);
    const touch = e.touches[0];
    dragStartRef.current = { x: touch.clientX - floatingPosition.left, y: touch.clientY - floatingPosition.top };
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    const touch = e.touches[0];
    const newLeft = touch.clientX - dragStartRef.current.x;
    const newTop = touch.clientY - dragStartRef.current.y;
    const maxLeft = window.innerWidth - 250;
    const maxTop = window.innerHeight - 100;
    setFloatingPosition({
      left: Math.max(0, Math.min(newLeft, maxLeft)),
      top: Math.max(0, Math.min(newTop, maxTop)),
    });
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('touchmove', handleTouchMove);
      document.addEventListener('touchend', handleTouchEnd);
    } else {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    }
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isDragging]);

  const handleCloseFloatingPlayer = () => {
    handleStop();
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  return (
    <>
      <div className={`audio-player ${isDarkMode ? 'dark' : 'light'}`}>
        <audio
          ref={audioRef}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={() => {
            setIsPlaying(false);
            setShowFloatingPlayer(false);
          }}
        />
        
        <div className="sound-buttons">
          {Object.keys(soundUrls).map((sound) => (
            <button
              key={sound}
              className={`sound-button ${isDarkMode ? 'dark' : 'light'} ${currentSound === sound ? 'active' : ''}`}
              onClick={() => handlePlay(sound)}
            >
              {soundNames[sound]}
            </button>
          ))}
        </div>

        <div className="controls">
          <button className={`control-button ${isDarkMode ? 'dark' : 'light'}`} onClick={isPlaying ? handlePause : () => handlePlay(currentSound || 'sea')}>
            {isPlaying ? '⏸️' : '▶️'}
          </button>
          <button className={`control-button ${isDarkMode ? 'dark' : 'light'}`} onClick={handleStop}>
            ⏹️
          </button>
        </div>

        <div className={`timer-display ${isDarkMode ? 'dark' : 'light'}`}>
          <span>{formatTime(playbackTime)}</span>
          <input 
            type='range' 
            min='0' 
            max={duration || 0} 
            value={playbackTime} 
            onChange={handleSeek}
            className={`seek-bar ${isDarkMode ? 'dark' : 'light'}`}
            disabled={!duration}
          />
        </div>

        <div className={`volume-control ${isDarkMode ? 'dark' : 'light'}`}>
          <label>Громкость:</label>
          <input 
            type='range' 
            min='0' 
            max='1' 
            step='0.1' 
            value={volume} 
            onChange={handleVolumeChange}
            className={`volume-bar ${isDarkMode ? 'dark' : 'light'}`}
          />
        </div>
      </div>

      {showFloatingPlayer && createPortal(
        <div 
          className={`floating-player ${isDarkMode ? 'dark' : 'light'} ${isMinimized ? 'minimized' : ''} ${isDragging ? 'dragging' : ''}`}
          style={{ top: floatingPosition.top, left: floatingPosition.left }}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
        >
          <button className="close-button" onClick={handleCloseFloatingPlayer}>✕</button>
          <button className="minimize-button" onClick={toggleMinimize}>
            {isMinimized ? '⤢' : '⤡'}
          </button>
          {!isMinimized && (
            <>
              <div className="floating-controls">
                <button className="floating-control-button" onClick={handlePrev}>◀</button>
                <button className="floating-control-button" onClick={isPlaying ? handlePause : () => handlePlay(currentSound)}>
                  {isPlaying ? '⏸️' : '▶️'}
                </button>
                <button className="floating-control-button" onClick={handleStop}>
                  ⏹️
                </button>
                <button className="floating-control-button" onClick={handleNext}>▶</button>
              </div>
              <div className="floating-timer">
                <span>{formatTime(playbackTime)}</span>
                <input 
                  type='range' 
                  min='0' 
                  max={duration || 0} 
                  value={playbackTime} 
                  onChange={handleSeek}
                  className="floating-seek-bar"
                  disabled={!duration}
                />
              </div>
              <div className="floating-volume">
                <input 
                  type='range' 
                  min='0' 
                  max='1' 
                  step='0.1' 
                  value={volume} 
                  onChange={handleVolumeChange}
                  className="floating-volume-bar"
                />
              </div>
            </>
          )}
          {isMinimized && (
            <button className="floating-control-button minimized-play" onClick={isPlaying ? handlePause : () => handlePlay(currentSound)}>
              {isPlaying ? '⏸️' : '▶️'}
            </button>
          )}
        </div>,
        document.body
      )}
    </>
  );
};

export default AudioPlayer;
