import React, { FC } from "react";
import styles from "./Footer.module.css"; // Добавлен импорт модуля
import { useTheme } from "../ThemeContext";

const Footer = () => {
  const { isDarkMode } = useTheme();
  return (
    <div className={`${styles.Footer} ${isDarkMode ? styles.FooterDark : styles.FooterLight}`}>
      <div className={styles.footer}>
        <h1 className={styles.footerH1}>Image Gallery All rights reserved <br /> 2025 ©︎</h1>
      </div>
    </div>
  );
};

export default Footer;