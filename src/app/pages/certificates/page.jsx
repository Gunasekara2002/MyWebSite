// src/app/pages/certificate/page.jsx
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import BASE_URL from "@/API/config";
import { useAuth } from "@/context/AuthContext";
//import API from '@/API/axios'

const colorMap = {
  yellow: {
    border: "border-yellow-400",
    bg: "bg-yellow-500",
    hover: "hover:bg-yellow-600",
  },
  pink: {
    border: "border-pink-400",
    bg: "bg-pink-500",
    hover: "hover:bg-pink-600",
  },
  purple: {
    border: "border-purple-400",
    bg: "bg-purple-500",
    hover: "hover:bg-purple-600",
  },
};

const initialForms = [
  {
    // Birth
    fullName: "",
    address: "",
    personName: "",
    sex: "",
    copies: "",
    dob: "",
    place: "",
    division: "",
    entryNo: "",
    entryDate: "",
    fatherName: "",
    motherName: "",
    proof: null,
  },
  {
    // Marriage
    fullName: "",
    address: "",
    marriageType: "",
    copies: "",
    maleName: "",
    femaleName: "",
    registrarName: "",
    officeLocation: "",
    regDivision: "",
    placeSolemnized: "",
    dateOfMarriage: "",
    proof: null,
  },
  {
    // Death
    fullName: "",
    address: "",
    deceasedName: "",
    sex: "",
    copies: "",
    dateOfDeath: "",
    placeOfDeath: "",
    causeOfDeath: "",
    division: "",
    registrarName: "",
    officeLocation: "",
    regDivision: "",
    solemnizedPlace: "",
    proof: null,
  },
];

export default function CertificatePage() {
  const router = useRouter();
  const { user, loading, SignOut } = useAuth();
  const [pendingForm, setPendingForm] = useState(null);
  const [activeForm, setActiveForm] = useState(null);
  const [formDataArr, setFormDataArr] = useState(initialForms);
  const [submitting, setSubmitting] = useState(false);
  const [fileErrors, setFileErrors] = useState([null, null, null]);

  // Redirect to login if not authenticated
  if (!loading && !user) {
    router.push("/pages/sign-in");
    return null;
  }

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
      setPendingForm(idx);
    } else {
      setActiveForm(idx);
    }
  };

  const handleModalAnswer = (isRegistered) => {
    if (isRegistered) setActiveForm(pendingForm);
    else router.push("/pages/register");
    setPendingForm(null);
  };

  const handleChange = (idx, e) => {
    const { name, value, files } = e.target;
    setFormDataArr((prev) => {
      const newData = [...prev];
      if (name === "proof" && files[0]) {
        const error = validateFile(files[0], idx);
        setFileErrors((prevErrors) => {
          const newErrors = [...prevErrors];
          newErrors[idx] = error;
          return newErrors;
        });
        newData[idx][name] = error ? null : files[0];
      } else {
        newData[idx][name] = files ? files[0] : value;
      }
      return newData;
    });
  };

  const handleSubmit = async (idx, e) => {
    e.preventDefault();
    if (fileErrors[idx] || !formDataArr[idx].proof) {
      alert(
        `Please fix the proof document issue: ${
          fileErrors[idx] || "No file selected."
        }`
      );
      return;
    }
    setSubmitting(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("type", ["birth", "marriage", "death"][idx]);
      Object.entries(formDataArr[idx]).forEach(([key, value]) => {
        if (key === "proof" && value) {
          formDataToSend.append("proof", value);
        } else if (value !== null && value !== "") {
          formDataToSend.append(key, value);
        }
      });

      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await axios.post(
        `${BASE_URL}/certificate/`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Certificate request submitted successfully!");
      router.push("/pages/services");
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
        if (message.includes("proof")) {
          alert("Invalid proof document: " + message);
        } else if (message.includes("user")) {
          alert("User authentication failed. Please log in again.");
          SignOut();
        } else {
          alert(message);
        }
      } else {
        alert("Submission failed. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const certs = [
    { title: "Birth Certificate", color: "yellow" },
    { title: "Marriage Certificate", color: "pink" },
    { title: "Death Certificate", color: "purple" },
  ];

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-100 via-pink-100 to-purple-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-500 mx-auto"></div>
          <p className="mt-4 text-purple-700 text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-100 via-pink-100 to-purple-100 py-10 px-4">
      <div className="max-w-5xl mx-auto space-y-16">
        {certs.map(({ title, color }, idx) => {
          const col = colorMap[color];
          const fields = Object.keys(formDataArr[idx]);
          return (
            <section
              key={idx}
              className={`bg-white border-l-8 ${col.border} rounded-3xl shadow-lg p-8`}
            >
              <h2 className="text-2xl font-bold text-gray-800 mb-2">{title}</h2>
              {activeForm === idx ? (
                <form
                  onSubmit={(e) => handleSubmit(idx, e)}
                  className="grid grid-cols-1 md:grid-cols-2 gap-6"
                >
                  {fields.map((key) => {
                    if (key === "proof") {
                      return (
                        <div key={key} className="col-span-2">
                          <label className="block mb-1 text-gray-700">{`Upload ${title} Proof`}</label>
                          <input
                            type="file"
                            name="proof"
                            required
                            accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
                            onChange={(e) => handleChange(idx, e)}
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
                          />
                          <p className="text-xs text-gray-500 mt-1">
                            Accepted formats: JPG, JPEG, PNG, PDF, DOC, DOCX
                            (Max 10MB)
                          </p>
                          {fileErrors[idx] && (
                            <p className="text-sm text-red-600 mt-1">
                              {fileErrors[idx]}
                            </p>
                          )}
                          {formDataArr[idx].proof && !fileErrors[idx] && (
                            <p className="text-sm text-gray-600 mt-1">
                              Selected: {formDataArr[idx].proof.name} (
                              {(
                                formDataArr[idx].proof.size /
                                1024 /
                                1024
                              ).toFixed(2)}{" "}
                              MB)
                            </p>
                          )}
                        </div>
                      );
                    }
                    if (key === "sex") {
                      return (
                        <div key={key}>
                          <label className="block mb-1 text-gray-700">
                            Sex
                          </label>
                          <select
                            name="sex"
                            value={formDataArr[idx][key]}
                            onChange={(e) => handleChange(idx, e)}
                            required
                            className="w-full border border-gray-300 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-400"
                          >
                            <option value="">Select Sex</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                          </select>
                        </div>
                      );
                    }
                    if (key === "marriageType") {
                      return (
                        <div key={key}>
                          <label className="block mb-1 text-gray-700">
                            Marriage Type
                          </label>
                          <select
                            name="marriageType"
                            value={formDataArr[idx][key]}
                            onChange={(e) => handleChange(idx, e)}
                            required
                            className="w-full border border-gray-300 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-400"
                          >
                            <option value="">Select Marriage Type</option>
                            <option value="civil">Civil</option>
                            <option value="religious">Religious</option>
                            <option value="customary">Customary</option>
                          </select>
                        </div>
                      );
                    }
                    const type =
                      key.includes("date") || key.includes("Date")
                        ? "date"
                        : key === "copies"
                        ? "number"
                        : "text";
                    const placeholder = key
                      .replace(/([A-Z])/g, " $1")
                      .replace(/^./, (str) => str.toUpperCase());
                    return (
                      <div key={key}>
                        <label className="block mb-1 text-gray-700">
                          {placeholder}
                        </label>
                        <input
                          name={key}
                          type={type}
                          placeholder={placeholder}
                          value={formDataArr[idx][key]}
                          onChange={(e) => handleChange(idx, e)}
                          required={
                            ["fullName", "address", "copies"].includes(key) ||
                            {
                              birth: ["personName", "sex", "dob", "place"],
                              marriage: [
                                "maleName",
                                "femaleName",
                                "dateOfMarriage",
                              ],
                              death: [
                                "deceasedName",
                                "dateOfDeath",
                                "placeOfDeath",
                              ],
                            }[["birth", "marriage", "death"][idx]].includes(key)
                          }
                          min={type === "number" ? 1 : undefined}
                          className="w-full border border-gray-300 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-400"
                        />
                      </div>
                    );
                  })}
                  <button
                    type="submit"
                    disabled={submitting || fileErrors[idx]}
                    className={`col-span-2 ${col.bg} ${
                      col.hover
                    } text-white font-semibold py-3 rounded-xl transition ${
                      submitting || fileErrors[idx]
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    }`}
                  >
                    {submitting ? "Submitting..." : `Submit ${title}`}
                  </button>
                </form>
              ) : (
                <button
                  onClick={() => handleStart(idx)}
                  className={`w-full mt-2 py-3 ${col.bg} ${col.hover} text-white font-semibold rounded-xl transition hover:scale-105`}
                >
                  Apply Now
                </button>
              )}
            </section>
          );
        })}
      </div>

      {pendingForm !== null && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl shadow-2xl max-w-sm w-full text-center">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              Are you registered?
            </h2>
            <p className="text-gray-600 mb-6">
              You must be registered to request a certificate.
            </p>
            <div className="flex justify-around">
              <button
                onClick={() => handleModalAnswer(true)}
                className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-xl font-semibold"
              >
                Yes
              </button>
              <button
                onClick={() => handleModalAnswer(false)}
                className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-xl font-semibold"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="text-center mt-8">
        <Link
          href="/pages/services"
          className="text-purple-600 hover:underline"
        >
          ← Back to Services
        </Link>
      </div>
    </div>
  );
}
