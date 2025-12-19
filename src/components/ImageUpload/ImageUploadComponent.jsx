import React, { useRef, useState } from 'react';
import { useTheme } from '../ThemeContext';
import styles from './ImageUploadComponent.module.css';

const ImageUploadComponent = ({ onImageUpload, isDarkMode }) => {
  const fileInputRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState('');

  const handleFileSelect = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (event) => {
    const files = event.target.files;
    if (!files.length) return;

    setIsUploading(true);
    setError('');
    setUploadProgress(0);

    try {
      const totalFiles = files.length;
      let processedFiles = 0;

      for (let i = 0; i < totalFiles; i++) {
        const file = files[i];
        
        // Проверка типа файла
        if (!file.type.match('image.*')) {
          setError(`Файл ${file.name} не является изображением`);
          continue;
        }

        // Проверка размера (максимум 5MB)
        if (file.size > 5 * 1024 * 1024) {
          setError(`Файл ${file.name} слишком большой (максимум 5MB)`);
          continue;
        }

        // Чтение файла и преобразование в base64
        const reader = new FileReader();
        reader.onload = (e) => {
          const imageData = {
            id: `user_${Date.now()}_${i}`,
            url: e.target.result,
            alt: file.name.replace(/\.[^/.]+$/, ""), // Удаляем расширение файла
            category: 'user', // Специальная категория для пользовательских изображений
            isUserUploaded: true
          };

          onImageUpload(imageData);
          
          processedFiles++;
          setUploadProgress(Math.round((processedFiles / totalFiles) * 100));
        };

        reader.readAsDataURL(file);
      }

      // Сброс значения input после загрузки
      event.target.value = '';
    } catch (err) {
      setError('Произошла ошибка при загрузке изображений');
      console.error('Upload error:', err);
    } finally {
      setTimeout(() => {
        setIsUploading(false);
        setUploadProgress(0);
      }, 1000);
    }
  };

  return (
    <div className={`${styles.uploadContainer} ${isDarkMode ? styles.uploadContainerDark : styles.uploadContainerLight}`}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
      
      <button
        className={`${styles.uploadButton} ${isDarkMode ? styles.uploadButtonDark : styles.uploadButtonLight}`}
        onClick={handleFileSelect}
        disabled={isUploading}
      >
        {isUploading ? 'Загрузка...' : 'Загрузить фото'}
      </button>
      
      {isUploading && (
        <div className={styles.progressContainer}>
          <div className={styles.progressBar}>
            <div 
              className={`${styles.progressFill} ${isDarkMode ? styles.progressFillDark : styles.progressFillLight}`}
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
          <span className={styles.progressText}>{uploadProgress}%</span>
        </div>
      )}
      
      {error && <div className={styles.errorMessage}>{error}</div>}
    </div>
  );
};

export default ImageUploadComponent;