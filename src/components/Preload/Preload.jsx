import React from "react";
import "./Preload.css"; // Убедитесь, что путь корректен (например, если файл в той же папке)

const Preload = () => {
  console.log("Preload component rendered"); // Отладка: проверьте консоль, должен появиться лог
  return (
    <div className="preload">
      <div className="preload-content">
        <h1 className="preload-text">IMAGE GALLERY</h1>
      </div>
    </div>
  );
};

export default Preload;