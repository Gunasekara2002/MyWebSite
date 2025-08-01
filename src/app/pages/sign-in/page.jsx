


'use client';
import React, { useState } from 'react';
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

const Signin = () => {
  const router = useRouter();
  const { SignIn, loading, error, setError } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: ''
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
      const user = await SignIn(formData.email, formData.password);

      if (user.role === 'admin') {
        router.push('/pages/admin_dashboard');
      } else if (user.role === 'employees') {
        router.push('/pages/employee_dashboard');
      } else {
        router.push('/');
      }
     
    } catch (err) {
      console.error('Login failed:', err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      {/* Background with professional office image */}
      <div className="absolute inset-0 bg-[url('/backgrounds/office.jpg')] bg-cover bg-center opacity-20"></div>
      
      <div className="relative z-10 w-full max-w-md px-4">
        <form 
          onSubmit={handleSubmit} 
          className="bg-white p-8 rounded-xl shadow-lg border border-gray-200"
        >
          {/* Logo Section */}
          <div className="flex justify-center mb-6">
            <div className="bg-blue-600 p-3 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
              </svg>
            </div>
          </div>

          <h1 className="text-2xl font-bold text-center text-gray-800 mb-1">Welcome Divisional Secretariat</h1>
          <p className="text-center text-gray-600 text-sm mb-6">Sign in to your account</p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4 text-sm">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input 
                type="email"
                id="email"
                name="email"
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
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                required
              />
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
                  Signing in...
                </>
              ) : 'Sign in'}
            </button>
          </div>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Don't have an account?
                </span>
              </div>
            </div>

            <div className="mt-6">
              <Link 
                href="/pages/register" 
                className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Register
              </Link>
            </div>
          </div>
        </form>

        <div className="mt-6 text-center text-xs text-gray-500">
          © {new Date().getFullYear()} Divisional Secretariat. All rights reserved.
        </div>
      </div>
    </div>
  );
};

export default Signin;