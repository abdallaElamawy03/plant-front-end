import { useNavigate } from "react-router-dom";
import useLogout from "../hooks/useLogout";
import useAuth from "../hooks/useAuth";
import { useState, useEffect } from "react";
import "./App.css";
import UpperNav from "./UpperNav";

const Profile = () => {
  const [userProfile, setUserProfile] = useState({
    name: "John Farmer",
    location: "Green Valley",
    memberSince: "2023",
    bio: "Passionate about sustainable farming practices and connecting with the agricultural community. Specializing in organic crop rotation and precision agriculture techniques.",
    initials: "JF",
  });

  const [stats, setStats] = useState({
    soilAnalyses: 12,
    diagnoses: 8,
    communityPosts: 23,
    yearsFarming: 5,
  });

  const [currentCrops, setCurrentCrops] = useState([
    { id: 1, name: "Corn", status: "Active" },
    { id: 2, name: "Wheat", status: "Active" },
    { id: 3, name: "Soybeans", status: "Active" },
  ]);

  const [recentActivity, setRecentActivity] = useState([
    {
      id: 1,
      type: "soil",
      title: "Completed soil analysis",
      time: "2 hours ago",
      color: "blue",
    },
    {
      id: 2,
      type: "community",
      title: "Posted in community",
      time: "1 day ago",
      color: "green",
    },
    {
      id: 3,
      type: "disease",
      title: "Diagnosed plant disease",
      time: "2 days ago",
      color: "orange",
    },
    {
      id: 4,
      type: "tips",
      title: "Shared farming tips",
      time: "3 days ago",
      color: "purple",
    },
  ]);

  const navigate = useNavigate();
  const { auth } = useAuth();
  const logout = useLogout();

  // TODO: Fetch user profile data
  useEffect(() => {
    // const fetchUserProfile = async () => {
    //   try {
    //     const response = await axiosPrivate.get("/user/profile");
    //     setUserProfile(response.data);
    //   } catch (err) {
    //     console.error("Error fetching profile:", err);
    //   }
    // };
    // fetchUserProfile();
  }, []);

  // TODO: Fetch user statistics
  useEffect(() => {
    // const fetchUserStats = async () => {
    //   try {
    //     const response = await axiosPrivate.get("/user/stats");
    //     setStats(response.data);
    //   } catch (err) {
    //     console.error("Error fetching stats:", err);
    //   }
    // };
    // fetchUserStats();
  }, []);

  // TODO: Fetch current crops
  useEffect(() => {
    // const fetchCurrentCrops = async () => {
    //   try {
    //     const response = await axiosPrivate.get("/user/crops");
    //     setCurrentCrops(response.data);
    //   } catch (err) {
    //     console.error("Error fetching crops:", err);
    //   }
    // };
    // fetchCurrentCrops();
  }, []);

  // TODO: Fetch recent activity
  useEffect(() => {
    // const fetchRecentActivity = async () => {
    //   try {
    //     const response = await axiosPrivate.get("/user/activity");
    //     setRecentActivity(response.data);
    //   } catch (err) {
    //     console.error("Error fetching activity:", err);
    //   }
    // };
    // fetchRecentActivity();
  }, []);

  const signOut = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="bg-gray-50 min-h-screen text-gray-900">
      <UpperNav />

      <main className="p-6 px-6 sm:px-8 lg:px-10">
        <div className="max-w-7xl mx-auto">
          {/* Profile Header Card */}
          <div className="bg-white rounded-xl p-8 mb-6 border border-gray-200 shadow-sm">
            <div className="flex items-start gap-6">
              {/* Avatar */}
              <div className="w-24 h-24 bg-green-600 rounded-full flex items-center justify-center text-white text-3xl font-bold flex-shrink-0">
                {userProfile.initials}
              </div>

              {/* Profile Info */}
              <div className="flex-1">
                <h1 className="text-3xl font-bold mb-3 text-gray-900">
                  {userProfile.name}
                </h1>
                <div className="flex items-center gap-4 text-gray-600 mb-4">
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
                    <span>{userProfile.location}</span>
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
                    <span>Member since {userProfile.memberSince}</span>
                  </div>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  {userProfile.bio}
                </p>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
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

            {/* Years Farming */}
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
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <div className="text-3xl font-bold mb-2 text-gray-900">
                {stats.yearsFarming}
              </div>
              <div className="text-sm text-gray-600">Years Farming</div>
            </div>
          </div>

          {/* Current Crops and Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Current Crops */}
            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
              <h2 className="text-xl font-bold mb-6 text-gray-900">
                Current Crops
              </h2>
              <div className="space-y-4">
                {currentCrops.map((crop) => (
                  <div
                    key={crop.id}
                    className="bg-gray-50 rounded-lg p-4 flex items-center justify-between hover:bg-gray-100 transition-colors border border-gray-200"
                  >
                    <span className="text-gray-900 font-medium">
                      {crop.name}
                    </span>
                    <span className="bg-green-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                      {crop.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
              <h2 className="text-xl font-bold mb-6 text-gray-900">
                Recent Activity
              </h2>
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
                        {activity.title}
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
      </main>
    </div>
  );
};

export default Profile;
