import React, { useRef, useEffect } from "react";
import { observer } from "mobx-react-lite";
import styles from "./SearchComponent.module.css"; // Добавлен импорт модуля

const SearchComponent = observer(({
  searchTerm,
  setSearchTerm,
  images,
  isDarkMode
}) => {
  const inputRef = useRef(null);

  const getSuggestion = (value) => {
    if (!value || !Array.isArray(images) || images.length === 0) {
      return '';
    }
    const lowerValue = value.toLowerCase();
    const matchingSuggestion = images
      .map(img => img.alt.toLowerCase())
      .find(alt => alt.startsWith(lowerValue) && alt !== lowerValue);
    return matchingSuggestion ? matchingSuggestion.slice(value.length) : '';
  };

  useEffect(() => {
    if (inputRef.current) {
      requestAnimationFrame(() => {
        inputRef.current?.focus();
      });
    }
  }, []);

  useEffect(() => {
    const handleClick = (e) => {
      if (
        inputRef.current &&
        !inputRef.current.contains(e.target) &&
        !e.target.closest('.Pagination') && // Оставлено как глобальный класс
        !e.target.closest('.buttons-favorites') && // Оставлено как глобальный класс
        !e.target.closest('.search') && // Оставлено как глобальный класс
        !e.target.closest('.Main') // Оставлено как глобальный класс
      ){
        setSearchTerm('');
      }
    };
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [setSearchTerm]);

  const handleChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleKeyDown = (e) => {
    const suggestion = getSuggestion(searchTerm);
    if ((e.key === 'Tab' || e.key === 'Enter') && suggestion) {
      e.preventDefault();
      setSearchTerm(searchTerm + suggestion);
    } else if (e.key === 'Escape') {
      setSearchTerm('');
    }
  };

  const suggestion = getSuggestion(searchTerm);

  const handleSuggestionClick = () => {
    if (suggestion) {
      setSearchTerm(searchTerm + suggestion);
    }
  };

  return (
    <div className={styles.search}>
      <div className={styles.searchInputContainer}>
        <input
          ref={inputRef}
          type="text"
          placeholder="Поиск по описанию..."
          value={searchTerm}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          className={`${styles.searchInput} ${isDarkMode ? styles.inputDark : styles.inputLight}`}
        />
        <button className={`${styles.Clear} ${isDarkMode ? styles.ClearDark : styles.ClearLight} equal-width`} type="button" onClick={() => setSearchTerm('')}>Очистить</button>
        {suggestion && (
          <span 
            className={styles.searchSuggestion} 
            style={{ 
              opacity: 0.5, 
              position: 'absolute', 
              left: '10px', 
              top: '5px', 
              cursor: 'pointer', 
              textDecoration: 'underline' 
            }}
            onClick={handleSuggestionClick}
          >
            {searchTerm}{suggestion}
          </span>
        )}
      </div>
    </div>
  );
});

export default SearchComponent;