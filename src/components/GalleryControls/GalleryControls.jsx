import React, { useRef, useState, useEffect } from "react";
import { observer } from "mobx-react-lite";
import galleryStore from "../../stores/GalleryStore";
import PhotoCounter from "../PhotoCounter/PhotoCounter";
import SearchComponent from "../SearchComponent/SearchComponent";
import styles from "./GalleryControls.module.css"; // Импорт модуля
import { useTheme } from "../ThemeContext"; // Добавлен импорт

const GalleryControls = observer(() => {
  const { isDarkMode } = useTheme();
  const [isSelectFocused, setIsSelectFocused] = useState(false);
  const selectContainerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isSelectFocused && selectContainerRef.current && !selectContainerRef.current.contains(event.target)) {
        setIsSelectFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSelectFocused]);

  const handleClearFilters = () => {
    galleryStore.setFilterMode('all');
    galleryStore.setSearchTerm('');
    galleryStore.setCurrentSection('all');
  };

  return (
    <div className={`${styles.controlsWrapper} ${isDarkMode ? styles.controlsWrapperDark : styles.controlsWrapperLight}`} ref={selectContainerRef}> {/* Обновлено */}
      <div className={styles.centeredCounter}> {/* Добавлено, если нужно */}
        <PhotoCounter />
      </div>
      <div className={styles.searchAndFilterContainer}> {/* Добавлено, если нужно */}
        <SearchComponent 
          searchTerm={galleryStore.searchTerm}
          setSearchTerm={galleryStore.setSearchTerm}
          images={galleryStore.filteredImages}
          isDarkMode={isDarkMode}
        />
    
        <div className={styles.buttonsFavorites}> {/* Обновлено */}
          <button
            className={`${isDarkMode ? styles.AllDark : styles.AllLight} ${galleryStore.filterMode === 'all' ? 'active' : ''}`}
            onClick={() => galleryStore.setFilterMode('all')}
          >
            Все
          </button>
          <button 
            className={`${isDarkMode ? styles.FavoritesDark : styles.FavoritesLight} ${galleryStore.filterMode === 'favorites' ? 'active' : ''}`} 
            onClick={() => galleryStore.setFilterMode(galleryStore.filterMode === 'favorites' ? 'all' : 'favorites')}
          >
            {galleryStore.filterMode === 'favorites' ? 'Показать все' : 'Избранные'}
          </button> 
          <button 
            className={`${isDarkMode ? styles.DislikesDark : styles.DislikesLight} ${galleryStore.filterMode === 'dislikes' ? 'active' : ''}`} 
            onClick={() => galleryStore.setFilterMode(galleryStore.filterMode === 'dislikes' ? 'all' : 'dislikes')}
          >
            {galleryStore.filterMode === 'dislikes' ? 'Показать все' : 'Дизы'}
          </button>
        </div>
      </div>
    </div>
  );
});

export default GalleryControls;