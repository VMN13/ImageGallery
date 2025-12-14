import React, { useRef, useEffect } from "react";
import { observer } from "mobx-react-lite";

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
        !e.target.closest('.Pagination') &&
        !e.target.closest('.buttons-favorites') &&
        !e.target.closest('.search') &&
        !e.target.closest('.Main')
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

  return (
    <div className="search">
      <div className="search-input-container">
        <input
          ref={inputRef}
          type="text"
          placeholder="Поиск по описанию..."
          value={searchTerm}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          className={`search-input ${isDarkMode ? "dark" : "light"}`}
        />
        <button className={`Clear ${isDarkMode ? 'dark' : 'light'} equal-width`} type="button" onClick={() => setSearchTerm('')}>Очистить</button>
        {suggestion && (
          <span className="search-suggestion" style={{ opacity: 0.5, position: 'absolute', left: '10px', top: '5px' }}>
            {searchTerm}{suggestion}
          </span>
        )}
      </div>
    </div>
  );
});

export default SearchComponent;