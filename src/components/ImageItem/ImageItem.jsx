import React, { useState } from "react";
import { observer } from "mobx-react-lite";
import galleryStore from "../../stores/GalleryStore";
import LazyImage from "../../components/LazyImage/LazyImage";

const ImageItem = observer(({ image, onOpenModal }) => {
  const [showActionButtons, setShowActionButtons] = useState(false);
  const [actionTimeout, setActionTimeout] = useState(null);

  const toggleActionButtons = () => {
    if (showActionButtons) {
      setShowActionButtons(false);
      if (actionTimeout) {
        clearTimeout(actionTimeout);
        setActionTimeout(null);
      }
    } else {
      setShowActionButtons(true);
      const timeoutId = setTimeout(() => {
        setShowActionButtons(false);
        setActionTimeout(null);
      }, 5000);
      setActionTimeout(timeoutId);
    }
  };

  const copyImageUrl = async (url) => {
    try {
      await navigator.clipboard.writeText(url);
      alert('URL изображения скопирован в буфер обмена!');
    } catch (err) {
      console.error('Ошибка копирования:', err);
      alert('Не удалось скопировать. Попробуйте вручную скопировать URL.');
    }
  };

  const shareImageUrl = async (url, alt) => {
    if (navigator.share) {
      try {
        await navigator.share({ title: 'Изображение из галереи', text: `Посмотри на изображение "${alt}" в галерее!`, url: url });
      } catch (err) {
        alert('Не удалось поделиться. Попробуйте вручную.');
      }
    } else {
      const subject = encodeURIComponent('Изображение из галереи');
      const body = encodeURIComponent(`Посмотри это изображение: ${alt}\n\nСсылка: ${url}`);
      window.open(`mailto:?subject=${subject}&body=${body}`);
    }
  };

  const handleZoomToggle = () => {
    const currentLevel = galleryStore.getZoomLevelForImage(image.id);
    const newLevel = currentLevel === 'zoomed' ? 'normal' : 'zoomed';
    galleryStore.setZoomLevelForImage(image.id, newLevel);
  };

  const isZoomed = galleryStore.getZoomLevelForImage(image.id) === 'zoomed';

  return (
    <div className="first_block">
      <div className={`internal_content ${isZoomed ? 'zoomed' : ''}`}>
        <LazyImage 
          src={image.url} 
          alt={image.alt}
          className={`fade-in ${isZoomed ? 'zoomed' : ''}`} 
          onClick={() => onOpenModal(image)} 
        />
        <div className="buttons-container">
          <button className='action-button-expanded' onClick={toggleActionButtons}>➦
            {showActionButtons && (
              <div className="action-buttons-expanded">
                <button className="copy-button" onClick={() => copyImageUrl(image.url)}>Copy!</button>
                <button className="share-button" onClick={() => shareImageUrl(image.url, image.alt)}>Share!</button>
              </div>
            )}
          </button>
          <button 
            onClick={handleZoomToggle} 
            className="zoom-button" 
            title={isZoomed ? "Уменьшить" : "Увеличить"}
          >
            {isZoomed ? '➖' : '➕'}
          </button>
          {galleryStore.filterMode !== 'dislikes' && (
            <button className="favorite-button" onClick={() => galleryStore.toggleFavorite(image.id)}>
              {galleryStore.isFavorite(image.id) ? '❤️' : '🤍'}
            </button>
          )}
          {galleryStore.filterMode !== 'favorites' && (
            <button className="dislike-button" onClick={() => galleryStore.toggleDislike(image.id)}>
              {galleryStore.isDisliked(image.id) ? 'X' : 'X'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
});

export default ImageItem;