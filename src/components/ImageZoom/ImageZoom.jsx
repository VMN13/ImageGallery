import React from "react";
import { observer } from "mobx-react-lite";
import galleryStore from "../../stores/GalleryStore";
import "../styles/ImageZoom.css";

const ImageZoom = observer(() => {
  const handleZoomIn = () => {
    galleryStore.setZoomLevel('zoomed');
  };

  const handleZoomOut = () => {
    galleryStore.setZoomLevel('normal');
  };

  return (
    <div className="image-zoom-controls">
      <button 
        onClick={handleZoomIn}
        disabled={galleryStore.zoomLevel === 'zoomed'}
        className="zoom-button zoom-in"
        title="Увеличить блоки изображений"
      >
        ➕
      </button>
      <button 
        onClick={handleZoomOut}
        disabled={galleryStore.zoomLevel === 'normal'}
        className="zoom-button zoom-out"
        title="Уменьшить блоки изображений"
      >
        ➖
      </button>
    </div>
  );
});

export default ImageZoom;