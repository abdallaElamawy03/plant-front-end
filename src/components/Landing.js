import React from "react";
import "./App.css";
import { Link } from "react-router-dom";
import useTheme from "../hooks/useTheme";

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

  const stats = [
    { value: "10K+", label: "Farmers Connected", icon: "fas fa-users" },
    { value: "95%", label: "Accuracy Rate", icon: "fas fa-chart-line" },
    { value: "50+", label: "Crop Varieties", icon: "fas fa-seedling" },
    { value: "24/7", label: "Expert Support", icon: "fas fa-shield-alt" },
  ];

  // testimonials removed to match provided landing design (keeps functionality unchanged)
  const { theme, toggleTheme } = useTheme();

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
                <span className="text-lg font-bold">SmartAgri</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-md bg-gray-100 text-gray-600 hover:bg-gray-200 hidden sm:inline-flex"
                aria-label="toggle-theme"
                title={theme === "dark" ? "Switch to light" : "Switch to dark"}
              >
                <i
                  className={theme === "dark" ? "fas fa-sun" : "fas fa-moon"}
                ></i>
              </button>
              <Link
                to="/login"
                className="px-4 py-2 rounded-md bg-transparent border border-gray-200 text-gray-700 hover:bg-gray-50"
              >
                Sign In
              </Link>

              <Link
                to="/register"
                className="px-4 py-2 rounded-md bg-green-600 text-white hover:bg-green-700"
              >
                Sign Up
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
                SmartAgri –{" "}
                <span className="text-green-600">Smart Farming</span>
                for a Smarter Future
              </h1>
              <p className="text-lg text-gray-600 max-w-2xl">
                Empowering farmers with AI-driven insights for soil health,
                plant care, and community collaboration. Join the agricultural
                revolution today.
              </p>

              <div className="flex flex-wrap gap-4 pt-4">
                <Link to="/register">
                  <button className="bg-green-600 text-white px-6 py-3 rounded-md text-lg font-medium hover:bg-green-700 flex items-center gap-2">
                    Get Started
                    <i className="fas fa-arrow-right"></i>
                  </button>
                </Link>
                <Link to="/login">
                  <button className="px-6 py-3 rounded-md border border-gray-200 text-gray-700 hover:bg-gray-50">
                    Sign In
                  </button>
                </Link>
              </div>
            </div>

            <div className="relative">
              {/* large background card (behind) */}
              <div className="w-full h-56 md:h-80 bg-gray-100 rounded-2xl shadow-md transform md:translate-x-8 lg:translate-x-12 rotate-0 z-0"></div>

              {/* white card - fill the main large card area */}
              <div className="absolute inset-4 md:inset-6 bg-white rounded-2xl shadow-lg transform z-10 p-6 md:p-8 text-gray-900 flex items-start">
                <img
                  src="/img/banner.png"
                  alt="Smart Farming"
                  className="w-12 h-12 rounded mr-4 object-cover"
                />
                <div className="font-medium text-lg">Smart Farming</div>
              </div>

              {/* orange card - kept in front and positioned to overlap like the design */}
              <div className="absolute -bottom-8 md:-bottom-6 left-4 md:left-16 w-52 h-36 bg-amber-400 rounded-2xl shadow-lg transform -rotate-3 z-20 flex items-start p-4">
                <img
                  src="/img/banner.png"
                  alt="Farm Community"
                  className="w-10 h-10 rounded mr-3 object-cover"
                />
                <div className="text-black font-medium">Farm Community</div>
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

      {/* Features section removed to match provided landing design */}

      {/* Footer removed to match provided landing design */}
    </div>
  );
};

export default Landing;
