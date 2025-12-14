import React, { useState, useEffect, useRef } from "react";
import { observer } from "mobx-react-lite";
import galleryStore from "../../stores/GalleryStore";
import { useTheme } from "../ThemeContext";
import ImageModal from "../ImageModal/ImageModal"; 
import AudioPlayer from "../AudioPlayer/AudioPlayer";
import GalleryControls from "../GalleryControls/GalleryControls";
import GalleryGrid from "../GalleryGrid/GalleryGrid";
import "../../styles/Content.css";

const CombinedContent = observer(() => {
  const [modalImage, setModalImage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSelectFocused, setIsSelectFocused] = useState(false);
  const selectContainerRef = useRef(null);
  const [nightMode, setNightMode] = useState(false);
  const [showActionButtons, setShowActionButtons] = useState({});
  const [actionTimeouts, setActionTimeouts] = useState({});
  const user = true; // Предполагаем, что это будет заменено на реальный тип из аутентификации
  const { isDarkMode } = useTheme();

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

  const toggleActionButtons = (id) => {
    const isOpen = showActionButtons[id];
    if (isOpen) {
      setShowActionButtons((prev) => ({ ...prev, [id]: false }));
      if (actionTimeouts[id]) {
        clearTimeout(actionTimeouts[id]);
        setActionTimeouts((prev) => ({ ...prev, [id]: null }));
      }
    } else {
      setShowActionButtons((prev) => ({ ...prev, [id]: true }));
      const timeoutId = setTimeout(() => {
        setShowActionButtons((prev) => ({ ...prev, [id]: false }));
        setActionTimeouts((prev) => ({ ...prev, [id]: null }));
      }, 5000);
      setActionTimeouts((prev) => ({ ...prev, [id]: timeoutId }));
    }
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= galleryStore.totalPages) {
      galleryStore.setCurrentPage(page);
      window.scrollTo({ top: 102, behavior: "smooth" });
    }
  };

  const openModal = (image) => {
    setModalImage(image);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setModalImage(null);
    setIsModalOpen(false);
  };

  if (!user) return <p>Пожалуйста, войдите в систему.</p>;

  const copyImageUrl = async (url) => {
    try {
      await navigator.clipboard.writeText(url);
      alert('URL изображения скопирован в буфер обмена!');
    } catch (err) {
      console.error('Ошибка копирования:', err);
      alert('Не удалось скопировать. Попробуйте вручную скопировать URL.');
    }
  };

  const shareImageUrl = async (url, alt) => {
    if (navigator.share) {
      try {
        await navigator.share({ title: 'Изображение из галереи', text: `Посмотри на изображение "${alt}" в галерее!`, url: url });
      } catch (err) {
        alert('Не удалось поделиться. Попробуйте вручную.');
      }
    } else {
      const subject = encodeURIComponent('Изображение из галереи');
      const body = encodeURIComponent(`Посмотри это изображение: ${alt}\n\nСсылка: ${url}`);
      window.open(`mailto:?subject=${subject}&body=${body}`);
    }
  };

  return (
    <>
      <div className={`Margin ${isDarkMode ? 'dark' : 'light'}`}>
        <GalleryControls />
        <GalleryGrid 
          nightMode={nightMode}
          setNightMode={setNightMode}
          onOpenModal={openModal}
          onPageChange={handlePageChange}
        />
        <AudioPlayer />  
        <ImageModal isOpen={isModalOpen} onClose={closeModal} image={modalImage} shareImageUrl={shareImageUrl} />
      </div>
    </>
  );
});

export default CombinedContent;