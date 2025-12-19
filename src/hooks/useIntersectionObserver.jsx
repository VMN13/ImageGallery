// src/hooks/useIntersectionObserver.js
import { useState, useEffect, useRef } from 'react';

/**
 * Кастомный хук для отслеживания видимости элемента в viewport.
 * @param {object} options - Настройки для Intersection Observer.
 * @returns {[React.Ref, boolean]} - Возвращает ref для элемента и флаг isVisible.
 */
export const useIntersectionObserver = (options = {}) => {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        // Отключаем наблюдатель после первого появления, чтобы анимация не сработала снова
        observer.unobserve(element); 
      }
    }, {
      threshold: 0.1, // Запускать, когда 10% элемента видно
      ...options,
    });

    observer.observe(element);

    // Очистка при размонтировании компонента
    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, []);

  return [elementRef, isVisible];
};