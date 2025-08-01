"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import BASE_URL from "@/API/config";
import { useAuth } from "@/context/AuthContext";

export default function VehiclePermit() {
  const router = useRouter();
  const { user, loading, SignOut } = useAuth();

  const [formData, setFormData] = useState({
    ownerName: "",
    nic: "",
    email: "",
    phone: "",
    vehicleNumber: "",
    vehicleType: "",
    vehicleModel: "",
    manufactureYear: "",
    engineNumber: "",
    chassisNumber: "",
    permitType: "",
    fuelType: "",
    address: "",
    purpose: "",
    documents: [], // Array for multiple files
  });
  const [submitting, setSubmitting] = useState(false);
  const [fileError, setFileError] = useState("");

  // Redirect to login if not authenticated
  if (!loading && !user) {
    router.push("/pages/login");
    return null;
  }

  const validateFile = (file) => {
    if (!file) return "Please upload at least one document.";
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
      return "Each file must be less than 10MB.";
    }
    return null;
  };

  const validateForm = () => {
    const nicRegex = /^[0-9]{9}[vV]|[0-9]{12}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\+94[0-9]{9}$/;
    const vehicleNumberRegex = /^[A-Z]{1,3}-?[A-Z0-9]{1,7}$/;
    const yearRegex = /^(19[0-9]{2}|20[0-2][0-9]|2030)$/;

    if (!nicRegex.test(formData.nic)) {
      return "Invalid NIC/Passport number (e.g., 123456789V or 123456789123)";
    }
    if (!emailRegex.test(formData.email)) {
      return "Invalid email address";
    }
    if (!phoneRegex.test(formData.phone)) {
      return "Invalid phone number (e.g., +94771234567)";
    }
    if (!vehicleNumberRegex.test(formData.vehicleNumber)) {
      return "Invalid vehicle number (e.g., WP-CAX1234)";
    }
    if (!yearRegex.test(formData.manufactureYear)) {
      return "Invalid manufacture year (1900-2030)";
    }
    if (formData.documents.length === 0) {
      return "At least one document is required";
    }
    return null;
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "documents" && files) {
      const fileArray = Array.from(files);
      let error = null;
      for (const file of fileArray) {
        error = validateFile(file);
        if (error) break;
      }
      setFileError(error);
      setFormData((prev) => ({
        ...prev,
        [name]: error ? [] : fileArray,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formError = validateForm();
    if (formError || fileError) {
      alert(`Please fix the issue: ${formError || fileError}`);
      return;
    }
    setSubmitting(true);

    try {
      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (key === "documents") {
          value.forEach((file) => formDataToSend.append("documents", file));
        } else if (value !== "" && value !== null) {
          formDataToSend.append(key, value);
        }
      });

      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await axios.post(
        `${BASE_URL}/vehiclePermit/`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Vehicle permit application submitted successfully!");
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
        if (message.includes("documents")) {
          alert("Invalid documents: " + message);
        } else if (message.includes("vehicleNumber")) {
          alert("Vehicle number error: " + message);
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

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-tr from-blue-100 via-pink-100 to-yellow-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-blue-700 text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-tr from-blue-100 via-pink-100 to-yellow-100 py-12 px-6">
      <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-2xl p-10 border border-blue-200">
        <h1 className="text-4xl font-extrabold text-center text-blue-700 mb-10">
          Vehicle Revenue Permit Application
        </h1>

        {user && (
          <div className="bg-blue-50 p-4 rounded-xl border border-blue-200 mb-6">
            <p className="text-blue-700">
              Welcome, <span className="font-semibold">{user.name}</span>! Fill
              out the form below to apply for a vehicle permit.
            </p>
          </div>
        )}

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-lg font-medium text-gray-700">
                Owner Full Name
              </label>
              <input
                name="ownerName"
                type="text"
                placeholder="John Doe"
                value={formData.ownerName}
                onChange={handleChange}
                required
                className="w-full mt-2 p-3 border border-blue-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div>
              <label className="block text-lg font-medium text-gray-700">
                NIC / Passport Number
              </label>
              <input
                name="nic"
                type="text"
                placeholder="123456789V or 123456789123"
                value={formData.nic}
                onChange={handleChange}
                required
                className="w-full mt-2 p-3 border border-pink-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400"
              />
            </div>
            <div>
              <label className="block text-lg font-medium text-gray-700">
                Email
              </label>
              <input
                name="email"
                type="email"
                placeholder="example@mail.com"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full mt-2 p-3 border border-purple-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
            </div>
            <div>
              <label className="block text-lg font-medium text-gray-700">
                Phone Number
              </label>
              <input
                name="phone"
                type="tel"
                placeholder="+94771234567"
                value={formData.phone}
                onChange={handleChange}
                required
                className="w-full mt-2 p-3 border border-green-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-lg font-medium text-gray-700">
                Vehicle Number
              </label>
              <input
                name="vehicleNumber"
                type="text"
                placeholder="WP-CAX1234"
                value={formData.vehicleNumber}
                onChange={handleChange}
                required
                className="w-full mt-2 p-3 border border-yellow-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
            </div>
            <div>
              <label className="block text-lg font-medium text-gray-700">
                Vehicle Type
              </label>
              <select
                name="vehicleType"
                value={formData.vehicleType}
                onChange={handleChange}
                required
                className="w-full mt-2 p-3 border border-indigo-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400"
              >
                <option value="">Select Vehicle Type</option>
                <option>Motor Car</option>
                <option>Motorcycle</option>
                <option>Three Wheeler</option>
                <option>Bus</option>
                <option>Lorry</option>
                <option>Other</option>
              </select>
            </div>
            <div>
              <label className="block text-lg font-medium text-gray-700">
                Make & Model
              </label>
              <input
                name="vehicleModel"
                type="text"
                placeholder="Toyota Corolla 2016"
                value={formData.vehicleModel}
                onChange={handleChange}
                required
                className="w-full mt-2 p-3 border border-rose-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-400"
              />
            </div>
            <div>
              <label className="block text-lg font-medium text-gray-700">
                Year of Manufacture
              </label>
              <input
                name="manufactureYear"
                type="number"
                placeholder="2016"
                value={formData.manufactureYear}
                onChange={handleChange}
                required
                min="1900"
                max="2030"
                className="w-full mt-2 p-3 border border-teal-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-400"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-lg font-medium text-gray-700">
                Engine Number
              </label>
              <input
                name="engineNumber"
                type="text"
                placeholder="ENG123456"
                value={formData.engineNumber}
                onChange={handleChange}
                required
                className="w-full mt-2 p-3 border border-cyan-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400"
              />
            </div>
            <div>
              <label className="block text-lg font-medium text-gray-700">
                Chassis Number
              </label>
              <input
                name="chassisNumber"
                type="text"
                placeholder="CHS987654"
                value={formData.chassisNumber}
                onChange={handleChange}
                required
                className="w-full mt-2 p-3 border border-lime-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-lime-400"
              />
            </div>
            <div>
              <label className="block text-lg font-medium text-gray-700">
                Permit Type
              </label>
              <select
                name="permitType"
                value={formData.permitType}
                onChange={handleChange}
                required
                className="w-full mt-2 p-3 border border-red-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-400"
              >
                <option value="">Select Permit Type</option>
                <option>New Registration</option>
                <option>Renewal</option>
                <option>Transfer</option>
              </select>
            </div>
            <div>
              <label className="block text-lg font-medium text-gray-700">
                Fuel Type
              </label>
              <select
                name="fuelType"
                value={formData.fuelType}
                onChange={handleChange}
                required
                className="w-full mt-2 p-3 border border-amber-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400"
              >
                <option value="">Select Fuel Type</option>
                <option>Petrol</option>
                <option>Diesel</option>
                <option>Electric</option>
                <option>Hybrid</option>
              </select>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-lg font-medium text-gray-700">
                Residential Address
              </label>
              <textarea
                name="address"
                placeholder="Enter full address"
                rows="3"
                value={formData.address}
                onChange={handleChange}
                required
                className="w-full mt-2 p-3 border border-emerald-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400"
              />
            </div>
            <div>
              <label className="block text-lg font-medium text-gray-700">
                Purpose of Vehicle Use
              </label>
              <select
                name="purpose"
                value={formData.purpose}
                onChange={handleChange}
                required
                className="w-full mt-2 p-3 border border-sky-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-400"
              >
                <option value="">Select Purpose</option>
                <option>Private</option>
                <option>Commercial</option>
                <option>Government</option>
                <option>Tourism</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-lg font-medium text-gray-700 mb-2">
              Upload Supporting Documents
            </label>
            <input
              type="file"
              name="documents"
              multiple
              accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
              onChange={handleChange}
              required
              className="w-full p-3 border border-violet-300 bg-violet-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-400"
            />
            <p className="text-xs text-gray-500 mt-1">
              Accepted formats: JPG, JPEG, PNG, PDF, DOC, DOCX (Max 10MB each,
              up to 10 files)
            </p>
            {fileError && (
              <p className="text-sm text-red-600 mt-1">{fileError}</p>
            )}
            {formData.documents.length > 0 && !fileError && (
              <ul className="text-sm text-gray-600 mt-1">
                {formData.documents.map((file, idx) => (
                  <li key={idx}>
                    {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="text-center pt-6">
            <button
              type="submit"
              disabled={submitting || fileError}
              className={`px-12 py-3 text-lg rounded-full bg-gradient-to-r from-blue-500 via-pink-500 to-yellow-500 text-white font-bold shadow-md hover:shadow-xl transform hover:scale-105 transition duration-300 ${
                submitting || fileError ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {submitting ? "Submitting..." : "Submit Application"}
            </button>
          </div>

          <div className="text-center pt-4">
            <Link
              href="/pages/services"
              className="text-blue-600 hover:underline"
            >
              ← Back to Services
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
