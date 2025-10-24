import { useRef, useState, useEffect } from "react";
import useAuth from "../hooks/useAuth";
import { Link, useNavigate, useLocation } from "react-router-dom";
import useInput from "../hooks/useInput";

import axios from "../api/axios";

const LOGIN_URL = "/auth";

const Login = () => {
  const { setAuth, persist, setPersist } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/home";

  const userRef = useRef();

  const [user, resetUser, userAttribs] = useInput("user", "");
  const [pwd, setPwd] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [username, setUsername] = useState(""); // State to hold the username

  useEffect(() => {
    setErrMsg("");
  }, [user, pwd]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        LOGIN_URL,
        JSON.stringify({ username: user, password: pwd }),
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      console.log(response.data);
      const accessToken = response?.data?.accessToken;
      const roles = response?.data?.roles;

      // Set authentication state
      setAuth({ user, roles, accessToken });
      setUsername(user); // Set the username in state
      console.log("Username set:", user);
      resetUser();
      setPwd("");
      navigate(from, { replace: true });
    } catch (err) {
      if (!err?.response) {
        setErrMsg("No Server Response");
      } else if (err.response?.status === 400) {
        setErrMsg("Missing Username or Password");
      } else if (err.response?.status === 401) {
        setErrMsg("Unauthorized");
      } else {
        setErrMsg("Login Failed");
      }
    }
  };
  const togglePersist = () => {
    setPersist((prev) => !prev);
  };

  useEffect(() => {
    localStorage.setItem("persist", persist);
  }, [persist]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex items-center justify-center py-16 relative">
      {/* Fixed Landing button in the top-right corner */}
      <Link
        to="/"
        className="fixed top-6 right-6 z-50 text-green-400 hover:text-white border border-green-600 px-3 py-1 rounded-md bg-transparent hover:bg-green-600 transition"
        aria-label="Go to landing"
      >
        Landing
      </Link>
      <div className="w-full max-w-xl px-6">
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-green-600 rounded-md flex items-center justify-center text-white text-lg">
              <i className="fas fa-seedling"></i>
            </div>
            <span className="text-lg md:text-xl font-semibold text-white">
              SmartAgri
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">
            Sign in to your account
          </h1>
          <p className="text-sm text-gray-400 mt-2">
            Welcome back to the future of farming
          </p>
        </div>

        <div className="mx-auto max-w-md">
          <div className="bg-gray-800/60 border border-gray-700 rounded-xl p-8 shadow-lg">
            <h4 className="text-red-600 font-bold mb-3">{errMsg}</h4>
            <form onSubmit={handleSubmit}>
              <label className="block text-sm text-gray-300 mb-2">
                Email Address
              </label>
              <input
                type="text"
                id="username"
                ref={userRef}
                autoComplete="off"
                {...userAttribs}
                placeholder="Enter your email"
                className="w-full mb-4 bg-gray-900 border border-gray-700 text-gray-200 placeholder-gray-400 rounded px-3 py-2 focus:outline-none focus:border-green-500"
              />

              <label className="block text-sm text-gray-300 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="Enter your password"
                onChange={(e) => setPwd(e.target.value)}
                value={pwd}
                className="w-full mb-6 bg-gray-900 border border-gray-700 text-gray-200 placeholder-gray-400 rounded px-3 py-2 focus:outline-none focus:border-green-500"
              />

              <button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 rounded-md mb-4 transition"
              >
                Sign In
              </button>

              <div className="flex items-center justify-between mb-2">
                <label className="flex items-center text-sm text-gray-300">
                  <input
                    type="checkbox"
                    id="persist"
                    onChange={togglePersist}
                    checked={persist}
                    className="h-4 w-4 text-green-500 rounded border-gray-600 bg-gray-900"
                  />
                  <span className="ml-2">Remember me</span>
                </label>
                <a href="#" className="text-sm text-gray-400 hover:text-white">
                  Forgot password ?
                </a>
              </div>
            </form>

            <p className="text-center text-sm text-gray-400 mt-4">
              Don't have an account?{" "}
              <Link to={"/register"} className="text-green-400 font-medium">
                Sign up here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
