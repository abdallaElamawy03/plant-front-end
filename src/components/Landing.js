import React from "react";
import { useTranslation } from "react-i18next";
import "./App.css";
import { Link } from "react-router-dom";
import useTheme from "../hooks/useTheme";
import LanguageSwitcher from "./LanguageSwitcher";

const Landing = () => {
  // keep original data arrays so functionality remains the same
  const features = [
    {
      icon: "fas fa-vial text-green-400",
      title: "Soil Analysis",
      description:
        "Get detailed soil health reports and crop recommendations based on scientific analysis",
      color: "text-green-400",
    },
    {
      icon: "fas fa-stethoscope text-blue-400",
      title: "Disease Diagnosis",
      description:
        "Identify plant diseases early with AI-powered image recognition and expert advice",
      color: "text-green-400",
    },
    {
      icon: "fas fa-users text-orange-400",
      title: "Community Network",
      description:
        "Connect with fellow farmers, share experiences, and learn from agricultural experts",
      color: "text-green-400",
    },
  ];

  const { theme, toggleTheme } = useTheme();
  const { t } = useTranslation();

  const stats = [
    {
      value: "10K+",
      label: t("landing.stats.farmersConnected"),
      icon: "fas fa-users",
    },
    {
      value: "95%",
      label: t("landing.stats.accuracyRate"),
      icon: "fas fa-chart-line",
    },
    {
      value: "50+",
      label: t("landing.stats.cropVarieties"),
      icon: "fas fa-seedling",
    },
    {
      value: "24/7",
      label: t("landing.stats.expertSupport"),
      icon: "fas fa-shield-alt",
    },
  ];

  return (
    <div className="min-h-screen font-sans bg-white text-gray-900">
      {/* Top navigation - dark */}
      <nav
        className="backdrop-blur sticky top-0 z-20"
        style={{
          background: "var(--surface)",
          color: "var(--text)",
          borderBottom: "1px solid var(--muted)",
        }}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-green-600 rounded-md flex items-center justify-center text-white">
                  <i className="fas fa-seedling"></i>
                </div>
                <span className="text-lg font-bold">{t("common.appName")}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <LanguageSwitcher />

              <button
                onClick={toggleTheme}
                className="p-2 rounded-md bg-gray-100 text-gray-600 hover:bg-gray-200 hidden sm:inline-flex"
                aria-label="toggle-theme"
                title={
                  theme === "dark"
                    ? t("theme.switchToLight")
                    : t("theme.switchToDark")
                }
              >
                <i
                  className={theme === "dark" ? "fas fa-sun" : "fas fa-moon"}
                ></i>
              </button>
              <Link
                to="/login"
                className="px-4 py-2 rounded-md bg-transparent border border-gray-200 text-gray-700 hover:bg-gray-50"
              >
                {t("common.signIn")}
              </Link>

              <Link
                to="/register"
                className="px-4 py-2 rounded-md bg-green-600 text-white hover:bg-green-700"
              >
                {t("common.signUp")}
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <header className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <h1 className="text-4xl md:text-5xl font-extrabold leading-tight text-gray-900">
                {t("landing.hero.title")}{" "}
                <span className="text-green-600">
                  {t("landing.hero.titleHighlight")}
                </span>
                {t("landing.hero.titleEnd")}
              </h1>
              <p className="text-lg text-gray-600 max-w-2xl">
                {t("landing.hero.subtitle")}
              </p>

              <div className="flex flex-wrap gap-4 pt-4">
                <Link to="/register">
                  <button className="bg-green-600 text-white px-6 py-3 rounded-md text-lg font-medium hover:bg-green-700 flex items-center gap-2">
                    {t("landing.hero.getStarted")}
                    <i className="fas fa-arrow-right"></i>
                  </button>
                </Link>
                <Link to="/login">
                  <button className="px-6 py-3 rounded-md border border-gray-200 text-gray-700 hover:bg-gray-50">
                    {t("landing.hero.signIn")}
                  </button>
                </Link>
              </div>
            </div>

            <div className="relative">
              {/* Floating decorative circles - optimized for light theme */}
              <div className="absolute -top-6 -right-6 w-24 h-24 bg-green-200 rounded-full blur-3xl opacity-60 animate-pulse"></div>
              <div className="absolute top-1/3 -left-8 w-16 h-16 bg-blue-200 rounded-full blur-2xl opacity-70"></div>
              <div
                className="absolute -bottom-4 right-1/4 w-20 h-20 bg-amber-200 rounded-full blur-2xl opacity-65 animate-pulse"
                style={{ animationDelay: "1s" }}
              ></div>
              <div className="absolute top-1/2 -right-4 w-12 h-12 bg-green-300 rounded-full blur-xl opacity-75"></div>

              {/* Accent circles with borders */}
              <div className="absolute top-8 right-8 w-32 h-32 border-2 border-green-300 rounded-full opacity-50"></div>
              <div className="absolute bottom-12 left-12 w-24 h-24 border-2 border-blue-300 rounded-full opacity-60"></div>

              <img
                src="/img1.jpeg"
                alt="Smart Farming"
                className="relative w-full h-56 md:h-80 rounded-2xl shadow-lg transform -rotate-1 object-cover z-10 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:-rotate-0 cursor-pointer"
              />

              <div className="absolute -bottom-8 md:-bottom-6 right-4 md:right-16 z-20">
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-br from-green-400 via-amber-400 to-blue-400 rounded-2xl blur-sm group-hover:blur-md transition-all duration-500"></div>

                  <div className="relative bg-white p-1.5 rounded-2xl shadow-2xl">
                    <img
                      src="/img2.jpeg"
                      alt="Farm Community"
                      className="w-64 h-44 rounded-xl object-cover transition-all duration-500 group-hover:scale-105 group-hover:rotate-1 cursor-pointer"
                    />
                  </div>

                  <div className="absolute -top-2 -left-2 bg-gradient-to-r from-green-500 to-green-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                    <i className="fas fa-leaf mr-1"></i>
                    Eco
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Stats */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
              <div key={index} className="">
                <div className="text-green-600 text-3xl mb-2">
                  <i className={`${stat.icon}`}></i>
                </div>
                <div className="text-2xl md:text-3xl font-bold text-gray-900">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
