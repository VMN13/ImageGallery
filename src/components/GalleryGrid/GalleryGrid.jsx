import React, { useState } from "react";
import { observer } from "mobx-react-lite";
import galleryStore from "../../stores/GalleryStore";
import Pagination from "../Pagination/Pagination";
import ImageItem from "../ImageItem/ImageItem";
import NightModeButton from "../NightModeButton/NightModeButton";
import { useTheme } from "../ThemeContext";

const GalleryGrid = observer(({ nightMode, setNightMode, onOpenModal, onPageChange }) => {
  const { isDarkMode } = useTheme();

  const isZoomed = galleryStore.zoomLevel === 'zoomed';

  return (
    <div className={`Content ${isDarkMode ? 'dark' : 'light'}`}>
      <Pagination currentPage={galleryStore.currentPage} totalPages={galleryStore.totalPages} onPageChange={onPageChange} />
      
      <div className={`Main ${isDarkMode ? 'dark' : 'light'}`}>
        <NightModeButton nightMode={nightMode} setNightMode={setNightMode} />
        {galleryStore.filterMode === 'favorites' && (
          <div>
            <div className="d"></div>
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
          <div className="NotFound">
            <p>Изображения не найдены. Попробуйте другой запрос.</p>
          </div>
        )}
      </div>
      <Pagination currentPage={galleryStore.currentPage} totalPages={galleryStore.totalPages} onPageChange={onPageChange} />
      <div className="page-info">
        <p>Страница {galleryStore.currentPage} из {galleryStore.totalPages} (Найдено: {galleryStore.filteredImages.length})</p>
      </div>
      <div className="getSectionTitle">{galleryStore.getSectionTitle()}</div>
    </div>
  );
});

export default GalleryGrid;