"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ShieldCheck,
  Sparkles,
  FileText,
  CarFront,
  X,
  Mail,
  AlertCircle,
} from "lucide-react";
import { FaEnvelope, FaFacebook } from "react-icons/fa";
import { useAuth } from "@/context/AuthContext"; // Adjust path as needed

const services = [
  {
    title: "Disaster Loans",
    description:
      "Emergency financial relief services for natural disasters and emergencies",
    icon: (
      <ShieldCheck className="text-blue-600 w-10 h-10 group-hover:animate-pulse" />
    ),
    color: "blue",
    href: "/pages/disaster-loan",
    bgGradient: "from-blue-50 to-blue-100",
    hoverBg: "hover:from-blue-100 hover:to-blue-200",
  },
  {
    title: "Timber Permits",
    description: "Apply for wood transportation and timber cutting permits",
    icon: (
      <Sparkles className="text-green-600 w-10 h-10 group-hover:animate-bounce" />
    ),
    color: "green",
    href: "/pages/timber-permit",
    bgGradient: "from-green-50 to-green-100",
    hoverBg: "hover:from-green-100 hover:to-green-200",
  },
  {
    title: "Official Certificates",
    description:
      "Birth, death, marriage certificates and official documentation",
    icon: (
      <FileText className="text-amber-600 w-10 h-10 group-hover:animate-pulse" />
    ),
    color: "amber",
    href: "/pages/certificates",
    bgGradient: "from-amber-50 to-amber-100",
    hoverBg: "hover:from-amber-100 hover:to-amber-200",
  },
  {
    title: "Vehicle Revenue Permits",
    description: "Apply for or renew your vehicle permits and licenses",
    icon: (
      <CarFront className="text-pink-600 w-10 h-10 group-hover:animate-bounce" />
    ),
    color: "pink",
    href: "/pages/permits",
    bgGradient: "from-pink-50 to-pink-100",
    hoverBg: "hover:from-pink-100 hover:to-pink-200",
  },
];

export default function Home() {
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [emailInput, setEmailInput] = useState("");
  const [emailError, setEmailError] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const router = useRouter();
  const { user } = useAuth();

  const handleServiceClick = (service) => {
    if (!user) {
      // If user is not logged in, redirect to login
      router.push("/pages/sign-in");
      return;
    }
    // If user is logged in, show email verification modal
    setSelectedService(service);
    setShowEmailModal(true);
    setEmailInput("");
    setEmailError("");
  };
  const handleEmailVerification = () => {
    setEmailError("");
    setIsVerifying(true);

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailInput)) {
      setEmailError("Please enter a valid email address");
      setIsVerifying(false);
      return;
    }

    // Check if entered email matches logged user's email
    if (emailInput.toLowerCase() === user.email.toLowerCase()) {
      // Email matches, allow access
      setTimeout(() => {
        setIsVerifying(false);
        setShowEmailModal(false);
        router.push(selectedService.href);
      }, 1000);
    } else {
      // Email doesn't match, show error and redirect to register/login
      setEmailError("Email does not match your registered account");
      setTimeout(() => {
        setIsVerifying(false);
        setShowEmailModal(false);
        router.push("/pages/register");
      }, 2000);
    }
  };

  const closeModal = () => {
    setShowEmailModal(false);
    setEmailInput("");
    setEmailError("");
    setSelectedService(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 text-white">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative container mx-auto px-6 py-20 text-center">
          <h1 className="text-6xl font-bold mb-6 leading-tight">
            🏛️ Government Services Portal
          </h1>
          <p className="text-xl mb-8 max-w-3xl mx-auto leading-relaxed">
            Fast, reliable, and citizen-friendly access to essential public
            services. Your gateway to efficient government assistance.
          </p>
          <div className="flex justify-center space-x-4">
            <div className="bg-white bg-opacity-20 px-6 py-3 rounded-full">
              <span className="font-semibold text-black">24/7 Available</span>
            </div>
            <div className="bg-white bg-opacity-20 px-6 py-3 rounded-full">
              <span className="font-semibold text-black ">Secure & Trusted</span>
            </div>
          </div>
        </div>
      </div>

      {/* Services Section */}
      <div className="container mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            Our Services
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Access essential government services with just a few clicks. Secure,
            fast, and designed with you in mind.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {services.map((service, idx) => (
            <button
              key={idx}
              onClick={() => handleServiceClick(service)}
              className={`group relative overflow-hidden bg-gradient-to-br ${service.bgGradient} ${service.hoverBg} p-8 rounded-3xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 ease-out text-left w-full border border-gray-100`}
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-white bg-opacity-10 rounded-full -mr-16 -mt-16"></div>
              <div className="relative z-10">
                <div className="flex items-start space-x-6">
                  <div className="flex-shrink-0 p-3 bg-white rounded-2xl shadow-md group-hover:shadow-lg transition-shadow duration-300">
                    {service.icon}
                  </div>
                  <div className="flex-grow">
                    <h3
                      className={`text-2xl font-bold text-${service.color}-800 mb-3`}
                    >
                      {service.title}
                    </h3>
                    <p className="text-gray-700 text-base leading-relaxed mb-4">
                      {service.description}
                    </p>
                    <div
                      className={`inline-flex items-center text-${service.color}-600 font-semibold group-hover:text-${service.color}-800 transition-colors duration-300`}
                    >
                      <span>Get Started</span>
                      <svg
                        className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform duration-300"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* User Status Info */}
        {user && (
          <div className="mt-12 text-center">
            <div className="inline-flex items-center bg-green-100 text-green-800 px-6 py-3 rounded-full">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-3 animate-pulse"></div>
              <span className="font-semibold">
                Welcome back, {user.name || user.email}!
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Email Verification Modal */}
      {showEmailModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Email Verification</h2>
                <button
                  onClick={closeModal}
                  className="text-white hover:text-gray-200 transition-colors duration-200"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="flex items-center mb-6">
                <div className="p-3 bg-blue-100 rounded-full mr-4">
                  <Mail className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">
                    Accessing: {selectedService?.title}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Please verify your email to continue
                  </p>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Enter your registered email address
                </label>
                <input
                  type="email"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="your.email@example.com"
                  disabled={isVerifying}
                />
                {emailError && (
                  <div className="mt-3 flex items-center text-red-600 text-sm">
                    <AlertCircle className="w-4 h-4 mr-2" />
                    {emailError}
                  </div>
                )}
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={closeModal}
                  className="flex-1 py-3 px-6 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors duration-200"
                  disabled={isVerifying}
                >
                  Cancel
                </button>
                <button
                  onClick={handleEmailVerification}
                  disabled={!emailInput.trim() || isVerifying}
                  className="flex-1 py-3 px-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  {isVerifying ? (
                    <div className="flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Verifying...
                    </div>
                  ) : (
                    "Verify & Continue"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-12">
        <div className="container mx-auto px-6">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-6 mb-6">
              <a
                href="mailto:info@welivitiya.gov.lk"
                className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors duration-200"
                aria-label="Email"
              >
                <FaEnvelope className="w-6 h-6" />
                <span>info@welivitiya.gov.lk</span>
              </a>
              <a
                href="https://www.facebook.com/WelivitiyaDivithuraDS"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-gray-300 hover:text-blue-400 transition-colors duration-200"
                aria-label="Facebook"
              >
                <FaFacebook className="w-6 h-6" />
                <span>Follow Us</span>
              </a>
            </div>
            <div className="border-t border-gray-700 pt-6">
              <p className="text-gray-400 mb-2">
                © 2025 Welivitiya Divithura Divisional Secretariat. All rights
                reserved.
              </p>
              <p className="text-gray-400">Developed by the IT Unit</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
