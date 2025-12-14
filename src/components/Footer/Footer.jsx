import React, { FC } from "react";
import "./Footer.css";
import { useTheme } from "../ThemeContext";

const Footer = () => {
  const { isDarkMode } = useTheme();
  return (
    <div className={`Footer ${isDarkMode ? "dark" : "light"}`}>
      <div className="footer">
        <h1 className="footer_h1">Image Gallery All rights reserved <br /> 2025 ©︎</h1>
      </div>
    </div>
  );
};

export default Footer;