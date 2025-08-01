// src/app/pages/timber-permit/page.jsx
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import BASE_URL from "@/API/config";
import { useAuth } from "@/context/AuthContext";

export default function TimberPermitForm() {
  const router = useRouter();
  const { user, loading, SignOut } = useAuth();

  const [formData, setFormData] = useState({
    fullName: "",
    route: "",
    timberDetails: "",
    permitLetter: null,
  });
  const [submitting, setSubmitting] = useState(false);
  const [fileError, setFileError] = useState(""); // For client-side file validation

  // Redirect to login if not authenticated
  if (!loading && !user) {
    router.push("/pages/login");
    return null;
  }

  const validateFile = (file) => {
    if (!file) return "Please upload a permit request letter.";
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
    return "";
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "permitLetter" && files[0]) {
      const error = validateFile(files[0]);
      setFileError(error);
      setFormData((prev) => ({
        ...prev,
        [name]: error ? null : files[0],
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: files ? files[0] : value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (fileError || !formData.permitLetter) {
      alert(
        "Please fix the file upload issue: " +
          (fileError || "No file selected.")
      );
      return;
    }
    setSubmitting(true);

    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach((key) => {
        if (key === "permitLetter" && formData.permitLetter) {
          formDataToSend.append("permitLetter", formData.permitLetter);
        } else if (formData[key] !== null && formData[key] !== "") {
          formDataToSend.append(key, formData[key]);
        }
      });

      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await axios.post(
        `${BASE_URL}/timberPermit/`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Permit request submitted successfully!");
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
        if (message.includes("permitLetter")) {
          alert("Invalid permit letter: " + message);
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

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-100 via-lime-100 to-emerald-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-500 mx-auto"></div>
          <p className="mt-4 text-green-700 text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  // Render form
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 via-lime-100 to-emerald-100 flex flex-col items-center justify-center px-4 py-10">
      <div className="w-full max-w-3xl bg-white p-10 rounded-3xl shadow-2xl space-y-8 border border-green-200">
        {user && (
          <div className="bg-green-50 p-4 rounded-xl border border-green-200">
            <p className="text-green-700">
              Welcome, <span className="font-semibold">{user.name}</span>! Fill
              out the form below to apply for a timber transportation permit.
            </p>
          </div>
        )}

        <h1 className="text-4xl font-extrabold text-center text-green-700">
          Timber Transportation Permit
        </h1>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <input
            type="text"
            name="fullName"
            placeholder="Full Name"
            required
            value={formData.fullName}
            onChange={handleChange}
            className="w-full border border-green-300 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400"
          />

          <input
            type="text"
            name="route"
            placeholder="Transportation Route"
            required
            value={formData.route}
            onChange={handleChange}
            className="w-full border border-lime-300 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-lime-400"
          />

          <textarea
            name="timberDetails"
            rows="3"
            placeholder="Type & Quantity of Timber"
            required
            value={formData.timberDetails}
            onChange={handleChange}
            className="w-full border border-emerald-300 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400"
          />

          <div>
            <label className="block text-sm font-medium text-green-700 mb-1">
              Upload Permit Request Letter
            </label>
            <input
              type="file"
              name="permitLetter"
              required
              accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
              onChange={handleChange}
              className="w-full bg-green-50 border border-green-200 rounded-xl p-2 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-100 file:text-green-700 hover:file:bg-green-200"
            />
            <p className="text-xs text-gray-500 mt-1">
              Accepted formats: JPG, JPEG, PNG, PDF, DOC, DOCX (Max 10MB)
            </p>
            {fileError && (
              <p className="text-sm text-red-600 mt-1">{fileError}</p>
            )}
            {formData.permitLetter && !fileError && (
              <p className="text-sm text-gray-600 mt-1">
                Selected: {formData.permitLetter.name}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={submitting || fileError}
            className={`w-full text-white text-lg font-semibold py-3 rounded-xl shadow-lg transition-all ${
              submitting || fileError
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-lime-500 to-green-500 hover:from-lime-600 hover:to-green-600"
            }`}
          >
            {submitting ? "Submitting..." : "Submit Request"}
          </button>
        </form>

        <div className="text-center pt-6">
          <Link
            href="/pages/services"
            className="text-green-600 hover:underline"
          >
            ← Back to Services
          </Link>
        </div>
      </div>
    </div>
  );
}
