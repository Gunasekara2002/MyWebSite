// src/app/pages/disaster-loan/page.jsx
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import BASE_URL from "@/API/config";
import { useAuth } from "@/context/AuthContext";

export default function DisasterLoanPage() {
  const router = useRouter();
  const { user, loading, SignOut } = useAuth();

  const [formData, setFormData] = useState({
    fullName: "",
    nic: "",
    address: "",
    contact: "",
    email: "",
    loanAmount: "",
    reason: "",
    disasterType: "",
    damageDetails: "",
    employmentStatus: "",
    documents: null,
  });
  const [submitting, setSubmitting] = useState(false);

  // Redirect to login if not authenticated
  if (!loading && !user) {
    router.push("/pages/sign-in");
    return null;
  }

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach((key) => {
        if (key === "documents" && formData.documents) {
          Array.from(formData.documents).forEach((file) => {
            formDataToSend.append("documents", file);
          });
        } else if (formData[key] !== null && formData[key] !== "") {
          formDataToSend.append(key, formData[key]);
        }
      });

      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await axios.post(
        `${BASE_URL}/disasterLoan/`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Application submitted successfully!");
      router.push("/pages/services");
    } catch (err) {
      console.error("Submission error:", err);
      if (
        err.response?.status === 401 ||
        err.message === "No authentication token found"
      ) {
        alert("Session expired. Please log in again.");
        SignOut();
      } else if (
        err.response?.status === 400 &&
        err.response?.data?.message.includes("nic")
      ) {
        alert("This NIC number is already registered.");
      } else if (
        err.response?.status === 400 &&
        err.response?.data?.message.includes("user")
      ) {
        alert("User authentication failed. Please log in again.");
        SignOut();
      } else {
        alert(
          err.response?.data?.message || "Submission failed. Please try again."
        );
      }
    } finally {
      setSubmitting(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-500 mx-auto"></div>
          <p className="mt-4 text-purple-700 text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  // Render form
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 flex flex-col items-center justify-center px-4 py-10">
      <div className="w-full max-w-3xl bg-white p-10 rounded-3xl shadow-2xl space-y-8 border border-purple-200">
        {user && (
          <div className="bg-purple-50 p-4 rounded-xl border border-purple-200">
            <p className="text-purple-700">
              Welcome, <span className="font-semibold">{user.name}</span>! Fill
              out the form below to apply for a disaster loan.
            </p>
          </div>
        )}

        <h1 className="text-4xl font-extrabold text-center text-purple-700">
          Disaster Loan Application
        </h1>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input
              type="text"
              name="fullName"
              placeholder="Full Name"
              required
              value={formData.fullName}
              onChange={handleChange}
              className="border border-purple-300 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <input
              type="text"
              name="nic"
              placeholder="NIC Number"
              required
              value={formData.nic}
              onChange={handleChange}
              className="border border-purple-300 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            
            <input
              type="text"
              name="address"
              placeholder="Address"
              required
              value={formData.address}
              onChange={handleChange}
              className="border border-purple-300 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <input
              type="tel"
              name="contact"
              placeholder="Contact Number"
              required
              value={formData.contact}
              onChange={handleChange}
              className="border border-purple-300 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              required
              value={formData.contact}
              onChange={handleChange}
              className="border border-purple-300 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <input
            type="number"
            name="loanAmount"
            placeholder="Loan Amount (LKR)"
            required
            min="0"
            value={formData.loanAmount}
            onChange={handleChange}
            className="w-full border border-pink-300 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400"
          />

          <textarea
            name="reason"
            rows="3"
            placeholder="Reason for the Loan"
            required
            value={formData.reason}
            onChange={handleChange}
            className="w-full border border-indigo-300 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />

          <select
            name="disasterType"
            required
            value={formData.disasterType}
            onChange={handleChange}
            className="w-full border border-purple-300 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="">Select Type of Disaster</option>
            <option value="flood">Flood</option>
            <option value="drought">Drought</option>
            <option value="landslide">Landslide</option>
            <option value="cyclone">Cyclone</option>
            <option value="fire">Fire</option>
            <option value="other">Other</option>
          </select>

          <textarea
            name="damageDetails"
            rows="3"
            placeholder="Describe the Damages"
            required
            value={formData.damageDetails}
            onChange={handleChange}
            className="w-full border border-pink-300 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400"
          />

          <input
            type="text"
            name="employmentStatus"
            placeholder="Employment / Income Status"
            required
            value={formData.employmentStatus}
            onChange={handleChange}
            className="w-full border border-indigo-300 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />

          <div>
            <label className="block text-sm font-medium text-purple-700 mb-1">
              Upload Supporting Documents
            </label>
            <input
              type="file"
              name="documents"
              multiple
              accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
              onChange={handleChange}
              className="w-full bg-purple-50 border border-purple-200 rounded-xl p-2 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-100 file:text-purple-700 hover:file:bg-purple-200"
            />
            <p className="text-xs text-gray-500 mt-1">
              Accepted formats: PDF, JPG, PNG, DOC, DOCX (Max 10MB per file)
            </p>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className={`w-full text-white text-lg font-semibold py-3 rounded-xl shadow-lg transition-all ${
              submitting
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
            }`}
          >
            {submitting ? "Submitting..." : "Submit Application"}
          </button>
        </form>

        <div className="text-center pt-6">
          <Link
            href="/pages/services"
            className="text-purple-600 hover:underline"
          >
            ← Back to Services
          </Link>
        </div>
      </div>
    </div>
  );
}
