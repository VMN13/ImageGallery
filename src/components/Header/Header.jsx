import React from "react";
import { useTheme } from "../ThemeContext";
import galleryStore from "../../stores/GalleryStore";
import styles from "./Header.module.css"; // Добавлен импорт модуля

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
      className={`${styles.Header} ${isDarkMode ? styles.HeaderDark : styles.HeaderLight}`} 
      onClick={handleShowAllPhotos}
      style={{ cursor: 'pointer' }}
    >
      <div className={`${styles.header} ${isDarkMode ? styles.headerDark : styles.headerLight}`}>
        <h1 className={styles.h1Header}>Image Gallery</h1>
        <button className={`${styles.Mode} ${isDarkMode ? styles.ModeDark : styles.ModeLight}`} onClick={handleThemeToggle}>
          {isDarkMode ? "🌞" : "🌜"}
        </button>              
        <div className={styles.section}></div>
      </div>
    </div>
  );
};

export default Header;