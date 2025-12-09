import { useRef, useState, useEffect } from "react";
import {
  faCheck,
  faTimes,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "../api/axios";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "./LanguageSwitcher";

const Company_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
const REGISTER_URL = "/users";

const Register = () => {
  const { t } = useTranslation();
  const userRef = useRef();
  const errRef = useRef();
  const navigate = useNavigate();
  const [phonenumber, setPhonenumber] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");

  // Find country code automatically
  const countries = [
    { name: "Egypt", code: "+20" },
    { name: "USA", code: "+1" },
    { name: "UK", code: "+44" },
    { name: "Saudi Arabia", code: "+966" },
    { name: "UAE", code: "+971" },
  ];
  const selectedCountry = countries.find((c) => c.name === country);
  const countryCode = selectedCountry ? selectedCountry.code : "";

  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, ""); // allow only digits
    setPhonenumber(value);
  };

  const egyptGovernorates = [
    "Cairo",
    "Giza",
    "Alexandria",
    "Dakahlia",
    "Red Sea",
    "Beheira",
    "Fayoum",
    "Gharbia",
    "Ismailia",
    "Menofia",
    "Minya",
    "Qaliubiya",
    "New Valley",
    "Suez",
    "Aswan",
    "Assiut",
    "Beni Suef",
    "Port Said",
    "Damietta",
    "Sharkia",
    "South Sinai",
    "Kafr El Sheikh",
    "Matrouh",
    "Luxor",
    "Qena",
    "North Sinai",
    "Sohag",
  ];

  const [user, set_user] = useState("");
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
    setValidName(Company_REGEX.test(user));
  }, [user]);

  useEffect(() => {
    setValidPwd(PWD_REGEX.test(pwd));
    setValidMatch(pwd === matchPwd);
  }, [pwd, matchPwd]);

  useEffect(() => {
    setErrMsg("");
  }, [user, pwd, matchPwd]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // if button enabled with JS hack
    const v1 = Company_REGEX.test(user);
    const v2 = PWD_REGEX.test(pwd);
    // if (!v1 || !v2) {
    //     setErrMsg("Enter more powerful password");
    //     return;
    // }
    try {
      // user,password,email
      const response = await axios.post(
        REGISTER_URL,
        JSON.stringify({
          username: user,
          password: pwd,
          phonenumber: countryCode + phonenumber,
          country: country,
          city,
        }),
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      navigate("/dashboard");

      // TODO: remove console.logs before deployment
      console.log(JSON.stringify(response?.data));
      //console.log(JSON.stringify(response))
      setSuccess(true);
      //clear state and controlled inputs
      set_user("");
      setPwd("");
      setMatchPwd("");
    } catch (err) {
      if (!err?.response) {
        setErrMsg(t("register.errors.noServerResponse"));
      } else if (err.response?.status === 409) {
        setErrMsg(t("register.errors.usernameTaken"));
      } else {
        setErrMsg(t("register.errors.registrationFailed"));
      }
      // errRef.current.focus();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-16 relative">
      {/* Fixed LanguageSwitcher in the top-left corner */}
      <div className="fixed top-6 left-6 z-50">
        <LanguageSwitcher />
      </div>

      {/* Fixed Landing button in the top-right corner */}
      <Link
        to="/"
        className="fixed top-6 right-6 z-50 text-green-400 hover:text-white border border-green-600 px-3 py-1 rounded-md bg-transparent hover:bg-green-600 transition"
        aria-label="Go to landing"
      >
        {t("common.back")}
      </Link>
      <div className="w-full max-w-xl px-6">
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-green-600 rounded-md flex items-center justify-center text-white text-lg">
              <i className="fas fa-seedling"></i>
            </div>
            <span className="text-lg md:text-xl font-semibold text-gray-900">
              {t("common.appName")}
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            {t("register.title")}
          </h1>
          <p className="text-sm text-gray-600 mt-2">{t("register.subtitle")}</p>
        </div>

        <div className="mx-auto max-w-md">
          <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-lg">
            <h4 className="text-red-600 font-bold mb-3">{errMsg}</h4>
            <form onSubmit={handleSubmit}>
              <label className="block text-sm text-gray-900 mb-2">
                {t("register.username")}
              </label>
              <input
                type="text"
                id="user"
                placeholder={t("register.instructions.username")}
                value={user}
                onChange={(e) => set_user(e.target.value)}
                className="w-full mb-4 bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-500 rounded px-3 py-2 focus:outline-none focus:border-green-500"
              />

              <label className="block text-sm text-gray-900 mb-2">
                {t("register.password")}
              </label>
              <input
                id="password"
                type="password"
                placeholder={t("register.instructions.password")}
                ref={userRef}
                autoComplete="off"
                required
                value={pwd}
                onChange={(e) => setPwd(e.target.value)}
                className="w-full mb-4 bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-500 rounded px-3 py-2 focus:outline-none focus:border-green-500"
              />

              <label className="block text-sm text-gray-900 mb-2">
                {t("register.confirmPassword")}
              </label>
              <input
                id="confirm_pwd"
                type="password"
                placeholder={t("register.instructions.confirmPassword")}
                onChange={(e) => setMatchPwd(e.target.value)}
                value={matchPwd}
                required
                className="w-full mb-6 bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-500 rounded px-3 py-2 focus:outline-none focus:border-green-500"
              />

              {/* Phone number */}
              <label className="block text-sm text-gray-900 mb-2">
                {t("register.phoneNumber")}
              </label>
              <div className="flex items-center mb-6">
                <input
                  type="text"
                  disabled
                  placeholder="+"
                  value={countryCode}
                  className="w-20 bg-gray-50 border border-gray-700 text-white-300 rounded-l px-3 py-2 text-center"
                />
                <input
                  type="tel"
                  placeholder={t("register.phoneNumber")}
                  onChange={handlePhoneChange}
                  value={phonenumber}
                  required
                  className="flex-1 bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-500 rounded-r px-3 py-2 focus:outline-none focus:border-green-500"
                />
              </div>

              {/* Country */}
              <label className="block text-sm text-gray-900 mb-2">
                {t("register.country")}
              </label>
              <select
                value={country}
                onChange={(e) => {
                  setCountry(e.target.value);
                  setCity(""); // reset city on change
                }}
                required
                className="w-full mb-6 bg-gray-50 border border-gray-200 text-gray-500 rounded px-3 py-2 focus:outline-none focus:border-green-500"
              >
                <option value="">{t("register.selectCountry")}</option>
                {countries.map((c) => (
                  <option key={c.name} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>

              {/* City */}
              <label className="block text-sm text-gray-900 mb-2">
                {t("register.city")}
              </label>
              {country === "Egypt" ? (
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  required
                  className="w-full mb-6 bg-gray-50 border border-gray-200 text-gray-900 rounded px-3 py-2 focus:outline-none focus:border-green-500"
                >
                  <option value="">{t("register.selectCity")}</option>
                  {egyptGovernorates.map((gov) => (
                    <option key={gov} value={gov}>
                      {gov}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  placeholder={t("register.city")}
                  onChange={(e) => setCity(e.target.value)}
                  value={city}
                  required
                  className="w-full mb-6 bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-500 rounded px-3 py-2 focus:outline-none focus:border-green-500"
                />
              )}

              <button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 rounded-md mb-4 transition"
              >
                {t("register.createAccount")}
              </button>
            </form>

            <p className="text-center text-sm text-gray-400 mt-4">
              {t("register.alreadyHaveAccount")}{" "}
              <Link to="/login" className="text-green-400 font-medium">
                {t("common.signIn")}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
