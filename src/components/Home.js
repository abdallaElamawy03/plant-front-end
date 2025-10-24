import { useNavigate, Link, useLocation } from "react-router-dom";
import useLogout from "../hooks/useLogout";
import useAuth from "../hooks/useAuth";
import { useState, useEffect } from "react";
import "./App.css";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import UpperNav from "./UpperNav";

const Home = () => {
  const [users, setUsers] = useState();
  const [tasks, setTasks] = useState();
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const location = useLocation();
  const { auth } = useAuth();
  const logout = useLogout();

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const getUsers = async () => {
      try {
        const response = await axiosPrivate.post(
          "/company/users", // Changed endpoint to match your API
          JSON.stringify({ username: auth.user }), // No need for JSON.stringify - axios does this automatically
          {
            headers: {
              "Content-Type": "application/json",
              // Add authorization header if needed
              // 'Authorization': `Bearer ${yourToken}`
            },
            withCredentials: true,
            signal: controller.signal, // Added abort signal
          }
        );

        if (!response.data?.users) {
          throw new Error("No users data received");
        }

        console.log(response.data);
        isMounted && setUsers(response.data.users); // Changed to response.data.users
      } catch (err) {
        console.error("Fetch error:", err);

        // Different handling for cancellation vs other errors
        if (err.name !== "AbortError" && err.name !== "CanceledError") {
          navigate("/home", {
            state: { from: location },
            replace: true,
          });
        }
      }
    };

    if (
      auth.roles == "hr" ||
      auth.roles == "manager" ||
      auth.roles == "company"
    ) {
      getUsers();
    }

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [auth]);

  const signOut = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <>
      <body className="bg-gray-900 min-h-screen flex">
        <div className="flex-1">
          <UpperNav />

          <main className="p-6 px-6 sm:px-8 lg:px-10">
            <div className="max-w-7xl mx-auto">
              {/* Post composer */}
              <div className="bg-gray-800/60 border border-gray-700 rounded-xl p-6 mb-6">
                <textarea
                  rows={3}
                  placeholder="Share your farming experience, ask questions, or post updates..."
                  className="w-full bg-transparent border border-gray-700 rounded-md px-4 py-3 text-gray-200 placeholder-gray-500 focus:outline-none"
                />
                <div className="flex items-center justify-between mt-4">
                  <div className="text-sm text-gray-400 space-x-4">
                    <button className="text-gray-400 hover:text-white">
                      📷 Photo
                    </button>
                    <button className="text-gray-400 hover:text-white">
                      🎥 Video
                    </button>
                  </div>
                  <button className="bg-green-600 px-4 py-2 rounded-md text-white">
                    Post
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main feed */}
                <div className="lg:col-span-2 space-y-6">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="bg-gray-800/60 border border-gray-700 rounded-xl p-6"
                    >
                      <div className="flex items-start gap-4 mb-4">
                        <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center text-white">
                          SF
                        </div>
                        <div>
                          <div className="font-semibold text-white">
                            Sarah Johnson
                          </div>
                          <div className="text-sm text-gray-400">
                            Green Valley • 2 hours ago
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-300 mb-4">
                        Just harvested my first batch of organic tomatoes using
                        the companion planting method! The results are amazing!
                        🍅
                      </p>
                      <div className="h-px bg-gray-700 my-4"></div>
                      <div className="flex items-center text-sm text-gray-400 gap-6">
                        <div>❤️ 24</div>
                        <div>💬 8</div>
                        <div>🔗 3</div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Sidebar */}
                <aside className="space-y-6">
                  <div className="bg-gray-800/60 border border-gray-700 rounded-xl p-6">
                    <h3 className="text-white font-semibold mb-4">
                      Nearby Farmers
                    </h3>
                    <ul className="space-y-4 text-gray-300 text-sm">
                      <li>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-green-700 rounded-full flex items-center justify-center text-white">
                            J
                          </div>
                          <div>
                            <div className="font-medium text-white">
                              John Peterson
                            </div>
                            <div className="text-xs text-gray-400">
                              2.3 km • Corn, Soybeans
                            </div>
                          </div>
                        </div>
                      </li>
                      <li>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-green-700 rounded-full flex items-center justify-center text-white">
                            L
                          </div>
                          <div>
                            <div className="font-medium text-white">
                              Lisa Wang
                            </div>
                            <div className="text-xs text-gray-400">
                              3.1 km • Vegetables, Herbs
                            </div>
                          </div>
                        </div>
                      </li>
                      <li>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-green-700 rounded-full flex items-center justify-center text-white">
                            R
                          </div>
                          <div>
                            <div className="font-medium text-white">
                              Robert Kim
                            </div>
                            <div className="text-xs text-gray-400">
                              4.7 km • Wheat, Barley
                            </div>
                          </div>
                        </div>
                      </li>
                      <li>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-green-700 rounded-full flex items-center justify-center text-white">
                            M
                          </div>
                          <div>
                            <div className="font-medium text-white">
                              Maria Gonzalez
                            </div>
                            <div className="text-xs text-gray-400">
                              5.2 km • Fruits, Nuts
                            </div>
                          </div>
                        </div>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-gray-800/60 border border-gray-700 rounded-xl p-6">
                    <h3 className="text-white font-semibold mb-4">
                      Community Stats
                    </h3>
                    <div className="text-gray-300 text-sm space-y-3">
                      <div className="flex justify-between">
                        <span>Active Farmers</span>
                        <span className="font-semibold">1,247</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Posts Today</span>
                        <span className="font-semibold">89</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Questions Solved</span>
                        <span className="font-semibold">342</span>
                      </div>
                    </div>
                  </div>
                </aside>
              </div>
            </div>
          </main>
        </div>
      </body>
    </>
  );
};
export default Home;
