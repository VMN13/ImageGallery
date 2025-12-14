import React, { useEffect } from 'react';

const LazyImage = ({src, alt, className, onClick, webpSrc}) => {
  useEffect(() => {
    if (webpSrc) {
      const img = new Image();
      img.src = webpSrc;
    }
  } , [webpSrc]);

  return (
    <picture>
      {webpSrc && <source type="image/webp" srcSet={webpSrc} />}
      <img src={src} 
      alt={alt} 
      className={className} 
      onClick={onClick}
      loading='lazy'
      decoding='async'
      />

    </picture>
  )
}

export default LazyImage;