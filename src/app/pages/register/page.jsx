

/*'use client';
import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

const Register = () => {
  const { register, loading, error, setError } = useAuth();
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "user" // default role
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const userPayload = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role
      };

      await register(userPayload);

      localStorage.setItem("registeredEmail", formData.email.trim().toLowerCase());
      
      router.push("/pages/sign-in");
    } catch (err) {
      console.error("Registration failed:", err);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-100 via-purple-200 to-purple-300">
      <form
        className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-md"
        onSubmit={handleSubmit}
      >
        <h1 className="text-4xl font-extrabold text-center text-purple-700 mb-6">Register</h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4">
            {error}
          </div>
        )}

        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          className="w-full p-3 mb-4 border-2 border-purple-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="w-full p-3 mb-4 border-2 border-purple-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="w-full p-3 mb-4 border-2 border-purple-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
          required
        />

        {/* Role selection */
        /*<select
          name="role"
          value={formData.role}
          onChange={handleChange}
          className="w-full p-3 mb-4 border-2 border-purple-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
          required
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
          <option value="employees">Employees</option>
        </select>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 rounded-xl font-bold text-white transition duration-200 ${
            loading ? "bg-purple-400 cursor-not-allowed" : "bg-purple-600 hover:bg-purple-700"
          }`}
        >
          {loading ? "Registering..." : "Register"}
        </button>

        <p className="text-center mt-6 text-sm text-gray-800 font-medium">
          Already have an account?{" "}
          <Link href="/pages/sign-in" className="text-purple-700 underline font-semibold">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Register;*/

'use client';
import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

const Register = () => {
  const { register, loading, error, setError } = useAuth();
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "user"
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const userPayload = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role
      };

      await register(userPayload);
      localStorage.setItem("registeredEmail", formData.email.trim().toLowerCase());
      router.push("/pages/sign-in");
    } catch (err) {
      console.error("Registration failed:", err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-[url('/backgrounds/subtle-pattern.png')] opacity-10"></div>
      
      <div className="relative z-10 w-full max-w-md px-4">
        <form 
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded-xl shadow-lg border border-gray-200"
        >
          {/* Logo/Header Section */}
          <div className="text-center mb-6">
            <div className="mx-auto w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-800">Create Account</h1>
            <p className="text-gray-600 text-sm mt-1">Register to access the system</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4 text-sm">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="john@example.com"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                required
              />
            </div>

            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">Account Type</label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                required
              >
                <option value="user">General User</option>
                <option value="admin"></option>
                <option value="employees">Staff Member</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                loading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Registering...
                </>
              ) : 'Register'}
            </button>
          </div>

          <div className="mt-6 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link 
              href="/pages/sign-in" 
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              Sign in here
            </Link>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200 text-center text-xs text-gray-500">
            By registering, you agree to our Terms of Service and Privacy Policy
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
