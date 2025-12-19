import React, { useState, useEffect } from "react";
import { observer } from "mobx-react-lite";
import galleryStore from "../../stores/GalleryStore";
import LazyImage from "../../components/LazyImage/LazyImage";
import styles from "./ImageItem.module.css";
import { useIntersectionObserver } from "../../hooks/useIntersectionObserver"; // Импорт хука

const ImageItem = observer(({ image, onOpenModal }) => {
  const [showActionButtons, setShowActionButtons] = useState(false);
  const [actionTimeout, setActionTimeout] = useState(null);

  // 1. Используем хук для отслеживания видимости элемента
  const [elementRef, isVisible] = useIntersectionObserver();

  // 2. Улучшенная логика для кнопок с очисткой таймера через useEffect
  useEffect(() => {
    if (showActionButtons) {
      const timeoutId = setTimeout(() => {
        setShowActionButtons(false);
      }, 5000);
      setActionTimeout(timeoutId);
    } else {
      if (actionTimeout) {
        clearTimeout(actionTimeout);
      }
    }
    // Функция очистки для useEffect
    return () => {
      if (actionTimeout) {
        clearTimeout(actionTimeout);
      }
    };
  }, [showActionButtons, actionTimeout]);

  const toggleActionButtons = () => {
    setShowActionButtons(!showActionButtons);
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
        // Пользователь мог отменить действие, это не ошибка
        console.log('Шаринг отменен');
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
    // 3. Добавляем ref и динамический класс для анимации появления
    <div 
      ref={elementRef}
      className={`${styles.firstBlock} ${isVisible ? styles.isVisible : ''}`}
    >
      <div className={`${styles.internalContent} ${isZoomed ? styles.internalContentZoomed : ''}`}>
        <LazyImage 
          src={image.url} 
          alt={image.alt}
          // 4. Убираем глобальный класс "fade-in", анимация теперь на контейнере
          onClick={() => onOpenModal(image)} 
        />
        <div className={styles.buttonsContainer}>
          <button className={styles.actionButtonExpanded} onClick={toggleActionButtons}>➦
            {showActionButtons && (
              <div className={styles.actionButtonsExpanded}>
                <button className={styles.copyButton} onClick={() => copyImageUrl(image.url)}>Copy!</button>
                <button className={styles.shareButton} onClick={() => shareImageUrl(image.url, image.alt)}>Share!</button>
              </div>
            )}
          </button>
          <button 
            onClick={handleZoomToggle} 
            className={styles.zoomButton} 
            title={isZoomed ? "Уменьшить" : "Увеличить"}
          >
            {isZoomed ? '➖' : '➕'}
          </button>
          {galleryStore.filterMode !== 'dislikes' && (
            <button className={styles.favoriteButton} onClick={() => galleryStore.toggleFavorite(image.id)}>
              {galleryStore.isFavorite(image.id) ? '❤️' : '🤍'}
            </button>
          )}
          {galleryStore.filterMode !== 'favorites' && (
            <button className={styles.dislikeButton} onClick={() => galleryStore.toggleDislike(image.id)}>
              {galleryStore.isDisliked(image.id) ? 'X' : 'X'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
});

export default ImageItem;