import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import useLogout from "../hooks/useLogout";
import useAuth from "../hooks/useAuth";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { useState, useEffect } from "react";
import "./App.css";
import UpperNav from "./UpperNav";

const SoilAnalysis = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    ph: "",
    moisture: "",
    nitrogen: "",
    phosphorus: "",
    potassium: "",
  });

  const [analysisResult, setAnalysisResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { auth } = useAuth();
  const logout = useLogout();
  const axiosPrivate = useAxiosPrivate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate inputs
    if (
      !formData.ph ||
      !formData.moisture ||
      !formData.nitrogen ||
      !formData.phosphorus ||
      !formData.potassium
    ) {
      alert(t("soilAnalysis.errors.fillAllFields"));
      return;
    }

    setLoading(true);

    try {
      // Call AI soil analysis endpoint
      const analysisResponse = await axiosPrivate.post(
        "/ai/soil-analysis",
        {
          image: null,
          location: "User Farm",
          sampleDepth: "15cm",
          manualData: formData,
        },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      // Set the AI analysis result
      setAnalysisResult(analysisResponse.data);

      // Track activity in backend
      await axiosPrivate.post(
        "/activity/track",
        {
          type: "soil_analysis",
          description: `Soil analysis - Type: ${analysisResponse.data.soilType}, Health: ${analysisResponse.data.healthStatus}`,
          link: "/soil",
        },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      console.log("Soil analysis completed successfully");
    } catch (err) {
      console.error("Error analyzing soil:", err);
      alert("Error processing soil analysis. Please try again.");
    } finally {
      setLoading(false);
    }
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
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4 text-gray-900">
              {t("soilAnalysis.title")}
            </h1>
            <p className="text-gray-600 text-lg">
              {t("soilAnalysis.subtitle")}
            </p>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Side - Form */}
            <div className="bg-white rounded-xl p-8 border border-gray-200 shadow-sm">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* PH and Moisture Row */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="ph"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      {t("soilAnalysis.form.ph")}
                    </label>
                    <input
                      type="number"
                      id="ph"
                      name="ph"
                      step="0.1"
                      min="0"
                      max="14"
                      value={formData.ph}
                      onChange={handleInputChange}
                      placeholder="6.5"
                      className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="moisture"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      {t("soilAnalysis.form.moisture")}
                    </label>
                    <input
                      type="number"
                      id="moisture"
                      name="moisture"
                      step="0.1"
                      min="0"
                      max="100"
                      value={formData.moisture}
                      onChange={handleInputChange}
                      placeholder="50"
                      className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Nitrogen and Phosphorus Row */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="nitrogen"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      {t("soilAnalysis.form.nitrogen")}
                    </label>
                    <input
                      type="number"
                      id="nitrogen"
                      name="nitrogen"
                      step="0.1"
                      min="0"
                      value={formData.nitrogen}
                      onChange={handleInputChange}
                      placeholder="50"
                      className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="phosphorus"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      {t("soilAnalysis.form.phosphorus")}
                    </label>
                    <input
                      type="number"
                      id="phosphorus"
                      name="phosphorus"
                      step="0.1"
                      min="0"
                      value={formData.phosphorus}
                      onChange={handleInputChange}
                      placeholder="50"
                      className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Potassium */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="potassium"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      {t("soilAnalysis.form.potassium")}
                    </label>
                    <input
                      type="number"
                      id="potassium"
                      name="potassium"
                      step="0.1"
                      min="0"
                      value={formData.potassium}
                      onChange={handleInputChange}
                      placeholder="50"
                      className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full ${
                    loading ? "bg-green-700" : "bg-green-600 hover:bg-green-700"
                  } text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2`}
                >
                  {loading ? (
                    <>
                      <svg
                        className="animate-spin h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      {t("soilAnalysis.form.analyzing")}
                    </>
                  ) : (
                    t("soilAnalysis.form.analyzeButton")
                  )}
                </button>
              </form>
            </div>

            {/* Right Side - Results */}
            <div className="bg-white rounded-xl p-8 border border-gray-200 shadow-sm flex flex-col items-center justify-center text-center">
              {!analysisResult ? (
                <>
                  <div className="w-24 h-24 mb-6 opacity-30 text-gray-400">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      className="w-full h-full"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232 1.232 3.227 0 4.459l-1.906 1.906c-1.232 1.232-3.227 1.232-4.459 0l-4.069-4.069a2.25 2.25 0 01-.659-1.591V8.5m0 6l-3.182 3.182c-1.232 1.232-3.227 1.232-4.459 0L2.602 16.78c-1.232-1.232-1.232-3.227 0-4.459L6.77 8.25"
                      />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold mb-3 text-gray-900">
                    {t("soilAnalysis.results.noAnalysis")}
                  </h3>
                  <p className="text-gray-600">
                    {t("soilAnalysis.results.submitPrompt")}
                  </p>
                </>
              ) : (
                <>
                  <div className="w-24 h-24 mb-6 text-green-600">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="w-full h-full"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold mb-3 text-green-600">
                    {t("soilAnalysis.results.complete")}
                  </h3>

                  <div className="w-full mt-6 space-y-4 max-h-[500px] overflow-y-auto">
                    <div className="bg-gray-50 rounded-lg p-4 text-left border border-gray-200">
                      <h4 className="font-semibold mb-2 text-gray-900">
                        Soil Type:
                      </h4>
                      <p className="text-gray-900 text-lg font-bold">
                        {analysisResult.soilType}
                      </p>
                      <div className="mt-2">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                            analysisResult.healthStatus === "Excellent"
                              ? "bg-green-100 text-green-700"
                              : analysisResult.healthStatus === "Good"
                              ? "bg-blue-100 text-blue-700"
                              : analysisResult.healthStatus === "Fair"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {analysisResult.healthStatus}
                        </span>
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4 text-left border border-gray-200">
                      <h4 className="font-semibold mb-2 text-gray-900">
                        Confidence:
                      </h4>
                      <p className="text-gray-900 font-medium">
                        {analysisResult.confidence}
                      </p>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4 text-left border border-gray-200">
                      <h4 className="font-semibold mb-3 text-gray-900">
                        Soil Properties:
                      </h4>
                      <div className="space-y-3">
                        <div className="border-b border-gray-200 pb-2">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm font-medium text-gray-700">
                              pH Level
                            </span>
                            <span className="text-sm font-bold text-gray-900">
                              {analysisResult.properties.ph.value}
                            </span>
                          </div>
                          <p className="text-xs text-gray-600">
                            {analysisResult.properties.ph.status} -{" "}
                            {analysisResult.properties.ph.recommendation}
                          </p>
                        </div>
                        <div className="border-b border-gray-200 pb-2">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm font-medium text-gray-700">
                              Nitrogen
                            </span>
                            <span className="text-sm font-bold text-gray-900">
                              {analysisResult.properties.nitrogen.level}{" "}
                              {analysisResult.properties.nitrogen.unit}
                            </span>
                          </div>
                          <p className="text-xs text-gray-600">
                            {analysisResult.properties.nitrogen.status} -{" "}
                            {analysisResult.properties.nitrogen.recommendation}
                          </p>
                        </div>
                        <div className="border-b border-gray-200 pb-2">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm font-medium text-gray-700">
                              Phosphorus
                            </span>
                            <span className="text-sm font-bold text-gray-900">
                              {analysisResult.properties.phosphorus.level}{" "}
                              {analysisResult.properties.phosphorus.unit}
                            </span>
                          </div>
                          <p className="text-xs text-gray-600">
                            {analysisResult.properties.phosphorus.status} -{" "}
                            {
                              analysisResult.properties.phosphorus
                                .recommendation
                            }
                          </p>
                        </div>
                        <div className="border-b border-gray-200 pb-2">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm font-medium text-gray-700">
                              Potassium
                            </span>
                            <span className="text-sm font-bold text-gray-900">
                              {analysisResult.properties.potassium.level}{" "}
                              {analysisResult.properties.potassium.unit}
                            </span>
                          </div>
                          <p className="text-xs text-gray-600">
                            {analysisResult.properties.potassium.status} -{" "}
                            {analysisResult.properties.potassium.recommendation}
                          </p>
                        </div>
                        <div className="border-b border-gray-200 pb-2">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm font-medium text-gray-700">
                              Organic Matter
                            </span>
                            <span className="text-sm font-bold text-gray-900">
                              {
                                analysisResult.properties.organicMatter
                                  .percentage
                              }
                              %
                            </span>
                          </div>
                          <p className="text-xs text-gray-600">
                            {analysisResult.properties.organicMatter.status} -{" "}
                            {
                              analysisResult.properties.organicMatter
                                .recommendation
                            }
                          </p>
                        </div>
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm font-medium text-gray-700">
                              Moisture
                            </span>
                            <span className="text-sm font-bold text-gray-900">
                              {analysisResult.properties.moisture.percentage}%
                            </span>
                          </div>
                          <p className="text-xs text-gray-600">
                            {analysisResult.properties.moisture.status} -{" "}
                            {analysisResult.properties.moisture.recommendation}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-green-50 rounded-lg p-4 text-left border border-green-200">
                      <h4 className="font-semibold mb-2 text-green-900">
                        Suitable Crops:
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {analysisResult.suitableFor.map((crop) => (
                          <span
                            key={crop}
                            className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium"
                          >
                            {crop}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="bg-blue-50 rounded-lg p-4 text-left border border-blue-200">
                      <h4 className="font-semibold mb-2 text-blue-900">
                        Recommendations:
                      </h4>
                      <ul className="text-sm text-blue-700 space-y-1 list-disc list-inside">
                        {analysisResult.recommendations.map((rec, idx) => (
                          <li key={idx}>{rec}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setAnalysisResult(null);
                      setFormData({
                        ph: "",
                        moisture: "",
                        nitrogen: "",
                        phosphorus: "",
                        potassium: "",
                      });
                    }}
                    className="mt-6 text-green-600 hover:text-green-700 font-medium"
                  >
                    {t("soilAnalysis.results.newAnalysis")}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SoilAnalysis;
