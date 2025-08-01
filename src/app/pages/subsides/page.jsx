"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import BASE_URL from "@/API/config";
import { useAuth } from "@/context/AuthContext";
import {
  FaUser,
  FaWheelchair,
  FaHome,
  FaAppleAlt,
  FaFacebook,
  FaEnvelope,
  FaIdCard,
  FaPhone,
  FaCalendarAlt,
  FaFileUpload,
  FaCheckCircle,
} from "react-icons/fa";
import { IoIosArrowForward } from "react-icons/io";

const colorMap = {
  pink: {
    border: "border-pink-400",
    bg: "bg-pink-500",
    hover: "hover:bg-pink-600",
    light: "bg-pink-50",
    text: "text-pink-700",
  },
  violet: {
    border: "border-violet-400",
    bg: "bg-violet-500",
    hover: "hover:bg-violet-600",
    light: "bg-violet-50",
    text: "text-violet-700",
  },
  yellow: {
    border: "border-yellow-400",
    bg: "bg-yellow-500",
    hover: "hover:bg-yellow-600",
    light: "bg-yellow-50",
    text: "text-yellow-700",
  },
  green: {
    border: "border-green-400",
    bg: "bg-green-500",
    hover: "hover:bg-green-600",
    light: "bg-green-50",
    text: "text-green-700",
  },
};

const subsidyTypes = [
  "① Elderly Allowance",
  "② Disability Allowance",
  "③ Housing Assistance",
  "④ Nutrition Allowance",
];

const initialForms = [
  {
    // Elderly Allowance
    fullName: "",
    dateOfBirth: "",
    gender: "",
    nationalIdNumber: "",
    address: "",
    contactNumber: "",
    maritalStatus: "",
    receivingPensionOrAid: "",
    dependents: "",
    documents: null,
  },
  {
    // Disability Allowance
    fullName: "",
    dateOfBirth: "",
    gender: "",
    nationalIdNumber: "",
    address: "",
    contactNumber: "",
    typeOfDisability: "",
    disabilityDuration: "",
    employmentStatus: "",
    receivingOtherDisabilityBenefit: "",
    documents: null,
  },
  {
    // Housing Assistance
    fullName: "",
    dateOfBirth: "",
    gender: "",
    nationalIdNumber: "",
    address: "",
    contactNumber: "",
    ownershipStatus: "",
    monthlyHouseholdIncome: "",
    numberOfFamilyMembers: "",
    typeOfAssistanceRequested: "",
    housingConditionDescription: "",
    documents: null,
  },
  {
    // Nutrition Allowance
    fullName: "",
    dateOfBirth: "",
    gender: "",
    nationalIdNumber: "",
    address: "",
    contactNumber: "",
    age: "",
    numberOfChildren: "",
    healthConditions: "",
    receivingOtherFoodAssistance: "",
    documents: null,
  },
];

export default function SubSidesPage() {
  const router = useRouter();
  const { user, loading, SignOut } = useAuth();
  const [pendingForm, setPendingForm] = useState(null);
  const [activeForm, setActiveForm] = useState(null);
  const [formDataArr, setFormDataArr] = useState(initialForms);
  const [submitting, setSubmitting] = useState(false);
  const [fileErrors, setFileErrors] = useState([null, null, null, null]);
  const [successMessage, setSuccessMessage] = useState(null);

  // Email verification modal states
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [emailInput, setEmailInput] = useState("");
  const [emailError, setEmailError] = useState("");
  const [selectedServiceIndex, setSelectedServiceIndex] = useState(null);
  const [verifyingEmail, setVerifyingEmail] = useState(false);

  const validateFile = (file, idx) => {
    if (!file) return "Please upload a proof document.";
    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (!allowedTypes.includes(file.type)) {
      return "Only JPEG, JPG, PNG, PDF, DOC, or DOCX files are allowed.";
    }
    if (file.size > maxSize) {
      return "File size must be less than 10MB.";
    }
    return null;
  };

  const handleStart = (idx) => {
    if (!user) {
      // If user is NOT logged in, show the registration/sign-in modal
      setPendingForm(idx);
    } else {
      // If user is logged in, show email verification modal
      setSelectedServiceIndex(idx);
      setShowEmailModal(true);
      setEmailInput(""); // Clear previous input
      setEmailError(""); // Clear previous error
    }
  };

  const handleModalAnswer = (isRegistered) => {
    if (isRegistered) router.push("/pages/sign-in");
    else router.push("/pages/register");
    setPendingForm(null);
  };

  const handleEmailVerification = async () => {
    if (!emailInput.trim()) {
      setEmailError("Email cannot be empty.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailInput)) {
      setEmailError("Please enter a valid email address.");
      return;
    }

    setVerifyingEmail(true);
    setEmailError("");

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setEmailError("Authentication error. Please log in again.");
        setVerifyingEmail(false);
        return;
      }

      // Check if the entered email matches the user's registered email
      if (
        user &&
        user.email &&
        emailInput.toLowerCase() === user.email.toLowerCase()
      ) {
        setShowEmailModal(false);
        setActiveForm(selectedServiceIndex);
        setEmailError("");
      } else {
        setEmailError("Email does not match your registered email address.");
      }
    } catch (err) {
      console.error("Email verification error:", err);
      setEmailError("Failed to verify email. Please try again.");
    } finally {
      setVerifyingEmail(false);
    }
  };

  const handleChange = (idx, e) => {
    const { name, value, files } = e.target;
    setFormDataArr((prev) => {
      const newData = [...prev];
      if (name === "documents" && files && files.length > 0) {
        const error = validateFile(files[0], idx);
        setFileErrors((prevErrors) => {
          const newErrors = [...prevErrors];
          newErrors[idx] = error;
          return newErrors;
        });
        newData[idx][name] = error ? null : files;
      } else {
        newData[idx][name] = value;
      }
      return newData;
    });
  };

  const handleSubmit = async (idx, e) => {
    e.preventDefault();
    const currentForm = formDataArr[idx];

    if (fileErrors[idx] || !currentForm.documents) {
      alert(
        `Please fix the document upload issue: ${
          fileErrors[idx] || "No file selected."
        }`
      );
      return;
    }

    setSubmitting(true);

    try {
      const formDataToSend = new FormData();

      // Add subsidy type
      formDataToSend.append("type", subsidyTypes[idx]);

      // Create data object for the backend
      const dataObject = {};
      Object.entries(currentForm).forEach(([key, value]) => {
        if (key !== "documents" && value !== null && value !== "") {
          dataObject[key] = value;
        }
      });

      // Add the data as JSON string
      formDataToSend.append("data", JSON.stringify(dataObject));

      // Add files
      if (currentForm.documents && currentForm.documents.length > 0) {
        Array.from(currentForm.documents).forEach((file) => {
          formDataToSend.append("files", file);
        });
      }

      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await axios.post(
        `${BASE_URL}/subsidies`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 201) {
        setSuccessMessage(
          `${subsidies[idx].title} application submitted successfully!`
        );
        // Reset form
        setFormDataArr((prev) => {
          const newData = [...prev];
          newData[idx] = initialForms[idx];
          return newData;
        });
        setFileErrors((prev) => {
          const newErrors = [...prev];
          newErrors[idx] = null;
          return newErrors;
        });
        setTimeout(() => {
          setSuccessMessage(null);
          setActiveForm(null);
        }, 3000);
      }
    } catch (err) {
      console.error("Submission error:", err);
      if (
        err.response?.status === 401 ||
        err.message === "No authentication token found"
      ) {
        alert("Session expired. Please log in again.");
        SignOut();
      } else if (err.response?.status === 400) {
        const message = err.response?.data?.message || "Submission failed.";
        alert(message);
      } else {
        alert("Submission failed. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const subsidies = [
    {
      title: "Elderly Allowance",
      icon: <FaUser className="w-8 h-8" />,
      description:
        "Financial support for senior citizens aged 70+ to assist with living expenses.",
      benefits: [
        "Monthly cash allowance",
        "Healthcare benefits",
        "Utility subsidies",
      ],
      eligibility: [
        "Must be 70 years or older",
        "Sri Lankan citizen",
        "No other substantial income",
      ],
      color: "pink",
    },
    {
      title: "Disability Allowance",
      icon: <FaWheelchair className="w-8 h-8" />,
      description:
        "Support for individuals with disabilities to improve quality of life.",
      benefits: [
        "Monthly financial aid",
        "Medical equipment support",
        "Transportation assistance",
      ],
      eligibility: [
        "Certified disability",
        "Income below threshold",
        "Sri Lankan citizen",
      ],
      color: "violet",
    },
    {
      title: "Housing Assistance",
      icon: <FaHome className="w-8 h-8" />,
      description:
        "Program to help low-income families improve their living conditions.",
      benefits: [
        "Home repair grants",
        "Low-interest loans",
        "Construction materials",
      ],
      eligibility: [
        "Homeowner or legal resident",
        "Income below threshold",
        "Property meets criteria",
      ],
      color: "yellow",
    },
    {
      title: "Nutrition Allowance",
      icon: <FaAppleAlt className="w-8 h-8" />,
      description:
        "Nutritional support for vulnerable families and individuals.",
      benefits: [
        "Monthly food vouchers",
        "Nutritional supplements",
        "Cooking workshops",
      ],
      eligibility: [
        "Low-income household",
        "Children under 5 or pregnant women",
        "Special medical needs",
      ],
      color: "green",
    },
  ];

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-pink-500 mx-auto"></div>
          <p className="mt-4 text-pink-700 text-lg font-medium">
            Loading application...
          </p>
        </div>
      </div>
    );
  }

  const renderFormField = (idx, key, value) => {
    const label = key
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str) => str.toUpperCase());

    // Handle file upload
    if (key === "documents") {
      return (
        <div key={key} className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Upload Supporting Documents
            <span className="text-red-500">*</span>
          </label>
          <div className="flex items-center space-x-4">
            <label className="flex-1 cursor-pointer">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gray-400 transition">
                <FaFileUpload className="mx-auto text-gray-400 text-2xl mb-2" />
                <p className="text-sm text-gray-500">
                  {value && value.length > 0
                    ? `${value.length} file(s) selected`
                    : "Click to select files"}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Max 10MB each (PDF, JPG, PNG, DOC)
                </p>
                <input
                  type="file"
                  name={key}
                  className="hidden"
                  accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
                  onChange={(e) => handleChange(idx, e)}
                  multiple
                  required
                />
              </div>
            </label>
            {value && value.length > 0 && (
              <div className="text-green-500">
                <FaCheckCircle className="text-xl" />
              </div>
            )}
          </div>
          {fileErrors[idx] && (
            <p className="text-sm text-red-600">{fileErrors[idx]}</p>
          )}
        </div>
      );
    }

    // Handle select fields
    const selectOptions = {
      gender: ["Male", "Female", "Other"],
      maritalStatus: ["Single", "Married", "Widowed", "Divorced"],
      receivingPensionOrAid: ["Yes", "No"],
      typeOfDisability: [
        "Physical",
        "Visual",
        "Hearing",
        "Intellectual",
        "Psychosocial",
      ],
      disabilityDuration: [
        "Less than 1 year",
        "1-5 years",
        "5-10 years",
        "More than 10 years",
      ],
      employmentStatus: [
        "Employed",
        "Unemployed",
        "Self-employed",
        "Student",
        "Retired",
      ],
      receivingOtherDisabilityBenefit: ["Yes", "No"],
      ownershipStatus: ["Owned", "Rented", "Leased", "Other"],
      typeOfAssistanceRequested: [
        "Home Repair",
        "Home Renovation",
        "New Construction",
        "Other",
      ],
      receivingOtherFoodAssistance: ["Yes", "No"],
    };

    if (selectOptions[key]) {
      return (
        <div key={key} className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            {label}
            <span className="text-red-500">*</span>
          </label>
          <select
            name={key}
            value={value}
            onChange={(e) => handleChange(idx, e)}
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
          >
            <option value="">Select an option</option>
            {selectOptions[key].map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      );
    }

    // Handle textarea fields
    if (
      key === "dependents" ||
      key === "housingConditionDescription" ||
      key === "healthConditions"
    ) {
      return (
        <div key={key} className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            {label}
            <span className="text-red-500">*</span>
          </label>
          <textarea
            name={key}
            placeholder={`Enter ${label.toLowerCase()}`}
            value={value}
            onChange={(e) => handleChange(idx, e)}
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            rows="3"
          />
        </div>
      );
    }

    // Handle regular input fields
    const inputType =
      key.includes("date") || key === "dateOfBirth"
        ? "date"
        : key.includes("Income") ||
          key.includes("Number") ||
          key.includes("age") ||
          key === "numberOfFamilyMembers" ||
          key === "numberOfChildren"
        ? "number"
        : key.includes("email")
        ? "email"
        : key.includes("phone") || key.includes("contact")
        ? "tel"
        : "text";

    const iconMap = {
      fullName: <FaUser className="text-gray-400" />,
      nationalIdNumber: <FaIdCard className="text-gray-400" />,
      contactNumber: <FaPhone className="text-gray-400" />,
      dateOfBirth: <FaCalendarAlt className="text-gray-400" />,
    };

    return (
      <div key={key} className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          {label}
          <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {iconMap[key] || <FaUser className="text-gray-400" />}
          </div>
          <input
            name={key}
            type={inputType}
            placeholder={
              inputType !== "date" ? `Enter ${label.toLowerCase()}` : ""
            }
            value={value}
            onChange={(e) => handleChange(idx, e)}
            required
            min={inputType === "number" ? 0 : undefined}
            className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
          />
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-pink-50 py-10 px-4 sm:px-6 lg:px-8">
      {/* Success Message Modal */}
      {successMessage && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center">
            <FaCheckCircle className="text-green-500 text-5xl mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Success!</h3>
            <p className="text-gray-600 mb-6">{successMessage}</p>
            <button
              onClick={() => {
                setSuccessMessage(null);
                setActiveForm(null);
              }}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition"
            >
              Continue
            </button>
          </div>
        </div>
      )}

      {/* Email Verification Modal */}
      {showEmailModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full overflow-hidden">
            <div className="p-6 text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 mb-4">
                <FaEnvelope className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Verify Your Email
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                Please enter your registered email address to proceed with the
                application for{" "}
                <span className="font-semibold">
                  {subsidies[selectedServiceIndex]?.title}
                </span>
                .
              </p>
              <div className="mb-4">
                <input
                  type="email"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                />
                {emailError && (
                  <p className="text-red-600 text-sm mt-1">{emailError}</p>
                )}
              </div>
              <div className="flex flex-col space-y-3">
                <button
                  onClick={handleEmailVerification}
                  disabled={verifyingEmail}
                  className="w-full px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {verifyingEmail ? "Verifying..." : "Verify Email"}
                </button>
                <button
                  onClick={() => {
                    setShowEmailModal(false);
                    setSelectedServiceIndex(null);
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Page Header */}
      <div className="max-w-5xl mx-auto mb-12 text-center">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
          Government Subsidy Programs
        </h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Apply for various welfare programs offered by the Welivitiya
          Divisional Secretariat
        </p>
      </div>

      {/* Subsidy Cards */}
      <div className="max-w-6xl mx-auto grid gap-8 md:grid-cols-2 lg:grid-cols-2">
        {subsidies.map(
          ({ title, icon, description, benefits, eligibility, color }, idx) => {
            const col = colorMap[color];
            const currentForm = formDataArr[idx];

            return (
              <div
                key={idx}
                className={`bg-white rounded-xl shadow-md overflow-hidden border-t-4 ${col.border} transition-all hover:shadow-lg`}
              >
                {/* Card Header */}
                <div className={`p-6 ${col.light}`}>
                  <div className="flex items-center space-x-4">
                    <div className={`p-3 rounded-full ${col.bg} text-white`}>
                      {icon}
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-800">
                        {title}
                      </h2>
                      <p className="text-gray-600">{description}</p>
                    </div>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-6">
                  {activeForm === idx ? (
                    <form
                      onSubmit={(e) => handleSubmit(idx, e)}
                      className="space-y-4"
                    >
                      {/* Form Fields */}
                      {Object.entries(currentForm).map(([key, value]) =>
                        renderFormField(idx, key, value)
                      )}

                      {/* Form Actions */}
                      <div className="flex space-x-3 pt-2">
                        <button
                          type="button"
                          onClick={() => setActiveForm(null)}
                          className="px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={submitting || fileErrors[idx]}
                          className={`flex-1 px-4 py-2.5 rounded-lg text-white font-medium ${
                            col.bg
                          } ${col.hover} transition ${
                            submitting || fileErrors[idx]
                              ? "opacity-70 cursor-not-allowed"
                              : ""
                          }`}
                        >
                          {submitting ? (
                            <span className="flex items-center justify-center">
                              <svg
                                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                              Submitting...
                            </span>
                          ) : (
                            `Submit ${title} Application`
                          )}
                        </button>
                      </div>
                    </form>
                  ) : (
                    <>
                      <div className="mb-6 space-y-4">
                        <div>
                          <h3 className="font-medium text-gray-900">
                            Benefits
                          </h3>
                          <ul className="mt-2 space-y-1 text-sm text-gray-600">
                            {benefits.map((benefit, i) => (
                              <li key={i} className="flex items-start">
                                <FaCheckCircle className="flex-shrink-0 h-4 w-4 text-green-500 mt-0.5 mr-2" />
                                <span>{benefit}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <h3 className="font-medium text-gray-900">
                            Eligibility Criteria
                          </h3>
                          <ul className="mt-2 space-y-1 text-sm text-gray-600">
                            {eligibility.map((item, i) => (
                              <li key={i} className="flex items-start">
                                <FaCheckCircle className="flex-shrink-0 h-4 w-4 text-green-500 mt-0.5 mr-2" />
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <button
                        onClick={() => handleStart(idx)}
                        className={`w-full flex items-center justify-between px-6 py-3 ${col.bg} ${col.hover} text-white font-medium rounded-lg transition group`}
                      >
                        <span>Apply Now</span>
                        <IoIosArrowForward className="transform group-hover:translate-x-1 transition" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          }
        )}
      </div>

      {/* Registration Modal (Original - for non-logged-in users) */}
      {pendingForm !== null && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full overflow-hidden">
            <div className="p-6 text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 mb-4">
                <svg
                  className="h-6 w-6 text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Account Required
              </h3>
              <p className="text-sm text-gray-500 mb-6">
                You need to be registered to apply for this subsidy. Please sign
                in or register for an account.
              </p>
              <div className="flex flex-col space-y-3">
                <button
                  onClick={() => handleModalAnswer(true)}
                  className="w-full px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  I have an account
                </button>
                <button
                  onClick={() => handleModalAnswer(false)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Register new account
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="mt-20 bg-white rounded-xl shadow-sm p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <h3 className="text-lg font-semibold text-gray-900">
                Welivitiya Divisional Secretariat
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Committed to serving our community
              </p>
            </div>

            <div className="flex space-x-6">
              <a
                href="mailto:info@welivitiya.gov.lk"
                className="text-gray-400 hover:text-blue-500"
              >
                <FaEnvelope className="h-5 w-5" />
              </a>
              <a
                href="https://www.facebook.com/WelivitiyaDivithuraDS"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-blue-700"
              >
                <FaFacebook className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-200 text-sm text-gray-500 text-center">
            <p>
              © 2025 Welivitiya Divisional Secretariat. All rights reserved.
            </p>
            <p className="mt-1">
              Developed by the IT Unit | Contact: info@welivitiya.gov.lk
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
