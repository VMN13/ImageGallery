import React from "react";
import { useTheme } from "../ThemeContext"; // Добавлен импорт
import styles from "./Pagination.module.css"; // Предполагая, что вы создадите модуль на основе CSS

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const { isDarkMode } = useTheme();
  
  const goToPrevious = () => {
    onPageChange(currentPage - 1);
  };

  const goToNext = () => {
    onPageChange(currentPage + 1);
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      if (currentPage > 3) {
        pages.push('...');
      }

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        pages.push('...');
      }

      pages.push(totalPages);
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className={styles.Pagination}>
      <button 
        className={`${styles.PaginationButton} ${isDarkMode ? styles.dark : styles.light}`} 
        onClick={goToPrevious} 
        disabled={currentPage === 1}
      >
        ◀
      </button>
      
      {pageNumbers.map((page, index) => {
        if (page === '...') {
          return (
            <span key={`ellipsis-${index}`} className={styles.PaginationEllipsis}>
              ...
            </span>
          );
        }
        return (
          <button 
            key={page}
            className={`${styles.PaginationButton} ${isDarkMode ? styles.dark : styles.light} ${(page) === currentPage ? 'active' : ''}`}
            onClick={() => {
              console.log('Клик на страницу', page);
              onPageChange(page);
            }}
            disabled={(page) === currentPage}
          >
            {page}
          </button>
        );
      })}

      <button 
        className={`${styles.PaginationButton} ${isDarkMode ? styles.dark : styles.light}`} 
        onClick={goToNext} 
        disabled={currentPage === totalPages}
      >
        ▶
      </button>
    </div>
  );
};

export default Pagination;