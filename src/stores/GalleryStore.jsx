import { makeObservable, observable, action, computed } from 'mobx';
import images from '../data/images';  // Убедитесь, что путь правильный

class GalleryStore {
  favorites = [];
  dislikes = [];
  filterMode = 'all';  // 'all', 'favorites', 'dislikes'
  currentSection = 'all';  // 'all', 'nature', 'cities', 'animals', 'tech', 'food', 'user'
  searchTerm = '';
  currentPage = 1;
  itemsPerPage = 9;
  zoomLevels = {};  // Ключ: id изображения, значение: уровень зума
  userImages = [];  // Массив для хранения пользовательских изображений

  constructor() {
    makeObservable(this, {
      favorites: observable,
      dislikes: observable,
      filterMode: observable,
      currentSection: observable,
      searchTerm: observable,
      currentPage: observable,
      itemsPerPage: observable,
      zoomLevels: observable,
      userImages: observable,
      filteredImages: computed,
      totalPages: computed,
      currentImages: computed,
      setFilterMode: action,
      toggleFavorite: action,
      toggleDislike: action,
      setCurrentSection: action,
      setSearchTerm: action,
      setCurrentPage: action,
      loadFromLocalStorage: action,
      saveToLocalStorage: action,
      setZoomLevel: action,
      setZoomLevelForImage: action,
      clearFavorites: action,
      clearDislikes: action,
      addUserImage: action,
      removeUserImage: action,
      clearUserImages: action,
      isFavorite: action,  // Изменено на action, так как это функция
      isDisliked: action,
      isUserImage: action,
      getSectionTitle: action,  // Изменено на action, так как это метод
    });

    this.loadFromLocalStorage();
  }

  // Метод для добавления пользовательского изображения
  addUserImage = (image) => {
    // Предполагаем, что image имеет id, category: 'user', и другие поля
    this.userImages = [...this.userImages, { ...image, category: 'user' }];
    this.saveUserImagesToLocalStorage();
  };

  // Метод для удаления пользовательского изображения
  removeUserImage = (imageId) => {
    this.userImages = this.userImages.filter(img => img.id !== imageId);
    // Также удаляем из избранного и дизлайков
    this.favorites = this.favorites.filter(id => id !== imageId);
    this.dislikes = this.dislikes.filter(id => id !== imageId);
    this.saveUserImagesToLocalStorage();
    this.saveToLocalStorage();
  };

  // Метод для очистки всех пользовательских изображений
  clearUserImages = () => {
    if (confirm('Вы уверены, что хотите удалить все загруженные изображения?')) {
      // Удаляем все пользовательские изображения из избранного и дизлайков
      const userIds = this.userImages.map(img => img.id);
      this.favorites = this.favorites.filter(id => !userIds.includes(id));
      this.dislikes = this.dislikes.filter(id => !userIds.includes(id));
      
      this.userImages = [];
      this.saveUserImagesToLocalStorage();
      this.saveToLocalStorage();
    }
  };

  // Сохранение пользовательских изображений в localStorage
  saveUserImagesToLocalStorage = () => {
    try {
      localStorage.setItem('userImages', JSON.stringify(this.userImages));
    } catch (error) {
      console.error('Error saving user images to localStorage:', error);
      if (error.name === 'QuotaExceededError') {
        alert('Локальное хранилище переполнено. Попробуйте удалить некоторые изображения.');
      }
    }
  };

  // Загрузка пользовательских изображений из localStorage
  loadUserImagesFromLocalStorage = () => {
    try {
      const userImagesData = localStorage.getItem('userImages');
      this.userImages = userImagesData ? JSON.parse(userImagesData) : [];
    } catch (error) {
      console.error('Error parsing user images from localStorage:', error);
      this.userImages = [];
    }
  };

  // Загрузка данных из localStorage
  loadFromLocalStorage = () => {
    try {
      const favoritesData = localStorage.getItem('favorites');
      const dislikesData = localStorage.getItem('dislikes');
      this.favorites = favoritesData ? JSON.parse(favoritesData) : [];
      this.dislikes = dislikesData ? JSON.parse(dislikesData) : [];
      
      this.loadUserImagesFromLocalStorage();
    } catch (error) {
      console.error('Error parsing from localStorage:', error);
    }
  };

  // Сохранение в localStorage
  saveToLocalStorage = () => {
    localStorage.setItem('favorites', JSON.stringify(this.favorites));
    localStorage.setItem('dislikes', JSON.stringify(this.dislikes));
  };

  // Установка уровня зума для конкретного изображения
  setZoomLevelForImage = (id, level) => {
    this.zoomLevels = { ...this.zoomLevels, [id]: level };
  };

  // Получение уровня зума для изображения
  getZoomLevelForImage = (id) => {
    return this.zoomLevels[id] || 'normal';
  };

  // Очистка избранного
  clearFavorites = () => {
    if (confirm('Вы уверены, что хотите очистить избранное?')) {
      this.favorites = [];
      this.saveToLocalStorage();
    }
  };

  // Очистка дизлайков
  clearDislikes = () => {
    if (confirm('Вы уверены, что хотите очистить дизлайки?')) {
      this.dislikes = [];
      this.saveToLocalStorage();
    }
  };

  // Установка глобального уровня зума (если нужно)
  setZoomLevel = (level) => {
    console.log('Setting global zoom level:', level);
  };

  // Установка режима фильтрации
  setFilterMode = (mode) => {
    this.filterMode = mode;
    this.currentPage = 1;
  };

  // Переключение избранного
  toggleFavorite = (id) => {
    if (this.favorites.includes(id)) {
      this.favorites = this.favorites.filter(favId => favId !== id);
    } else {
      this.favorites = [...this.favorites, id];
      // Удалить из dislikes
      this.dislikes = this.dislikes.filter(dislikeId => dislikeId !== id);
    }
    this.saveToLocalStorage();
  };

  // Переключение дизлайка
  toggleDislike = (id) => {
    if (this.dislikes.includes(id)) {
      this.dislikes = this.dislikes.filter(dislikeId => dislikeId !== id);
    } else {
      this.dislikes = [...this.dislikes, id];
      // Удалить из favorites
      this.favorites = this.favorites.filter(favId => favId !== id);
    }
    this.saveToLocalStorage();
  };

  // Установка текущего раздела
  setCurrentSection = (section) => {
    this.currentSection = section;
    this.currentPage = 1;
  };

  // Установка поискового термина
  setSearchTerm = (term) => {
    this.searchTerm = term;
    this.currentPage = 1;
  };

  // Установка текущей страницы
  setCurrentPage = (page) => {
    this.currentPage = page;
  };

  // Вычисляемое свойство: отфильтрованные изображения
  get filteredImages() {
    let baseImages;

    // Выбор базового набора изображений в зависимости от раздела
    if (this.currentSection === 'user') {
      // Только пользовательские изображения
      baseImages = [...this.userImages];
    } else if (this.currentSection === 'all') {
      // Все изображения: базовые + пользовательские
      baseImages = [...images, ...this.userImages];
    } else {
      // Конкретный раздел: только базовые изображения из этой категории
      baseImages = images.filter(image => image.category === this.currentSection);
    }

    // Применение режима фильтрации
    let filtered = baseImages;
    if (this.filterMode === 'favorites') {
      filtered = filtered.filter(image => this.favorites.includes(image.id));
    } else if (this.filterMode === 'dislikes') {
      filtered = filtered.filter(image => this.dislikes.includes(image.id));
    } else if (this.filterMode === 'all') {
      // Исключаем дизлайки
      filtered = filtered.filter(image => !this.dislikes.includes(image.id));
    }

    // Применение поискового термина
    if (this.searchTerm) {
      filtered = filtered.filter(image =>
        image.alt.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }

    return filtered;
  }

  // Вычисляемое свойство: общее количество страниц
  get totalPages() {
    return Math.ceil(this.filteredImages.length / this.itemsPerPage);
  }

  // Вычисляемое свойство: изображения на текущей странице
  get currentImages() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.filteredImages.slice(start, end);
  }

  // Метод: проверка, является ли изображение избранным
  isFavorite = (id) => {
    return this.favorites.includes(id);
  };

  // Метод: проверка, является ли изображение дизлайкнутым
  isDisliked = (id) => {
    return this.dislikes.includes(id);
  };

  // Метод: проверка, является ли изображение пользовательским
  isUserImage = (id) => {
    return this.userImages.some(img => img.id === id);
  };

  // Метод: заголовок раздела
  getSectionTitle = () => {
    switch (this.currentSection) {
      case 'nature': return 'Природа';
      case 'cities': return 'Города';
      case 'animals': return 'Животные';
      case 'tech': return 'Технологии';
      case 'food': return 'Еда';
      case 'user': return 'Мои изображения';
      default: return 'Все разделы';
    }
  };
}

const galleryStore = new GalleryStore();
export default galleryStore;