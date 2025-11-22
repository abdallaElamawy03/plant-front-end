import { useNavigate, useLocation } from "react-router-dom";
import useLogout from "../hooks/useLogout";
import useAuth from "../hooks/useAuth";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import "./App.css";
import UpperNav from "./UpperNav";

const Dashboard = () => {
  const { t } = useTranslation();
  const [stats, setStats] = useState({
    soilAnalyses: { count: 0, change: "+0" },
    plantDiagnoses: { count: 0, change: "+0" },
    communityPosts: { count: 0, change: "+0" },
  });

  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();
  const { auth } = useAuth();
  const logout = useLogout();
  const axiosPrivate = useAxiosPrivate();

  // Fetch dashboard stats and recent activity
  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await axiosPrivate.get("/stats/dashboard", {
          signal: controller.signal,
        });

        if (isMounted && response?.data) {
          const { stats: apiStats, recentActivities } = response.data;

          setStats({
            soilAnalyses: {
              count: apiStats.soilAnalysisCount || 0,
              change: "+0",
            },
            plantDiagnoses: {
              count: apiStats.plantDiagnosisCount || 0,
              change: "+0",
            },
            communityPosts: {
              count: apiStats.communityPostsCount || 0,
              change: "+0",
            },
          });

          // Map activities to display format
          const mappedActivities = recentActivities.map((activity) => ({
            id: activity.id,
            type: activity.type,
            description: activity.description,
            time: formatTimeAgo(new Date(activity.timestamp)),
            color: getActivityColor(activity.type),
            link: activity.link,
          }));

          setRecentActivity(mappedActivities);
        }
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        if (err.name !== "AbortError" && err.name !== "CanceledError") {
          setError("Failed to load dashboard data");
          // Don't redirect on error, just show error state
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchDashboardData();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [axiosPrivate]);

  // Helper function to format time ago
  const formatTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - date) / 1000);

    const intervals = {
      year: 31536000,
      month: 2592000,
      week: 604800,
      day: 86400,
      hour: 3600,
      minute: 60,
    };

    for (const [unit, secondsInUnit] of Object.entries(intervals)) {
      const interval = Math.floor(seconds / secondsInUnit);
      if (interval >= 1) {
        return `${interval} ${unit}${interval > 1 ? "s" : ""} ago`;
      }
    }
    return "Just now";
  };

  // Helper function to get activity color
  const getActivityColor = (type) => {
    const colorMap = {
      soil_analysis: "blue",
      plant_diagnosis: "orange",
      community_post: "green",
      comment: "purple",
      like: "pink",
    };
    return colorMap[type] || "gray";
  };

  const handleNavigate = (path) => {
    navigate(path);
  };

  const signOut = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="bg-gray-50 min-h-screen text-gray-900">
      <UpperNav />

      <main className="p-6 px-6 sm:px-8 lg:px-10">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2 text-gray-900">
                {t("dashboard.welcomeBack")}, {auth?.user || "John"}{" "}
                {t("dashboard.farmer")}!
              </h1>
              <p className="text-gray-600">{t("dashboard.subtitle")}</p>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {/* Soil Analyses Card */}
            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-gray-600 text-sm mb-2">
                    {t("dashboard.stats.soilAnalyses")}
                  </p>
                  <p className="text-4xl font-bold text-gray-900">
                    {stats.soilAnalyses.count}
                  </p>
                </div>
              </div>
              <p className="text-green-600 text-sm mt-4 flex items-center gap-1">
                <span>↗</span>
                {stats.soilAnalyses.change} {t("dashboard.stats.thisMonth")}
              </p>
            </div>

            {/* Plant Diagnoses Card */}
            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-gray-600 text-sm mb-2">
                    {t("dashboard.stats.plantDiagnoses")}
                  </p>
                  <p className="text-4xl font-bold text-gray-900">
                    {stats.plantDiagnoses.count}
                  </p>
                </div>
              </div>
              <p className="text-green-600 text-sm mt-4 flex items-center gap-1">
                <span>↗</span>
                {stats.plantDiagnoses.change} {t("dashboard.stats.thisMonth")}
              </p>
            </div>

            {/* Community Posts Card */}
            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-gray-600 text-sm mb-2">
                    {t("dashboard.stats.communityPosts")}
                  </p>
                  <p className="text-4xl font-bold text-gray-900">
                    {stats.communityPosts.count}
                  </p>
                </div>
              </div>
              <p className="text-green-600 text-sm mt-4 flex items-center gap-1">
                <span>↗</span>
                {stats.communityPosts.change} {t("dashboard.stats.thisMonth")}
              </p>
            </div>
          </div>

          {/* Quick Actions and Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Quick Actions - Takes 2 columns */}
            <div className="lg:col-span-2">
              <h2 className="text-xl font-bold mb-4 text-gray-900">
                {t("dashboard.quickActions.title")}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Soil Analysis Card */}
                <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:border-blue-500 transition-colors cursor-pointer">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-2xl">🧪</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-1 text-gray-900">
                        {t("dashboard.quickActions.soilAnalysis.title")}
                      </h3>
                      <p className="text-gray-600 text-sm mb-3">
                        {t("dashboard.quickActions.soilAnalysis.description")}
                      </p>
                      <button
                        onClick={() => handleNavigate("/soil")}
                        className="text-green-600 text-sm font-medium hover:text-green-700 flex items-center gap-1"
                      >
                        {t("landing.hero.getStarted")} <span>→</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Disease Diagnosis Card */}
                <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:border-green-500 transition-colors cursor-pointer">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-2xl">🌿</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-1 text-gray-900">
                        {t("dashboard.quickActions.plantDiagnosis.title")}
                      </h3>
                      <p className="text-gray-600 text-sm mb-3">
                        {t("dashboard.quickActions.plantDiagnosis.description")}
                      </p>
                      <button
                        onClick={() => handleNavigate("/diagnosis")}
                        className="text-green-600 text-sm font-medium hover:text-green-700 flex items-center gap-1"
                      >
                        {t("landing.hero.getStarted")} <span>→</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Community Card */}
                <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:border-orange-500 transition-colors cursor-pointer md:col-span-2">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-2xl">👥</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-1 text-gray-900">
                        {t("dashboard.quickActions.community.title")}
                      </h3>
                      <p className="text-gray-600 text-sm mb-3">
                        {t("dashboard.quickActions.community.description")}
                      </p>
                      <button
                        onClick={() => handleNavigate("/community")}
                        className="text-green-600 text-sm font-medium hover:text-green-700 flex items-center gap-1"
                      >
                        {t("landing.hero.getStarted")} <span>→</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity - Takes 1 column */}
            <div>
              <h2 className="text-xl font-bold mb-4 text-gray-900">
                {t("dashboard.recentActivity.title")}
              </h2>
              <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm flex-1">
                {loading ? (
                  <div className="text-center text-gray-500 py-8">
                    Loading...
                  </div>
                ) : error ? (
                  <div className="text-center text-red-500 py-8">{error}</div>
                ) : recentActivity.length === 0 ? (
                  <div className="text-center text-gray-500 py-8">
                    No recent activity
                  </div>
                ) : (
                  <div className="space-y-6">
                    {recentActivity.map((activity) => (
                      <div key={activity.id} className="flex items-start gap-3">
                        <div
                          className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                            activity.color === "blue"
                              ? "bg-blue-500"
                              : activity.color === "green"
                              ? "bg-green-500"
                              : activity.color === "orange"
                              ? "bg-orange-500"
                              : activity.color === "purple"
                              ? "bg-purple-500"
                              : activity.color === "pink"
                              ? "bg-pink-500"
                              : "bg-gray-500"
                          }`}
                        />
                        <div className="flex-1">
                          <p className="text-gray-900 text-sm font-medium">
                            {activity.description}
                          </p>
                          <p className="text-gray-600 text-xs mt-1">
                            {activity.time}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
