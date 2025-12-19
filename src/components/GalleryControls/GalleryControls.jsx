import React, { useRef, useState, useEffect } from "react";
import { observer } from "mobx-react-lite";
import galleryStore from "../../stores/GalleryStore";
import PhotoCounter from "../PhotoCounter/PhotoCounter";
import SearchComponent from "../SearchComponent/SearchComponent";
import ImageUploadComponent from "../../components/ImageUpload/ImageUploadComponent";
import styles from "./GalleryControls.module.css";
import { useTheme } from "../ThemeContext";

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

  const handleImageUpload = (imageData) => {
    galleryStore.addUserImage(imageData);
    galleryStore.setCurrentSection('user');
  };

  return (
    <div className={`${styles.controlsWrapper} ${isDarkMode ? styles.controlsWrapperDark : styles.controlsWrapperLight}`} ref={selectContainerRef}>
      <div className={styles.centeredCounter}>
        <PhotoCounter />
      </div>
      <div className={styles.searchAndFilterContainer}>
        <SearchComponent 
          searchTerm={galleryStore.searchTerm}
          setSearchTerm={galleryStore.setSearchTerm}
          images={galleryStore.filteredImages}
          isDarkMode={isDarkMode}
        />
    
        <div className={styles.buttonsFavorites}>
          <button
            className={`${isDarkMode ? styles.AllDark : styles.AllLight} ${galleryStore.currentSection === 'all' && galleryStore.filterMode === 'all' ? 'active' : ''}`}
            onClick={() => {
              galleryStore.setCurrentSection('all');
              galleryStore.setFilterMode('all');
            }}
          >
            Все фотографии
          </button>
          
          {/* --- ИСПРАВЛЕНА КНОПКА --- */}
          <button 
            className={`${isDarkMode ? styles.FavoritesDark : styles.FavoritesLight} ${galleryStore.filterMode === 'favorites' ? 'active' : ''}`} 
            onClick={() => {
              const newFilterMode = galleryStore.filterMode === 'favorites' ? 'all' : 'favorites';
              galleryStore.setFilterMode(newFilterMode);
              // Важно: сбрасываем раздел, чтобы скрыть элементы из "Моих изображений"
              galleryStore.setCurrentSection('all'); 
            }}
          >
            {galleryStore.filterMode === 'favorites' ? 'Показать все' : 'Ваши Избранные'}
          </button> 

          {/* --- ИСПРАВЛЕНА КНОПКА --- */}
          <button 
            className={`${isDarkMode ? styles.DislikesDark : styles.DislikesLight} ${galleryStore.filterMode === 'dislikes' ? 'active' : ''}`} 
            onClick={() => {
              const newFilterMode = galleryStore.filterMode === 'dislikes' ? 'all' : 'dislikes';
              galleryStore.setFilterMode(newFilterMode);
              // Важно: сбрасываем раздел, чтобы скрыть элементы из "Моих изображений"
              galleryStore.setCurrentSection('all');
            }}
          >
            {galleryStore.filterMode === 'dislikes' ? 'Показать все' : 'Ваши дизлайки'}
          </button>

          <button 
            className={`${isDarkMode ? styles.AllDark : styles.AllLight} ${galleryStore.currentSection === 'user' ? 'active' : ''}`} 
            onClick={() => {
              galleryStore.setCurrentSection('user');
              galleryStore.setFilterMode('all');
            }}
          >
            Мои изображения
          </button>
          
          {/* Этот компонент теперь будет отображаться корректно */}
          {galleryStore.currentSection === 'user' && (
            <ImageUploadComponent 
              onImageUpload={handleImageUpload} 
              isDarkMode={isDarkMode}
            />
          )}
        </div>
      </div>
    </div>
  );
});

export default GalleryControls;