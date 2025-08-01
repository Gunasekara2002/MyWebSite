"use client";
import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext"; // Adjust path as needed

const My_Navbar = () => {
  const { user, SignOut } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    SignOut();
    setIsDropdownOpen(false);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <nav className="bg-gradient-to-r from-purple-500 via-red-400 to-yellow-500 shadow-lg p-5 flex justify-between items-center">
      <div className="flex space-x-6 items-center">
        <Image
          src="/srilanka.png"
          alt="Logo"
          width={65}
          height={65}
          className="rounded-full"
        />
        <Link
          href="/pages/home"
          className="text-white font-bold hover:text-yellow-200 transition duration-300"
        >
          Home
        </Link>
        <Link
          href="/pages/services"
          className="text-white font-bold hover:text-yellow-200 transition duration-300"
        >
          Services
        </Link>
        <Link
          href="/pages/subsides"
          className="text-white font-bold hover:text-yellow-200 transition duration-300"
        >
          Subsidies
        </Link>
        <Link
          href="/pages/our_project"
          className="text-white font-bold hover:text-yellow-200 transition duration-300"
        >
          Our Project
        </Link>
        <Link
          href="/pages/about_us"
          className="text-white font-bold hover:text-yellow-200 transition duration-300"
        >
          About Us
        </Link>
      </div>

      {/* Authentication Section */}
      <div className="flex items-center">
        {user ? (
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={toggleDropdown}
              className="flex items-center space-x-2 text-white font-bold hover:text-yellow-200 transition duration-300 focus:outline-none"
            >
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                <span className="text-pink-500 font-bold text-sm">
                  {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                </span>
              </div>
              <span className="hidden sm:block">
                Welcome, {user.name || user.email}
              </span>
              <svg
                className={`w-4 h-4 transition-transform duration-200 ${
                  isDropdownOpen ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                <div className="px-4 py-2 text-sm text-gray-700 border-b border-gray-100">
                  <div className="font-medium">{user.name || "User"}</div>
                  <div className="text-gray-500 text-xs truncate">
                    {user.email}
                  </div>
                </div>
                <Link
                  href="/pages/employee_dashboard"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition duration-200"
                  onClick={() => setIsDropdownOpen(false)}
                >
                 Dashboard
                </Link>
                <Link
                  href="/pages/settings"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition duration-200"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  Settings
                </Link>
                <div className="border-t border-gray-100">
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition duration-200"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <Link
            href="/pages/sign-in"
            className="text-white font-bold hover:text-yellow-200 transition duration-300"
          >
            Sign In
          </Link>
        )}
      </div>
    </nav>
  );
};

export default My_Navbar;
