import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import useLogout from "../hooks/useLogout";
import useAuth from "../hooks/useAuth";
import { useState, useEffect } from "react";
import "./App.css";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import UpperNav from "./UpperNav";

const Community = () => {
  const { t } = useTranslation();
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState(""); // ✅ track input
  const [loading, setLoading] = useState(false);

  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const location = useLocation();
  const { auth } = useAuth();
  const logout = useLogout();

  // 🔹 Fetch all posts
  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const getPosts = async () => {
      try {
        setLoading(true);
        const response = await axiosPrivate.get("/post/a/all", {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
          signal: controller.signal,
        });

        if (!response?.data) throw new Error("No data received");

        console.log("Fetched posts:", response.data);
        if (isMounted) setPosts(response.data);
      } catch (err) {
        console.error("Fetch error:", err);
        if (err.name !== "AbortError" && err.name !== "CanceledError") {
          navigate("/login", { state: { from: location }, replace: true });
        }
      } finally {
        setLoading(false);
      }
    };

    getPosts();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [auth, axiosPrivate, navigate, location]);

  // 🔹 Add post
  const addPost = async () => {
    if (!title.trim()) {
      alert(t("community.errors.postRequired"));
      return;
    }

    try {
      setLoading(true);
      const response = await axiosPrivate.post(
        "/post/addpost",
        { title }, // ✅ send title in body
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      console.log("New post added:", response.data);

      // Option 1: refetch all posts
      const updated = await axiosPrivate.get("/post/a/all");
      setPosts(updated.data);

      // Option 2 (faster): push new post directly
      // setPosts((prev) => [response.data, ...prev]);

      setTitle(""); // ✅ clear textarea
    } catch (err) {
      console.error("Error adding post:", err);
      alert(t("community.errors.postFailed"));
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <>
      <div className="bg-gray-50 min-h-screen flex text-gray-900">
        <div className="flex-1">
          <UpperNav />

          <main className="p-6 px-6 sm:px-8 lg:px-10">
            <div className="max-w-7xl mx-auto">
              {/* 🔹 Post composer */}
              <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6 shadow-sm">
                <textarea
                  rows={3}
                  placeholder={t("community.postComposer.placeholder")}
                  className="w-full bg-white border border-gray-200 rounded-md px-4 py-3 text-gray-900 placeholder-gray-500 focus:outline-none"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
                <div className="flex items-center justify-between mt-4">
                  <div className="text-sm text-gray-600 space-x-4">
                    <button className="text-gray-600 hover:text-gray-800">
                      {t("community.postComposer.photo")}
                    </button>
                    <button className="text-gray-600 hover:text-gray-800">
                      {t("community.postComposer.video")}
                    </button>
                  </div>
                  <button
                    onClick={addPost}
                    disabled={loading}
                    className={`${
                      loading ? "bg-green-400" : "bg-green-600"
                    } px-4 py-2 rounded-md text-white`}
                  >
                    {loading
                      ? t("community.postComposer.posting")
                      : t("community.postComposer.post")}
                  </button>
                </div>
              </div>

              {/* 🔹 Posts feed */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                  {loading && posts.length === 0 ? (
                    <div className="text-gray-500 text-center py-10">
                      {t("community.posts.loading")}
                    </div>
                  ) : posts.length > 0 ? (
                    posts.map((post, i) => (
                      <div
                        key={post._id || i}
                        className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm"
                      >
                        <div className="flex items-start gap-4 mb-4">
                          <div className="w-10 h-10 bg-green-100 text-green-700 rounded-full flex items-center justify-center font-semibold">
                            {post?.user?.username?.[0]?.toUpperCase() || "U"}
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900">
                              {post?.user?.username || "Unknown"}
                            </div>
                            <div className="text-sm text-gray-500">
                              {post?.user?.city || "Unknown country"} •{" "}
                              {post?.post_date
                                ? new Date(post.post_date).toLocaleString()
                                : "Recently"}
                            </div>
                          </div>
                        </div>
                        <p className="text-gray-700 mb-4">{post.title}</p>
                        <div className="h-px bg-gray-100 my-4"></div>
                        <div className="flex items-center text-sm text-gray-600 gap-6">
                          <div>❤️ {post.likes?.length || 0}</div>
                          <div>💬 {post.comments?.length || 0}</div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-gray-500 text-center py-10">
                      {t("community.posts.noPosts")}
                    </div>
                  )}
                </div>

                {/* Sidebar */}
                <aside className="space-y-6">
                  <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                    <h3 className="text-gray-900 font-semibold mb-4">
                      {t("community.sidebar.nearbyFarmers")}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {t("community.sidebar.comingSoon")}
                    </p>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                    <h3 className="text-gray-900 font-semibold mb-4">
                      {t("community.sidebar.communityStats")}
                    </h3>
                    <div className="text-gray-700 text-sm space-y-3">
                      <div className="flex justify-between">
                        <span>{t("community.sidebar.activeFarmers")}</span>
                        <span className="font-semibold">1,247</span>
                      </div>
                      <div className="flex justify-between">
                        <span>{t("community.sidebar.postsToday")}</span>
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
      </div>
    </>
  );
};

export default Community;
