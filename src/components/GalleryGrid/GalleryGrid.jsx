import React, { useState } from "react";
import { observer } from "mobx-react-lite";
import galleryStore from "../../stores/GalleryStore";
import Pagination from "../Pagination/Pagination";
import ImageItem from "../ImageItem/ImageItem";
// NightModeButton больше не нужен здесь, если управление темой вынесено в глобальный контекст
// import NightModeButton from "../NightModeButton/NightModeButton"; 
import { useTheme } from "../../../src/components/ThemeContext"; // <-- 1. Исправленный импорт
import styles from "./GalleryGrid.module.css";

// 2. Убрали лишние пропсы nightMode, setNightMode
const GalleryGrid = observer(({ onOpenModal, onPageChange }) => {
  const { isDarkMode } = useTheme();
  const [isSelectFocused, setIsSelectFocused] = useState(false);
  const isZoomed = galleryStore.zoomLevel === 'zoomed';

  return (
    <div className={`${styles.Content} ${isDarkMode ? styles.ContentDark : styles.ContentLight}`}> 
      <Pagination currentPage={galleryStore.currentPage} totalPages={galleryStore.totalPages} onPageChange={onPageChange} />
      
      <div className={`${styles.Main} ${isDarkMode ? styles.MainDark : styles.MainLight}`}> 
        <div className={styles.ALL_OR_MODE}> 
          {/* Если NightModeButton управляет темой через контекст, его можно оставить здесь */}
          {/* <NightModeButton /> */}
          <div className={styles.search}> 
            <select  
              // 3. Исправлен id
              id={`select-${isDarkMode ? 'dark' : 'light'}`}
              value={galleryStore.currentSection}
              // 4. Убраны инлайн-стили, предполагая, что они есть в CSS-модуле
              onChange={(e) => galleryStore.setCurrentSection(e.target.value)}
              onFocus={() => setIsSelectFocused(true)}
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

        {galleryStore.filterMode === 'favorites' && (
          <div>
            <h2>Избранные</h2>
            <button onClick={() => galleryStore.clearFavorites()}>Сбросить избранные</button>
          </div>
        )}
        {galleryStore.filterMode === 'dislikes' && (
          <div>
            <h2>Дизлайки</h2>
            <button onClick={() => galleryStore.clearDislikes()}>Сбросить дизлайки</button>
          </div>
        )}

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