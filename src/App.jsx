import React, { useState, useEffect, lazy, Suspense } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ThemeProvider } from "./components/ThemeContext";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import Preload from "./components/Preload/Preload"; // Импортируем Preload
import "./styles/global/global.css";

const CombinedContent = lazy(() => import("./components/content/CombinedContent"));

const App = () => {
  const [user, setUser] = useState(null);
  const [isPreloading, setIsPreloading] = useState(true); // Состояние для управления прелоадером

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("user") || 'null');
    if (savedUser) {
      setUser(savedUser);
    }

    // Таймер для скрытия прелоадера
    const timer = setTimeout(() => {
      setIsPreloading(false);
    }, 3000); // Прелоадер будет показан 3 секунды

    // Очистка таймера при размонтировании компонента
    return () => clearTimeout(timer);
  }, []); // Пустой массив зависимостей, чтобы эффект сработал один раз

  // Если прелоадер активен, показываем только его
  if (isPreloading) {
    return <Preload />;
  }

  // Иначе показываем основное приложение
  return (
    <ThemeProvider>
      <div className="App-fade-in">
        <Header />
        <Router>
          <Suspense fallback={<div>Loading...</div>}>
            <div className="App">
              <Routes>
                <Route path="/" element={<CombinedContent user={user} />} />
              </Routes>
            </div>
          </Suspense>
        </Router>
        <Footer />
      </div>
    </ThemeProvider>
  );
};

export default App;