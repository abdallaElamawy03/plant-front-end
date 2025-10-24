import React from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import useLogout from "../hooks/useLogout";

const UpperNav = () => {
  const { auth } = useAuth();
  const logout = useLogout();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <header className="bg-gray-900 text-gray-200 shadow-sm">
      <div className="max-w-full mx-auto px-6 py-3 sm:px-6 lg:px-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-9 h-9 bg-green-600 rounded-md flex items-center justify-center text-white">
            <i className="fas fa-seedling"></i>
          </div>
          <Link to="/" className="text-lg font-semibold text-white">
            SmartAgri
          </Link>
        </div>

        <nav className="hidden md:flex items-center space-x-6">
          <Link to="/soil" className="text-gray-300 hover:text-white">
            Soil Analysis
          </Link>
          <Link to="/diagnosis" className="text-gray-300 hover:text-white">
            Diagnosis
          </Link>
          <Link
            to="/community"
            className="bg-gray-800 text-green-300 px-3 py-1 rounded-md"
          >
            Community
          </Link>
          <Link to="/profile" className="text-gray-300 hover:text-white">
            Profile
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <button
            className="p-2 rounded-md bg-gray-800 text-gray-300 hover:bg-gray-700"
            aria-label="toggle-theme"
          >
            <i className="fas fa-sun"></i>
          </button>

          <div className="hidden sm:flex items-center gap-3">
            <span className="text-sm text-gray-300">Welcome, {auth?.user}</span>
            <button
              onClick={handleLogout}
              className="px-3 py-1 rounded-md border border-gray-700 text-sm text-gray-200 hover:bg-gray-800"
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
