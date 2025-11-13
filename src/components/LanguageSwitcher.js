import React from "react";
import { useTranslation } from "react-i18next";

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    // Update document direction for RTL support
    document.documentElement.dir = lng === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = lng;
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => changeLanguage("en")}
        className={`px-3 py-1 rounded-md text-sm transition ${
          i18n.language === "en"
            ? "bg-green-600 text-white"
            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
        }`}
        aria-label="Switch to English"
      >
        EN
      </button>
      <button
        onClick={() => changeLanguage("ar")}
        className={`px-3 py-1 rounded-md text-sm transition ${
          i18n.language === "ar"
            ? "bg-green-600 text-white"
            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
        }`}
        aria-label="Switch to Arabic"
      >
        عربي
      </button>
    </div>
  );
};

export default LanguageSwitcher;
