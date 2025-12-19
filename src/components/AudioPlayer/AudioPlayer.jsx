import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';  // Import createPortal from 'react-dom'
import { useTheme } from '../ThemeContext';
import styles from './AudioPlayer.module.css'; // Добавлен импорт модуля

const soundUrls = {
  sea: '/sounds/sea.mp3',
  forest: '/sounds/forest.mp3',
  rain: '/sounds/rain.mp3',
  calm: '/sounds/sunny.mp3',
  market: '/sounds/market.mp3',
  kolokol: '/sounds/kolokol.mp3',
  veter: '/sounds/veter.mp3'
};

const soundNames = {
  sea: 'Море',
  forest: 'Лес',
  rain: 'Дождь',
  calm: 'Спокойная погода',
  market: 'Рынок',
  kolokol: 'Колокола',
  veter: 'Ветер'
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
      <div className={`${styles.audioPlayer} ${isDarkMode ? styles.audioPlayerDark : styles.audioPlayerLight}`}>
        <audio
          ref={audioRef}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={() => {
            setIsPlaying(false);
            setShowFloatingPlayer(false);
          }}
        />
        
        <div className={styles.soundButtons}>
          {Object.keys(soundUrls).map((sound) => (
            <button
              key={sound}
              className={`${styles.soundButton} ${isDarkMode ? styles.soundButtonDark : styles.soundButtonLight} ${currentSound === sound ? styles.soundButtonActive : ''}`}
              onClick={() => handlePlay(sound)}
            >
              {soundNames[sound]}
            </button>
          ))}
        </div>

        <div className={styles.controls}>
          <button className={`${styles.controlButton} ${isDarkMode ? styles.controlButtonDark : styles.controlButtonLight}`} onClick={isPlaying ? handlePause : () => handlePlay(currentSound || 'sea')}>
            {isPlaying ? '⏸️' : '▶️'}
          </button>
          <button className={`${styles.controlButton} ${isDarkMode ? styles.controlButtonDark : styles.controlButtonLight}`} onClick={handleStop}>
            ⏹️
          </button>
        </div>

        <div className={`${styles.timerDisplay} ${isDarkMode ? styles.timerDisplayDark : styles.timerDisplayLight}`}>
          <span>{formatTime(playbackTime)}</span>
          <input 
            type='range' 
            min='0' 
            max={duration || 0} 
            value={playbackTime} 
            onChange={handleSeek}
            className={`${styles.seekBar} ${isDarkMode ? styles.seekBarDark : styles.seekBarLight}`}
            disabled={!duration}
          />
        </div>

        <div className={`${styles.volumeControl} ${isDarkMode ? styles.volumeControlDark : styles.volumeControlLight}`}>
          <label>Громкость:</label>
          <input 
            type='range' 
            min='0' 
            max='1' 
            step='0.1' 
            value={volume} 
            onChange={handleVolumeChange}
            className={`${styles.volumeBar} ${isDarkMode ? styles.volumeBarDark : styles.volumeBarLight}`}
          />
        </div>
      </div>

      {showFloatingPlayer && createPortal(
        <div 
          className={`${styles.floatingPlayer} ${isDarkMode ? styles.floatingPlayerDark : styles.floatingPlayerLight} ${isMinimized ? styles.floatingPlayerMinimized : ''} ${isDragging ? styles.floatingPlayerDragging : ''}`}
          style={{ top: floatingPosition.top, left: floatingPosition.left }}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
        >
          <button className={styles.closeButton} onClick={handleCloseFloatingPlayer}>✕</button>
          <button className={styles.minimizeButton} onClick={toggleMinimize}>
            {isMinimized ? '⤢' : '⤡'}
          </button>
          {!isMinimized && (
            <>
              <div className={styles.floatingControls}>
                <button className={styles.floatingControlButton} onClick={handlePrev}>◀</button>
                <button className={styles.floatingControlButton} onClick={isPlaying ? handlePause : () => handlePlay(currentSound)}>
                  {isPlaying ? '⏸️' : '▶️'}
                </button>
                <button className={styles.floatingControlButton} onClick={handleStop}>
                  ⏹️
                </button>
                <button className={styles.floatingControlButton} onClick={handleNext}>▶</button>
              </div>
              <div className={styles.floatingTimer}>
                <span>{formatTime(playbackTime)}</span>
                <input 
                  type='range' 
                  min='0' 
                  max={duration || 0} 
                  value={playbackTime} 
                  onChange={handleSeek}
                  className={styles.floatingSeekBar}
                  disabled={!duration}
                />
              </div>
              <div className={styles.floatingVolume}>
                <input 
                  type='range' 
                  min='0' 
                  max='1' 
                  step='0.1' 
                  value={volume} 
                  onChange={handleVolumeChange}
                  className={styles.floatingVolumeBar}
                />
              </div>
            </>
          )}
          {isMinimized && (
            <button className={styles.floatingControlButtonMinimizedPlay} onClick={isPlaying ? handlePause : () => handlePlay(currentSound)}>
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