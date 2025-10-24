import { useRef, useState, useEffect } from "react";
import {
  faCheck,
  faTimes,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "../api/axios";
import { Link, useNavigate } from "react-router-dom";

const Company_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
const REGISTER_URL = "/company";

const Register = () => {
  const userRef = useRef();
  const errRef = useRef();
  const navigate = useNavigate();
  const [email, set_email] = useState("");
  const [c_Name, set_Cname] = useState("");
  const [validName, setValidName] = useState(false);
  const [userFocus, setUserFocus] = useState(false);

  const [pwd, setPwd] = useState("");
  const [validPwd, setValidPwd] = useState(false);
  const [pwdFocus, setPwdFocus] = useState(false);

  const [matchPwd, setMatchPwd] = useState("");
  const [validMatch, setValidMatch] = useState(false);
  const [matchFocus, setMatchFocus] = useState(false);

  const [errMsg, setErrMsg] = useState("");
  const [success, setSuccess] = useState(false);

  // useEffect(() => {
  //     userRef.current.focus();
  // }, [])

  useEffect(() => {
    setValidName(Company_REGEX.test(c_Name));
  }, [c_Name]);

  useEffect(() => {
    setValidPwd(PWD_REGEX.test(pwd));
    setValidMatch(pwd === matchPwd);
  }, [pwd, matchPwd]);

  useEffect(() => {
    setErrMsg("");
  }, [c_Name, pwd, matchPwd]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // if button enabled with JS hack
    const v1 = Company_REGEX.test(c_Name);
    const v2 = PWD_REGEX.test(pwd);
    // if (!v1 || !v2) {
    //     setErrMsg("Enter more powerful password");
    //     return;
    // }
    try {
      // c_Name,password,email
      const response = await axios.post(
        REGISTER_URL,
        JSON.stringify({ c_Name: c_Name, email: email, password: pwd }),
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      navigate("/home");

      // TODO: remove console.logs before deployment
      console.log(JSON.stringify(response?.data));
      //console.log(JSON.stringify(response))
      setSuccess(true);
      //clear state and controlled inputs
      set_Cname("");
      setPwd("");
      setMatchPwd("");
    } catch (err) {
      if (!err?.response) {
        setErrMsg("No Server Response");
      } else if (err.response?.status === 409) {
        setErrMsg("Username Taken");
      } else {
        setErrMsg("Registration Failed");
      }
      // errRef.current.focus();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-16 relative">
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
            <span className="text-lg md:text-xl font-semibold text-gray-900">
              SmartAgri
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Create your account
          </h1>
          <p className="text-sm text-gray-600 mt-2">
            Join the future of smart farming
          </p>
        </div>

        <div className="mx-auto max-w-md">
          <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-lg">
            <h4 className="text-red-600 font-bold mb-3">{errMsg}</h4>
            <form onSubmit={handleSubmit}>
              <label className="block text-sm text-gray-300 mb-2">
                Full Name
              </label>
              <input
                type="text"
                id="company"
                placeholder="Enter your full name"
                value={c_Name}
                onChange={(e) => set_Cname(e.target.value)}
                className="w-full mb-4 bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-500 rounded px-3 py-2 focus:outline-none focus:border-green-500"
              />

              <label className="block text-sm text-gray-300 mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => set_email(e.target.value)}
                className="w-full mb-4 bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-500 rounded px-3 py-2 focus:outline-none focus:border-green-500"
              />

              <label className="block text-sm text-gray-300 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="Create a password"
                ref={userRef}
                autoComplete="off"
                required
                value={pwd}
                onChange={(e) => setPwd(e.target.value)}
                className="w-full mb-4 bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-500 rounded px-3 py-2 focus:outline-none focus:border-green-500"
              />

              <label className="block text-sm text-gray-300 mb-2">
                Confirm Password
              </label>
              <input
                id="confirm_pwd"
                type="password"
                placeholder="Confirm your password"
                onChange={(e) => setMatchPwd(e.target.value)}
                value={matchPwd}
                required
                className="w-full mb-6 bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-500 rounded px-3 py-2 focus:outline-none focus:border-green-500"
              />

              <button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 rounded-md mb-4 transition"
              >
                Create Account
              </button>
            </form>

            <p className="text-center text-sm text-gray-400 mt-4">
              Already have an account?{" "}
              <Link to={"/login"} className="text-green-400 font-medium">
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
