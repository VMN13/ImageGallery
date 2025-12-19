import React, { useState } from "react";
import { observer } from "mobx-react-lite";
import galleryStore from "../../stores/GalleryStore";
import Pagination from "../Pagination/Pagination";
import ImageItem from "../ImageItem/ImageItem";
import { useTheme } from "../../../src/components/ThemeContext";
import styles from "./GalleryGrid.module.css";

const GalleryGrid = observer(({ onOpenModal, onPageChange }) => {
  const { isDarkMode } = useTheme();
  const isZoomed = galleryStore.zoomLevel === 'zoomed';

  return (
    <div className={`${styles.Content} ${isDarkMode ? styles.ContentDark : styles.ContentLight}`}> 
      <Pagination currentPage={galleryStore.currentPage} totalPages={galleryStore.totalPages} onPageChange={onPageChange} />
      
      <div className={`${styles.Main} ${isDarkMode ? styles.MainDark : styles.MainLight}`}> 
        {/* Условие для скрытия select в разделе "user" остается без изменений */}
        {galleryStore.currentSection !== 'user' && (
          <div className={styles.ALL_OR_MODE}> 
            <div className={styles.search}> 
              <select  
                id="section-select"
                value={galleryStore.currentSection}
                onChange={(e) => galleryStore.setCurrentSection(e.target.value)}
                className={`${styles.select} ${isDarkMode ? styles.selectDark : styles.selectLight}`} 
              >
                <option value="all">Все разделы</option>
                <option value="nature">Природа</option>
                <option value="cities">Города</option>
                <option value="animals">Животные</option>
                <option value="tech">Технологии</option>
                <option value="food">Еда</option>
              </select>
            </div>
          </div>
        )}

        {/* Контейнер теперь содержит только заголовки разделов */}
        <div className={`${styles.sectionControlsWrapper} ${isDarkMode ? styles.sectionControlsWrapperDark : styles.sectionControlsWrapperLight}`}>
          {galleryStore.filterMode === 'favorites' && galleryStore.favorites.length > 0 && (
            <h2>Избранные</h2>
          )}
          {galleryStore.filterMode === 'dislikes' && galleryStore.dislikes.length > 0 && (
            <h2>Ваши Дизлайки</h2>
          )}
          {galleryStore.currentSection === 'user' && galleryStore.userImages.length > 0 && (
            <h2>Мои изображения</h2>
          )}
        </div>

        {/* Сетка с изображениями */}
        <div className={`${styles.ImageGrid} ${isZoomed ? styles.zoomed : ''}`}>
          {galleryStore.currentImages.length > 0 ? (
            galleryStore.currentImages.map((image) => (
              <ImageItem 
                key={image.id} 
                image={image} 
                onOpenModal={onOpenModal} 
                isZoomed={isZoomed}
              />
            ))
          ) : (
            <div className={`${styles.NotFound} ${isDarkMode ? styles.NotFoundDark : ''}`}>
              <p>Изображения не найдены. Попробуйте другой запрос.</p>
            </div>
          )}
        </div>

        {/* НОВЫЙ контейнер для кнопок очистки, идущий ПОСЛЕ сетки */}
        <div className={styles.clearButtonsWrapper}>
          {galleryStore.filterMode === 'favorites' && galleryStore.favorites.length > 0 && (
            <button 
              className={`${styles.clearButton} ${isDarkMode ? styles.FavoritesDark : styles.FavoritesLight}`}
              onClick={() => galleryStore.clearFavorites()}
            >
              Сбросить избранные
            </button>
          )}
          {galleryStore.filterMode === 'dislikes' && galleryStore.dislikes.length > 0 && (
            <button 
              className={`${styles.clearButton} ${isDarkMode ? styles.DislikesDark : styles.DislikesLight}`}
              onClick={() => galleryStore.clearDislikes()}
            >
              Сбросить дизлайки
            </button>
          )}
          {galleryStore.currentSection === 'user' && galleryStore.userImages.length > 0 && (
            <button 
              className={`${styles.clearButton} ${isDarkMode ? styles.UserImagesDark : styles.UserImagesLight}`}
              onClick={() => galleryStore.clearUserImages()}
            >
              Очистить мои изображения
            </button>
          )}
        </div>
      </div>
      
      <Pagination currentPage={galleryStore.currentPage} totalPages={galleryStore.totalPages} onPageChange={onPageChange} />
      <div className={styles.pageInfo}>
        <p>Страница {galleryStore.currentPage} из {galleryStore.totalPages} (Найдено: {galleryStore.filteredImages.length})</p>
      </div>
      <div className={styles.getSectionTitle}>{galleryStore.getSectionTitle()}</div>
    </div>
  );
});

export default GalleryGrid;