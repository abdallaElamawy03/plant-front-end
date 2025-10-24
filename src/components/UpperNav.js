import React from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import useLogout from "../hooks/useLogout";
import useTheme from "../hooks/useTheme";

const UpperNav = () => {
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
          <Link to="/" className="text-lg font-semibold">
            SmartAgri
          </Link>
        </div>

        <nav className="hidden md:flex items-center space-x-4">
          <NavLink
            to="/soil"
            className={({ isActive }) =>
              `nav-link ${isActive ? "active-link" : ""}`
            }
          >
            Soil Analysis
          </NavLink>

          <NavLink
            to="/diagnosis"
            className={({ isActive }) =>
              `nav-link ${isActive ? "active-link" : ""}`
            }
          >
            Diagnosis
          </NavLink>

          <NavLink
            to="/community"
            className={({ isActive }) =>
              `nav-link ${
                isActive
                  ? "active-link"
                  : "bg-green-50 text-green-700 px-3 py-1 rounded-md"
              }`
            }
          >
            Community
          </NavLink>

          <NavLink
            to="/profile"
            className={({ isActive }) =>
              `nav-link ${isActive ? "active-link" : ""}`
            }
          >
            Profile
          </NavLink>
        </nav>

        <div className="flex items-center gap-4">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-md bg-gray-100 text-gray-600 hover:bg-gray-200"
            aria-label="toggle-theme"
            title={theme === "dark" ? "Switch to light" : "Switch to dark"}
          >
            <i className={theme === "dark" ? "fas fa-sun" : "fas fa-moon"}></i>
          </button>

          <div className="hidden sm:flex items-center gap-3">
            <span className="text-sm text-gray-700">Welcome, {auth?.user}</span>
            <button
              onClick={handleLogout}
              className="px-3 py-1 rounded-md border border-gray-200 text-sm text-gray-700 hover:bg-gray-50"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default UpperNav;
