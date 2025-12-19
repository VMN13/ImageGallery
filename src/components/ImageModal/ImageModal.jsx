import React, { useEffect, useRef } from 'react';
import { useTheme } from '../ThemeContext';
import styles from './ImageModal.module.css';



const ImageModal = ({ isOpen, onClose, image, shareImageUrl }) => {
  const { isDarkMode } = useTheme();
  const modalRef = useRef(null);
  const previousFocusRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      previousFocusRef.current = document.activeElement;
      if (modalRef.current) {
        modalRef.current.focus();
      }
    } else {
      document.body.style.overflow = 'auto';
      if (previousFocusRef.current) {
        previousFocusRef.current.focus();
      }
    }

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, onClose]);

  if (!isOpen || !image) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div 
        className={`${styles.modalContent} ${isDarkMode ? styles.modalContentDark : styles.modalContentLight}`} 
        onClick={(e) => e.stopPropagation()}
        ref={modalRef}
        tabIndex={-1}
      >
        <img
          src={image.url}
          alt={image.alt}
          className={styles.modalImage}
        />
        <button className={styles.closeButton} onClick={onClose}>×</button>
      </div>
    </div>
  );
};

export default ImageModal;