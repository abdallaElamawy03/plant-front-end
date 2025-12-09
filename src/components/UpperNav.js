import React from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import useAuth from "../hooks/useAuth";
import useLogout from "../hooks/useLogout";
import useTheme from "../hooks/useTheme";
import LanguageSwitcher from "./LanguageSwitcher";

const UpperNav = () => {
  const { t } = useTranslation();
  const { auth } = useAuth();
  const logout = useLogout();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };
  const { theme, toggleTheme } = useTheme();

  return (
    <header
      className="shadow-sm"
      style={{
        background: "var(--surface)",
        color: "var(--text)",
        borderBottom: "1px solid var(--nav-border)",
      }}
    >
      <div className="max-w-full mx-auto px-6 py-3 sm:px-6 lg:px-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-9 h-9 bg-green-600 rounded-md flex items-center justify-center text-white">
            <i className="fas fa-seedling"></i>
          </div>
          <Link to="/dashboard" className="text-lg font-semibold">
            {t("common.appName")}
          </Link>
        </div>

        <nav className="hidden md:flex items-center space-x-4">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `nav-link ${isActive ? "active-link" : ""}`
            }
          >
            {t("nav.dashboard")}
          </NavLink>

          <NavLink
            to="/soil"
            className={({ isActive }) =>
              `nav-link ${isActive ? "active-link" : ""}`
            }
          >
            {t("nav.soilAnalysis")}
          </NavLink>

          <NavLink
            to="/diagnosis"
            className={({ isActive }) =>
              `nav-link ${isActive ? "active-link" : ""}`
            }
          >
            {t("nav.diagnosis")}
          </NavLink>

          <NavLink
            to="/community"
            className={({ isActive }) =>
              `nav-link ${isActive ? "active-link" : ""}`
            }
          >
            {t("nav.community")}
          </NavLink>

          <NavLink
            to="/profile"
            className={({ isActive }) =>
              `nav-link ${isActive ? "active-link" : ""}`
            }
          >
            {t("nav.profile")}
          </NavLink>
        </nav>

        <div className="flex items-center gap-4">
          <LanguageSwitcher />

          <button
            onClick={toggleTheme}
            className="p-2 rounded-md bg-gray-100 text-gray-600 hover:bg-gray-200"
            aria-label="toggle-theme"
            title={
              theme === "dark"
                ? t("theme.switchToLight")
                : t("theme.switchToDark")
            }
          >
            <i className={theme === "dark" ? "fas fa-sun" : "fas fa-moon"}></i>
          </button>

          <div className="hidden sm:flex items-center gap-3">
            <span className="text-sm text-gray-700">
              {t("common.welcome")}, {auth?.user}
            </span>
            <button
              onClick={handleLogout}
              className="px-3 py-1 rounded-md border border-gray-200 text-sm text-gray-700 hover:bg-gray-50"
            >
              {t("common.logout")}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default UpperNav;
