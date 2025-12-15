import React from "react";
import { useTheme } from "../ThemeContext";
import galleryStore from "../../stores/GalleryStore";
import "./Header.css";

const Header = () => {
  const { isDarkMode, toggleTheme } = useTheme();

  const handleShowAllPhotos = () => {
    console.log("Клик по Header сработал! Сбрасываю фильтры...");
    galleryStore.setSearchTerm('');
    galleryStore.setCurrentSection('all');
    galleryStore.setFilterMode('all');
    galleryStore.setCurrentPage(1);
    console.log("Фильтры сброшены.");
  };

  const handleThemeToggle = (event) => {
    event.stopPropagation();
    toggleTheme();
  };

  return (
    <div 
      className={`Header ${isDarkMode ? "dark" : "light"}`} 
      onClick={handleShowAllPhotos}
      style={{ cursor: 'pointer' }}
    >
      <div className={`header ${isDarkMode ? "dark" : "light"}`}>
        <h1 className="h1_header">Image Gallery</h1>
        <button className={`Mode ${isDarkMode ? "light" : "dark"}`} onClick={handleThemeToggle}>
          {isDarkMode ? "🌞" : "🌜"}
        </button>              
        <div className="section"></div>
      </div>
    </div>
  );
};

export default Header;