import { useNavigate } from "react-router-dom";
import useLogout from "../hooks/useLogout";
import useAuth from "../hooks/useAuth";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import "./App.css";
import UpperNav from "./UpperNav";

const Dashboard = () => {
  const { t } = useTranslation();
  const [stats, setStats] = useState({
    soilAnalyses: { count: 12, change: "+2" },
    plantDiagnoses: { count: 8, change: "+1" },
    communityPosts: { count: 23, change: "+5" },
    cropsMonitored: { count: 6, change: "+1" },
  });

  const [recentActivity, setRecentActivity] = useState([
    {
      id: 1,
      type: "soil",
      titleKey: "dashboard.recentActivity.soilCompleted",
      time: "2 hours ago",
      color: "blue",
    },
    {
      id: 2,
      type: "community",
      titleKey: "dashboard.recentActivity.communityPost",
      time: "1 day ago",
      color: "green",
    },
    {
      id: 3,
      type: "disease",
      titleKey: "dashboard.recentActivity.diseaseDiagnosed",
      time: "2 days ago",
      color: "orange",
    },
    {
      id: 4,
      type: "crop",
      titleKey: "dashboard.recentActivity.cropRecommendation",
      time: "3 days ago",
      color: "purple",
    },
  ]);

  const navigate = useNavigate();
  const { auth } = useAuth();
  const logout = useLogout();

  // TODO: Fetch dashboard stats
  useEffect(() => {
    // Placeholder for fetching dashboard statistics
    // const fetchDashboardStats = async () => {
    //   try {
    //     const response = await axiosPrivate.get("/dashboard/stats");
    //     setStats(response.data);
    //   } catch (err) {
    //     console.error("Error fetching stats:", err);
    //   }
    // };
    // fetchDashboardStats();
  }, []);

  // TODO: Fetch recent activity
  useEffect(() => {
    // Placeholder for fetching recent activity
    // const fetchRecentActivity = async () => {
    //   try {
    //     const response = await axiosPrivate.get("/dashboard/activity");
    //     setRecentActivity(response.data);
    //   } catch (err) {
    //     console.error("Error fetching activity:", err);
    //   }
    // };
    // fetchRecentActivity();
  }, []);

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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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

            {/* Crops Monitored Card */}
            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-gray-600 text-sm mb-2">
                    {t("dashboard.stats.cropsMonitored")}
                  </p>
                  <p className="text-4xl font-bold text-gray-900">
                    {stats.cropsMonitored.count}
                  </p>
                </div>
              </div>
              <p className="text-green-600 text-sm mt-4 flex items-center gap-1">
                <span>↗</span>
                {stats.cropsMonitored.change} {t("dashboard.stats.thisMonth")}
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
                            : "bg-purple-500"
                        }`}
                      />
                      <div className="flex-1">
                        <p className="text-gray-900 text-sm font-medium">
                          {t(activity.titleKey)}
                        </p>
                        <p className="text-gray-600 text-xs mt-1">
                          {activity.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
