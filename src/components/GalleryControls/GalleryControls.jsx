import React, { useRef, useState, useEffect } from "react";
import { observer } from "mobx-react-lite";
import galleryStore from "../../stores/GalleryStore";
import PhotoCounter from "../PhotoCounter/PhotoCounter";
import SearchComponent from "../SearchComponent/SearchComponent";
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

  return (
    <div className={`controls-wrapper ${isDarkMode ? 'dark' : 'light'}`} ref={selectContainerRef}>
      <div className="centered-counter">
        <PhotoCounter />
      </div>
      <div className="search-and-filter-container">
        <SearchComponent 
          searchTerm={galleryStore.searchTerm}
          setSearchTerm={galleryStore.setSearchTerm}
          images={galleryStore.filteredImages}  // Замените на реальный массив изображений с типом
          isDarkMode={isDarkMode}
        />
    
        <div className="buttons-favorites"> 
          <button
            className={`All ${isDarkMode ? 'dark' : 'light'} ${galleryStore.filterMode === 'all' ? 'active' : ''}`}
            onClick={() => galleryStore.setFilterMode('all')}
          >
            Все
          </button>
          <button 
            className={`Favorites ${isDarkMode ? 'dark' : 'light'} ${galleryStore.filterMode === 'favorites' ? 'active' : ''}`} 
            onClick={() => galleryStore.setFilterMode(galleryStore.filterMode === 'favorites' ? 'all' : 'favorites')}
          >
            {galleryStore.filterMode === 'favorites' ? 'Показать все' : 'Избранные'}
          </button> 
          <button 
            className={`Dislikes ${isDarkMode ? 'dark' : 'light'} ${galleryStore.filterMode === 'dislikes' ? 'active' : ''}`} 
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