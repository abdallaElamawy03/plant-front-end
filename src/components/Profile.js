import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import useLogout from "../hooks/useLogout";
import useAuth from "../hooks/useAuth";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { useState, useEffect } from "react";
import "./App.css";
import UpperNav from "./UpperNav";

const Profile = () => {
  const { t } = useTranslation();
  const [userProfile, setUserProfile] = useState({
    name: "",
    location: "",
    memberSince: "",
    city: "",
    country: "",
    phonenumber: "",
  });

  const [stats, setStats] = useState({
    soilAnalyses: 0,
    diagnoses: 0,
    communityPosts: 0,
  });

  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();
  const { auth } = useAuth();
  const logout = useLogout();
  const axiosPrivate = useAxiosPrivate();

  // Fetch user profile data
  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await axiosPrivate.get("/users/profile", {
          signal: controller.signal,
        });

        if (isMounted && response?.data) {
          const {
            profile,
            stats: apiStats,
            recentActivity: apiActivity,
          } = response.data;

          setUserProfile({
            name: profile.name || "",
            location: profile.location || `${profile.city}, ${profile.country}`,
            memberSince: profile.memberSince || "",
            city: profile.city || "",
            country: profile.country || "",
            phonenumber: profile.phonenumber || "",
          });

          setStats({
            soilAnalyses: apiStats.soilAnalyses || 0,
            diagnoses: apiStats.diagnoses || 0,
            communityPosts: apiStats.communityPosts || 0,
          });

          // Map activities to display format
          const mappedActivities = apiActivity.map((activity) => ({
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
        console.error("Error fetching profile:", err);
        if (err.name !== "AbortError" && err.name !== "CanceledError") {
          setError("Failed to load profile data");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchUserProfile();

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

  const signOut = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="bg-gray-50 min-h-screen text-gray-900">
      <UpperNav />

      <main className="p-6 px-6 sm:px-8 lg:px-10">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="text-center py-20">
              <div className="text-gray-500 text-lg">Loading profile...</div>
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <div className="text-red-500 text-lg">{error}</div>
            </div>
          ) : (
            <>
              {/* Profile Header Card */}
              <div className="bg-white rounded-xl p-8 mb-6 border border-gray-200 shadow-sm">
                <div className="flex items-start gap-6">
                  {/* Avatar */}
                  <div className="w-24 h-24 bg-green-600 rounded-full flex items-center justify-center text-white text-3xl font-bold flex-shrink-0">
                    {userProfile.name ? userProfile.name[0].toUpperCase() : "U"}
                  </div>

                  {/* Profile Info */}
                  <div className="flex-1">
                    <h1 className="text-3xl font-bold mb-3 text-gray-900">
                      {userProfile.name || "Unknown User"}
                    </h1>
                    <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-4">
                      <div className="flex items-center gap-2">
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                        <span>
                          {userProfile.location || "Unknown location"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        <span>
                          Member since{" "}
                          {userProfile.memberSince
                            ? new Date(
                                userProfile.memberSince
                              ).toLocaleDateString()
                            : "Unknown"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                {/* Soil Analyses */}
                <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm text-center">
                  <div className="w-12 h-12 mx-auto mb-4 text-green-600">
                    <svg
                      className="w-full h-full"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                      />
                    </svg>
                  </div>
                  <div className="text-3xl font-bold mb-2 text-gray-900">
                    {stats.soilAnalyses}
                  </div>
                  <div className="text-sm text-gray-600">Soil Analyses</div>
                </div>

                {/* Diagnoses */}
                <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm text-center">
                  <div className="w-12 h-12 mx-auto mb-4 text-green-600">
                    <svg
                      className="w-full h-full"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                      />
                    </svg>
                  </div>
                  <div className="text-3xl font-bold mb-2 text-gray-900">
                    {stats.diagnoses}
                  </div>
                  <div className="text-sm text-gray-600">Diagnoses</div>
                </div>

                {/* Community Posts */}
                <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm text-center">
                  <div className="w-12 h-12 mx-auto mb-4 text-green-600">
                    <svg
                      className="w-full h-full"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                  </div>
                  <div className="text-3xl font-bold mb-2 text-gray-900">
                    {stats.communityPosts}
                  </div>
                  <div className="text-sm text-gray-600">Community Posts</div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                <h2 className="text-xl font-bold mb-6 text-gray-900">
                  Recent Activity
                </h2>
                {recentActivity.length === 0 ? (
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
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default Profile;
