import { makeObservable, observable, action, computed } from 'mobx';
import images from '../data/images';  // Убедитесь, что путь правильный

class GalleryStore {
  favorites = [];
  dislikes = [];
  filterMode = 'all';
  currentSection = 'all';
  searchTerm = '';
  currentPage = 1;
  itemsPerPage = 9;
  zoomLevels = {};  // Ключ: id изображения, значение: уровень зума

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
    });

    this.loadFromLocalStorage();
  }

  setZoomLevelForImage = (id, level) => {
    this.zoomLevels = { ...this.zoomLevels, [id]: level };
  };

  getZoomLevelForImage = (id) => {
    return this.zoomLevels[id] || 'normal';
  };

  loadFromLocalStorage = () => {
    try {
      const favoritesData = localStorage.getItem('favorites');
      const dislikesData = localStorage.getItem('dislikes');
      this.favorites = favoritesData ? JSON.parse(favoritesData) : [];
      this.dislikes = dislikesData ? JSON.parse(dislikesData) : [];
    } catch (error) {
      console.error('Error parsing from localStorage:', error);
    }
  };

  saveToLocalStorage = () => {
    localStorage.setItem('favorites', JSON.stringify(this.favorites));
    localStorage.setItem('dislikes', JSON.stringify(this.dislikes));
  };

  clearFavorites = () => {
    if (confirm('Вы уверены, что хотите очистить избранное?')) {
      this.favorites = [];
      this.saveToLocalStorage();
    } else {
      console.log('Избранное не очищено.');
    }
  };

  clearDislikes = () => {
    if (confirm('Вы уверены, что хотите очистить дизлайки?')) {
      this.dislikes = [];
      this.saveToLocalStorage();
    } else {
      console.log('Дизлайки не очищены.');
    }
  };

  setZoomLevel = (level) => {
    // Примечание: Это метод без параметров ID, возможно, для глобального зума. Если нужно, добавьте логику.
    console.log('Setting global zoom level:', level);
  };

  setFilterMode = (mode) => {
    this.filterMode = mode;
    this.currentPage = 1;
  };

  toggleFavorite = (id) => {
    if (this.favorites.includes(id)) {
      this.favorites = this.favorites.filter(favId => favId !== id);
    } else {
      this.favorites = [...this.favorites, id];
      // Удалить из dislikes, если там есть
      if (this.dislikes.includes(id)) {
        this.dislikes = this.dislikes.filter(dislikeId => dislikeId !== id);
      }
    }
    this.saveToLocalStorage();
  };

  toggleDislike = (id) => {
    if (this.dislikes.includes(id)) {
      this.dislikes = this.dislikes.filter(dislikeId => dislikeId !== id);
    } else {
      this.dislikes = [...this.dislikes, id];
      // Удалить из favorites, если там есть
      if (this.favorites.includes(id)) {
        this.favorites = this.favorites.filter(favId => favId !== id);
      }
    }
    this.saveToLocalStorage();
  };

  setCurrentSection = (section) => {
    this.currentSection = section;
    this.currentPage = 1;
  };

  setSearchTerm = (term) => {
    console.log('Setting searchTerm:', term);
    this.searchTerm = term;
    this.currentPage = 1;
  };

  get filteredImages() {
    let imagesFiltered = images;

    if (this.currentSection !== 'all') {
      imagesFiltered = imagesFiltered.filter(image => image.category === this.currentSection);
    }

    if (this.searchTerm) {
      imagesFiltered = imagesFiltered.filter(image =>
        image.alt.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }

    if (this.filterMode === 'all') {
      imagesFiltered = imagesFiltered.filter(image => !this.dislikes.includes(image.id));
    } else if (this.filterMode === 'favorites') {
      imagesFiltered = imagesFiltered.filter(image => this.favorites.includes(image.id));
    } else if (this.filterMode === 'dislikes') {
      imagesFiltered = imagesFiltered.filter(image => this.dislikes.includes(image.id));
    }

    console.log('filteredImages: After filters, count:', imagesFiltered.length);
    return imagesFiltered;
  }

  get totalPages() {
    return Math.ceil(this.filteredImages.length / this.itemsPerPage);
  }

  get currentImages() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.filteredImages.slice(start, end);
  }

  setCurrentPage = (page) => {
    this.currentPage = page;
  };

  isFavorite = (id) => {
    return this.favorites.includes(id);
  };

  isDisliked = (id) => {
    return this.dislikes.includes(id);
  };

  getSectionTitle = () => {
    switch (this.currentSection) {
      case 'nature': return 'Природа';
      case 'cities': return 'Города';
      case 'animals': return 'Животные';
      case 'tech': return 'Технологии';
      case 'food': return 'Еда';
      default: return 'Все разделы';
    }
  };
}

const galleryStore = new GalleryStore();
export default galleryStore;
