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
  const [commentTexts, setCommentTexts] = useState({}); // Track comment text for each post
  const [showComments, setShowComments] = useState({}); // Track which posts show comments
  const [communityStats, setCommunityStats] = useState({
    activeFarmersToday: 0,
    postsToday: 0,
  });

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

  // 🔹 Fetch community stats
  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const getStats = async () => {
      try {
        const response = await axiosPrivate.get("/stats/community", {
          signal: controller.signal,
        });

        if (isMounted && response?.data) {
          setCommunityStats(response.data);
        }
      } catch (err) {
        console.error("Error fetching community stats:", err);
      }
    };

    getStats();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [axiosPrivate]);

  // 🔹 Add post
  const addPost = async () => {
    if (!title.trim()) {
      alert("Please enter some text for your post");
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

      // Refetch all posts to get updated list
      const updated = await axiosPrivate.get("/post/a/all");
      setPosts(updated.data);

      setTitle(""); // ✅ clear textarea
      alert("Post created successfully!");
    } catch (err) {
      console.error("Error adding post:", err);
      const errorMsg =
        err.response?.data?.message ||
        "Failed to create post. Please try again.";
      alert(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Delete post
  const deletePost = async (postId) => {
    if (!window.confirm("Are you sure you want to delete this post?")) {
      return;
    }

    try {
      await axiosPrivate.delete(`/post/${postId}`, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });

      // Remove post from state
      setPosts((prev) => prev.filter((post) => post._id !== postId));
      alert("Post deleted successfully");
    } catch (err) {
      console.error("Error deleting post:", err);
      alert(err.response?.data?.message || "Failed to delete post");
    }
  };

  // 🔹 Like/Unlike post
  const toggleLike = async (postId) => {
    try {
      const response = await axiosPrivate.post(
        `/post/${postId}/like`,
        {},
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      // Update the post in state
      setPosts((prev) =>
        prev.map((post) => {
          if (post._id === postId) {
            const userLiked = response.data.liked;
            const currentUserId = auth.userId; // Assuming auth has userId

            return {
              ...post,
              likes: userLiked
                ? [...(post.likes || []), currentUserId]
                : (post.likes || []).filter((id) => id !== currentUserId),
            };
          }
          return post;
        })
      );
    } catch (err) {
      console.error("Error toggling like:", err);
      alert("Failed to like/unlike post");
    }
  };

  // 🔹 Add comment
  const addComment = async (postId) => {
    const commentText = commentTexts[postId];

    if (!commentText || !commentText.trim()) {
      alert("Please enter a comment");
      return;
    }

    try {
      const response = await axiosPrivate.post(
        `/post/addcomment/${postId}`,
        { text: commentText },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      // Update the post's comments in state
      setPosts((prev) =>
        prev.map((post) => {
          if (post._id === postId) {
            return {
              ...post,
              comments: response.data.comments,
            };
          }
          return post;
        })
      );

      // Clear comment text
      setCommentTexts((prev) => ({ ...prev, [postId]: "" }));
    } catch (err) {
      console.error("Error adding comment:", err);
      alert("Failed to add comment");
    }
  };

  // 🔹 Toggle comments visibility
  const toggleComments = (postId) => {
    setShowComments((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
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
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-start gap-4">
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
                          {/* Delete button - only show for post owner */}
                          {auth?.user === post?.user?.username && (
                            <button
                              onClick={() => deletePost(post._id)}
                              className="text-red-500 hover:text-red-700 text-sm"
                            >
                              🗑️ Delete
                            </button>
                          )}
                        </div>
                        <p className="text-gray-700 mb-4">{post.title}</p>
                        <div className="h-px bg-gray-100 my-4"></div>

                        {/* Like and Comment buttons */}
                        <div className="flex items-center text-sm gap-6 mb-4">
                          <button
                            onClick={() => toggleLike(post._id)}
                            className="flex items-center gap-2 hover:text-red-500 transition-colors"
                          >
                            ❤️ {post.likes?.length || 0} Likes
                          </button>
                          <button
                            onClick={() => toggleComments(post._id)}
                            className="flex items-center gap-2 hover:text-blue-500 transition-colors"
                          >
                            💬 {post.comments?.length || 0} Comments
                          </button>
                        </div>

                        {/* Comments section */}
                        {showComments[post._id] && (
                          <div className="mt-4 border-t border-gray-200 pt-4">
                            {/* Existing comments */}
                            {post.comments && post.comments.length > 0 && (
                              <div className="space-y-3 mb-4">
                                {post.comments.map((comment, idx) => (
                                  <div
                                    key={comment._id || idx}
                                    className="bg-gray-50 rounded-lg p-3"
                                  >
                                    <div className="flex items-start gap-2">
                                      <div className="w-8 h-8 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-semibold text-xs">
                                        {comment?.user?.username?.[0]?.toUpperCase() ||
                                          "U"}
                                      </div>
                                      <div className="flex-1">
                                        <div className="font-semibold text-sm text-gray-900">
                                          {comment?.user?.username || "Unknown"}
                                        </div>
                                        <p className="text-gray-700 text-sm">
                                          {comment.text}
                                        </p>
                                        <p className="text-xs text-gray-500 mt-1">
                                          {comment.date
                                            ? new Date(
                                                comment.date
                                              ).toLocaleString()
                                            : "Recently"}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}

                            {/* Add comment input */}
                            <div className="flex gap-2">
                              <input
                                type="text"
                                placeholder="Write a comment..."
                                value={commentTexts[post._id] || ""}
                                onChange={(e) =>
                                  setCommentTexts((prev) => ({
                                    ...prev,
                                    [post._id]: e.target.value,
                                  }))
                                }
                                onKeyPress={(e) => {
                                  if (e.key === "Enter") {
                                    addComment(post._id);
                                  }
                                }}
                                className="flex-1 bg-white border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-green-500"
                              />
                              <button
                                onClick={() => addComment(post._id)}
                                className="bg-green-600 text-white px-4 py-2 rounded-md text-sm hover:bg-green-700"
                              >
                                Post
                              </button>
                            </div>
                          </div>
                        )}
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
                      {t("community.sidebar.communityStats")}
                    </h3>
                    <div className="text-gray-700 text-sm space-y-3">
                      <div className="flex justify-between items-center">
                        <span>{t("community.sidebar.activeFarmers")}</span>
                        <span className="font-semibold text-lg text-green-600">
                          {communityStats.activeFarmersToday}
                        </span>
                      </div>
                      <div className="h-px bg-gray-200"></div>
                      <div className="flex justify-between items-center">
                        <span>{t("community.sidebar.postsToday")}</span>
                        <span className="font-semibold text-lg text-blue-600">
                          {communityStats.postsToday}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                    <h3 className="text-gray-900 font-semibold mb-4">
                      {t("community.sidebar.nearbyFarmers")}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {t("community.sidebar.comingSoon")}
                    </p>
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
