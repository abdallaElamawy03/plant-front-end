import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import useLogout from "../hooks/useLogout";
import useAuth from "../hooks/useAuth";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { useState, useEffect } from "react";
import "./App.css";
import UpperNav from "./UpperNav";

const PlantDiagnosis = () => {
  const { t } = useTranslation();
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [diagnosisResult, setDiagnosisResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { auth } = useAuth();
  const logout = useLogout();
  const axiosPrivate = useAxiosPrivate();

  const symptoms = [
    { key: "yellowLeaves", label: t("plantDiagnosis.symptoms.yellowLeaves") },
    { key: "spots", label: t("plantDiagnosis.symptoms.spots") },
    { key: "wilting", label: t("plantDiagnosis.symptoms.wilting") },
    { key: "stuntedGrowth", label: t("plantDiagnosis.symptoms.stuntedGrowth") },
    { key: "mold", label: t("plantDiagnosis.symptoms.mold") },
    { key: "leafCurling", label: t("plantDiagnosis.symptoms.leafCurling") },
    { key: "rootRot", label: t("plantDiagnosis.symptoms.rootRot") },
    { key: "discoloration", label: t("plantDiagnosis.symptoms.discoloration") },
    { key: "holes", label: t("plantDiagnosis.symptoms.holes") },
    {
      key: "droppingLeaves",
      label: t("plantDiagnosis.symptoms.droppingLeaves"),
    },
  ];

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (10MB max)
      if (file.size > 10 * 1024 * 1024) {
        alert(t("plantDiagnosis.errors.fileSizeLimit"));
        return;
      }

      // Validate file type
      const validTypes = ["image/png", "image/jpeg", "image/jpg"];
      if (!validTypes.includes(file.type)) {
        alert(t("plantDiagnosis.errors.fileTypeError"));
        return;
      }

      setSelectedImage(file);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSymptomToggle = (symptom) => {
    setSelectedSymptoms((prev) => {
      if (prev.includes(symptom)) {
        return prev.filter((s) => s !== symptom);
      } else {
        return [...prev, symptom];
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate inputs
    if (!selectedImage) {
      alert(t("plantDiagnosis.errors.uploadImage"));
      return;
    }

    if (selectedSymptoms.length === 0) {
      alert(t("plantDiagnosis.errors.selectSymptoms"));
      return;
    }

    setLoading(true);

    try {
      // Call AI diagnosis endpoint
      const symptomsText = selectedSymptoms.join(", ");
      const diagnosisResponse = await axiosPrivate.post(
        "/ai/plant-diagnosis",
        {
          image: imagePreview, // base64 image
          plantType: "Unknown",
          symptoms: symptomsText,
        },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      // Set the AI diagnosis result
      setDiagnosisResult(diagnosisResponse.data);

      // Track activity in backend
      await axiosPrivate.post(
        "/activity/track",
        {
          type: "plant_diagnosis",
          description: `Diagnosed plant - ${diagnosisResponse.data.detected.disease} (${diagnosisResponse.data.detected.severity})`,
          link: "/diagnosis",
        },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      console.log("Plant diagnosis completed successfully");
    } catch (err) {
      console.error("Error diagnosing disease:", err);
      alert("Error processing diagnosis. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setSelectedImage(null);
    setImagePreview(null);
    setSelectedSymptoms([]);
    setDiagnosisResult(null);
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
              {t("plantDiagnosis.title")}
            </h1>
            <p className="text-gray-600 text-lg">
              {t("plantDiagnosis.subtitle")}
            </p>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Side - Upload and Symptoms */}
            <div className="space-y-6">
              {/* Upload Section */}
              <div className="bg-white rounded-xl p-8 border border-gray-200 shadow-sm">
                <h3 className="text-lg font-semibold mb-4 text-gray-900">
                  {t("plantDiagnosis.uploadSection.title")}
                </h3>

                <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-gray-400 transition-colors">
                  <input
                    type="file"
                    id="plant-image"
                    accept="image/png,image/jpeg,image/jpg"
                    onChange={handleImageChange}
                    className="hidden"
                  />

                  {!imagePreview ? (
                    <label
                      htmlFor="plant-image"
                      className="cursor-pointer flex flex-col items-center"
                    >
                      <svg
                        className="w-16 h-16 mb-4 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                        />
                      </svg>
                      <p className="text-gray-600 mb-2">
                        {t("plantDiagnosis.uploadSection.clickToUpload")}
                      </p>
                      <p className="text-sm text-gray-500">
                        {t("plantDiagnosis.uploadSection.fileTypes")}
                      </p>
                    </label>
                  ) : (
                    <div className="relative">
                      <img
                        src={imagePreview}
                        alt="Plant preview"
                        className="max-h-64 mx-auto rounded-lg"
                      />
                      <button
                        onClick={resetForm}
                        className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white rounded-full p-2"
                      >
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
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                      {selectedImage && (
                        <p className="text-sm text-gray-600 mt-3">
                          {selectedImage.name}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Symptoms Section */}
              <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                <h3 className="text-lg font-semibold mb-3 text-gray-900">
                  {t("plantDiagnosis.symptomsSection.title")}
                </h3>

                <select
                  multiple
                  value={selectedSymptoms}
                  onChange={(e) => {
                    const options = Array.from(e.target.selectedOptions);
                    setSelectedSymptoms(options.map((option) => option.value));
                  }}
                  className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent [&>option:checked]:bg-green-600 [&>option:checked]:text-white dark:[&>option:checked]:bg-green-500 [&>option:hover:not(:checked)]:bg-green-50 dark:[&>option:hover]:bg-green-900"
                  size="6"
                >
                  {symptoms.map((symptom) => (
                    <option
                      key={symptom.key}
                      value={symptom.label}
                      className="py-2 px-2 cursor-pointer"
                    >
                      {symptom.label}
                    </option>
                  ))}
                </select>

                {selectedSymptoms.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {selectedSymptoms.map((symptom) => (
                      <span
                        key={symptom}
                        className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm flex items-center gap-1"
                      >
                        {symptom}
                        <button
                          onClick={() => handleSymptomToggle(symptom)}
                          className="hover:bg-green-200 rounded-full p-0.5"
                        >
                          <svg
                            className="w-3 h-3"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </span>
                    ))}
                  </div>
                )}

                <p className="text-xs text-gray-500 mt-2">
                  Hold Ctrl/Cmd to select multiple symptoms
                </p>
              </div>

              {/* Submit Button */}
              <button
                onClick={handleSubmit}
                disabled={
                  loading || !selectedImage || selectedSymptoms.length === 0
                }
                className={`w-full ${
                  loading || !selectedImage || selectedSymptoms.length === 0
                    ? "bg-green-400 cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-700"
                } text-white font-semibold py-4 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2`}
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
                    {t("plantDiagnosis.buttons.diagnosing")}
                  </>
                ) : (
                  <>
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
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    {t("plantDiagnosis.buttons.diagnose")}
                  </>
                )}
              </button>
            </div>

            {/* Right Side - Results */}
            <div className="bg-white rounded-xl p-8 border border-gray-200 shadow-sm flex flex-col items-center justify-center text-center min-h-[600px]">
              {!diagnosisResult ? (
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
                    Ready for Diagnosis
                  </h3>
                  <p className="text-gray-600 max-w-md">
                    Upload a plant image and select observed symptoms to get
                    started with AI-powered disease identification.
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
                    Diagnosis Complete!
                  </h3>

                  <div className="w-full mt-6 space-y-4 max-h-[500px] overflow-y-auto">
                    <div className="bg-gray-50 rounded-lg p-4 text-left border border-gray-200">
                      <h4 className="font-semibold mb-2 text-gray-900">
                        Detected Disease:
                      </h4>
                      <p className="text-gray-900 text-lg font-bold">
                        {diagnosisResult.detected.disease}
                      </p>
                      <p className="text-gray-600 text-sm mt-2">
                        {diagnosisResult.detected.description}
                      </p>
                      <div className="mt-2">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                            diagnosisResult.detected.severity === "Severe"
                              ? "bg-red-100 text-red-700"
                              : diagnosisResult.detected.severity === "Moderate"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-green-100 text-green-700"
                          }`}
                        >
                          {diagnosisResult.detected.severity}
                        </span>
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4 text-left border border-gray-200">
                      <h4 className="font-semibold mb-2 text-gray-900">
                        Confidence Level:
                      </h4>
                      <div className="flex items-center gap-3">
                        <div className="flex-1 bg-gray-200 rounded-full h-3">
                          <div
                            className="bg-green-600 h-3 rounded-full"
                            style={{
                              width: diagnosisResult.detected.confidence,
                            }}
                          ></div>
                        </div>
                        <span className="text-gray-900 font-semibold">
                          {diagnosisResult.detected.confidence}
                        </span>
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4 text-left border border-gray-200">
                      <h4 className="font-semibold mb-2 text-gray-900">
                        Cause:
                      </h4>
                      <p className="text-gray-700 text-sm">
                        {diagnosisResult.detected.cause}
                      </p>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4 text-left border border-gray-200">
                      <h4 className="font-semibold mb-2 text-gray-900">
                        Affected Parts:
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {diagnosisResult.detected.affectedParts.map((part) => (
                          <span
                            key={part}
                            className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm"
                          >
                            {part}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4 text-left border border-gray-200">
                      <h4 className="font-semibold mb-2 text-gray-900">
                        Immediate Treatment:
                      </h4>
                      <ul className="text-gray-700 text-sm space-y-1 list-disc list-inside">
                        {diagnosisResult.treatment.immediate.map(
                          (step, idx) => (
                            <li key={idx}>{step}</li>
                          )
                        )}
                      </ul>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4 text-left border border-gray-200">
                      <h4 className="font-semibold mb-2 text-gray-900">
                        Prevention Tips:
                      </h4>
                      <ul className="text-gray-700 text-sm space-y-1 list-disc list-inside">
                        {diagnosisResult.treatment.preventive.map(
                          (tip, idx) => (
                            <li key={idx}>{tip}</li>
                          )
                        )}
                      </ul>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4 text-left border border-gray-200">
                      <h4 className="font-semibold mb-2 text-gray-900">
                        Environmental Factors:
                      </h4>
                      <div className="text-sm space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Temperature:</span>
                          <span className="text-gray-900 font-medium">
                            {
                              diagnosisResult.environmentalFactors.temperature
                                .current
                            }{" "}
                            (Optimal:{" "}
                            {
                              diagnosisResult.environmentalFactors.temperature
                                .optimal
                            }
                            )
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Humidity:</span>
                          <span className="text-gray-900 font-medium">
                            {
                              diagnosisResult.environmentalFactors.humidity
                                .current
                            }{" "}
                            (Optimal:{" "}
                            {
                              diagnosisResult.environmentalFactors.humidity
                                .optimal
                            }
                            )
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Sunlight:</span>
                          <span className="text-gray-900 font-medium">
                            {
                              diagnosisResult.environmentalFactors.sunlight
                                .status
                            }
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-blue-50 rounded-lg p-4 text-left border border-blue-200">
                      <h4 className="font-semibold mb-2 text-blue-900">
                        Recovery Time:
                      </h4>
                      <p className="text-blue-700 text-sm font-medium">
                        {diagnosisResult.treatment.estimatedRecoveryTime}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={resetForm}
                    className="mt-6 text-green-600 hover:text-green-700 font-medium"
                  >
                    New Diagnosis
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

export default PlantDiagnosis;
