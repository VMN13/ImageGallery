import React, { useEffect, FC } from 'react';
import './ImageModal.css';

interface Image {
  id: string;
  url: string;
  alt: string;
  // Добавьте другие поля
}

interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  image: Image | null;
  shareImageUrl: (url: string, alt: string) => void;
}

const ImageModal: FC<ImageModalProps> = ({ isOpen, onClose, image, shareImageUrl }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
      document.body.classList.add('modal-open');
      document.documentElement.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
      document.body.classList.remove('modal-open');
    };
  }, [isOpen, onClose]);

  if (!isOpen || !image) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e: React.MouseEvent) => e.stopPropagation()}>
        <img
          src={image.url}
          alt={image.alt}
          className="modal-image"
        />
        <button className="close-button" onClick={onClose}>×</button>
      </div>
    </div>
  );
};

export default ImageModal;