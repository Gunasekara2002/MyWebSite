

/*'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  ClipboardList,
  Users,
  LayoutDashboard,
  UserCircle,
  Calendar,
  BookOpen,
  Settings
} from 'lucide-react';
import API from '@/API/axios';

export default function EmployeeForm() {
  const [formData, setFormData] = useState({
    name: '',
    nic: '',
    address: '',
    phone: '',
    position: '',
    email: '',
    dateofbirth: '',
    dateofappointment: '',
    dateofretirement: ''
  });
  const pathname = usePathname();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/employees', formData);
      alert('Employee data submitted!');
      setFormData({ name: '', nic: '', address: '', phone: '', position: '', email: '', dateofbirth: '',dateofappointment: '',dateofretirement: '',dateofretirement: '' });
    } catch (err) {
      console.error(err);
      alert('Submission failed!');
    }
  };

  // Navigation items
  const navItems = [
    { 
      name: "Dashboard", 
      icon: <Home className="w-5 h-5" />, 
      href: "/pages/employee_dashboard",
      exact: true
    },
    { 
      name: "Personal Information", 
      icon: <Home className="w-5 h-5" />, 
      href: "/pages/personal_info",
      exact: true
    },
    { 
      name: "Leaves", 
      icon: <ClipboardList className="w-5 h-5" />, 
      href: "/pages/leave_form",
      exact: true
    },
    
    
  ];

  // Check if a nav item is active
  const isActive = (href, exact = false) => {
    return exact ? pathname === href : pathname.startsWith(href);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */
      /*<div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64 border-r border-gray-200 bg-white">
          <div className="flex items-center h-16 px-4 border-b border-gray-200">
            <h1 className="text-xl font-bold text-gray-800">Employee Portal</h1>
          </div>
          <div className="flex flex-col flex-grow p-4 overflow-y-auto">
            <nav className="flex-1 space-y-2">
              {navItems.map((item) => (
                <div key={item.name}>
                  <Link
                    href={item.href}
                    className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200 ${
                      isActive(item.href, item.exact)
                        ? "bg-blue-50 text-blue-600"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    <span className="mr-3">{item.icon}</span>
                    {item.name}
                  </Link>
                  
                  {/* Sub-items - only show if parent is active */
                  /*{item.subItems && isActive(item.href) && (
                    <div className="ml-8 mt-1 space-y-1">
                      {item.subItems.map((subItem) => (
                        <Link
                          key={subItem.name}
                          href={subItem.href}
                          className={`flex items-center px-3 py-2 text-sm rounded-lg transition-colors duration-200 ${
                            pathname === subItem.href
                              ? "bg-blue-100 text-blue-600"
                              : "text-gray-600 hover:bg-gray-100"
                          }`}
                        >
                          <span className="mr-3">{subItem.icon}</span>
                          {subItem.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>
          </div>
        </div>
      </div>

      {/* Main content */
      /*<div className="flex-1 overflow-auto">
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-50 to-white p-4">
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-xl space-y-6 rounded-2xl bg-white p-10 shadow-xl ring-1 ring-gray-200"
          >
            <h2 className="text-center text-2xl font-extrabold text-indigo-600 drop-shadow-sm">
              Employee Registration
            </h2>

            {/* two-column grid on medium+ screens */
            /*<div className="grid gap-5 md:grid-cols-2">
              <Input
                label="Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
              <Input
                label="NIC"
                name="nic"
                value={formData.nic}
                onChange={handleChange}
              />
              <Input
                label="Address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="md:col-span-2"
              />
              <Input
                label="Phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
              />
              <Input
                label="Position"
                name="position"
                value={formData.position}
                onChange={handleChange}
              />
              <Input
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className="md:col-span-2"
              />
              <Input
                label="Date of Birth"
                name="dateofbirth"
                type="date"
                value={formData.dateofbirth}
                onChange={handleChange}
              />
              <Input
                label="Date of appointment"
                name="dateofappointment"
                type="date"
                value={formData.dateofappointment}
                onChange={handleChange}
              />
              <Input
                label="Date of Retirement"
                name="dateofretirement"
                type="date"
                value={formData.dateofretirement}
                onChange={handleChange}
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-lg bg-indigo-600 py-3 font-semibold text-white shadow-sm transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

function Input({ label, className = '', ...props }) {
  return (
    <label className={`flex flex-col ${className}`}>
      <span className="mb-1 text-sm font-medium text-gray-700">{label}</span>
      <input
        {...props}
        className="rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        required
      />
    </label>
  );
}*/

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, // Using LayoutDashboard for Dashboard
  ClipboardList,   // Using ClipboardList for Leaves
  UserCircle,      // Using UserCircle for Personal Information
  Users,           // Using Users for a potential "Employees" section
  Calendar,        // Using Calendar for Leaves
  BookOpen,        // For sub-item icons (e.g., Register Employee)
  Settings         // For a potential Settings section
} from 'lucide-react';
import API from '@/API/axios'; // Ensure your API path is correct

export default function EmployeeForm() {
  const [formData, setFormData] = useState({
    name: '',
    nic: '',
    address: '',
    phone: '',
    position: '',
    email: '',
    dateofbirth: '',
    dateofappointment: '',
    dateofretirement: ''
  });
  const pathname = usePathname();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Basic client-side validation
      if (!formData.name || !formData.nic || !formData.email || !formData.phone || !formData.position || !formData.address || !formData.dateofbirth || !formData.dateofappointment) {
        alert('Please fill in all required fields.');
        return; // Stop submission if validation fails
      }

      await API.post('/employees', formData);
      alert('Employee data submitted successfully!');
      // Reset form after successful submission
      setFormData({
        name: '',
        nic: '',
        address: '',
        phone: '',
        position: '',
        email: '',
        dateofbirth: '',
        dateofappointment: '',
        dateofretirement: ''
      });
    } catch (err) {
      console.error('Submission failed:', err.response?.data || err.message);
      alert('Submission failed! Please check your input and try again.'); // More informative error
    }
  };

  // Navigation items - Enhanced with better icons and potential sub-items
  const navItems = [
    {
      name: "Dashboard",
      icon: <LayoutDashboard className="w-5 h-5" />,
      href: "/pages/employee_dashboard",
      exact: true
    },
    {
      name: "Personal Information",
      icon: <UserCircle className="w-5 h-5" />,
      href: "/pages/personal_info",
      exact: true
    },
    {
      name: "Leaves",
      icon: <Calendar className="w-5 h-5" />,
      href: "/pages/leave_form",
      exact: true
    },
    
  ];

  // Check if a nav item is active
  const isActive = (href, exact = false) => {
    return exact ? pathname === href : pathname.startsWith(href);
  };

  return (
    <div className="flex min-h-screen bg-gray-100 font-sans antialiased">
      {/* Sidebar - Professional Styling */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64 bg-white border-r border-gray-200 shadow-lg">
          {/* Sidebar Header */}
          <div className="flex items-center justify-center h-20 px-4 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-md">
            <h1 className="text-2xl font-extrabold tracking-wide">Employee Dashboard</h1>
          </div>
          {/* Navigation Links */}
          <div className="flex flex-col flex-grow p-4 overflow-y-auto">
            <nav className="flex-1 space-y-2">
              {navItems.map((item) => (
                <div key={item.name}>
                  <Link
                    href={item.href}
                    className={`
                      flex items-center px-4 py-3 text-sm font-semibold rounded-lg transition-all duration-200 ease-in-out
                      ${isActive(item.href, item.exact)
                        ? "bg-blue-100 text-blue-700 shadow-sm"
                        : "text-gray-700 hover:bg-gray-50 hover:text-blue-600"}
                    `}
                  >
                    <span className="mr-3">{item.icon}</span>
                    {item.name}
                  </Link>

                  {/* Sub-items - only show if parent is active */}
                  {item.subItems && isActive(item.href) && (
                    <div className="ml-7 mt-1 space-y-1 border-l-2 border-blue-200 pl-3">
                      {item.subItems.map((subItem) => (
                        <Link
                          key={subItem.name}
                          href={subItem.href}
                          className={`
                            flex items-center px-3 py-2 text-sm rounded-lg transition-colors duration-200
                            ${pathname === subItem.href
                              ? "bg-blue-50 text-blue-600"
                              : "text-gray-600 hover:bg-gray-100"}
                          `}
                        >
                          <span className="mr-2 text-base">{subItem.icon}</span>
                          {subItem.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>
          </div>
        </div>
      </div>

      {/* Main content area */}
      <div className="flex-1 overflow-auto">
        {/* Form Container */}
        <div className="flex min-h-screen items-center justify-center p-6 bg-gradient-to-br from-blue-50 to-indigo-100">
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-2xl space-y-7 rounded-2xl bg-white p-10 shadow-2xl ring-1 ring-gray-200 transform transition-all duration-300 hover:shadow-3xl"
          >
            <h2 className="text-center text-3xl font-extrabold text-indigo-700 drop-shadow-sm mb-6">
              Employee Personal Information Form
            </h2>

            {/* Input fields in a responsive grid */}
            <div className="grid gap-6 md:grid-cols-2">
              <Input
                label="Full Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g., John Doe"
                type="text" // Explicitly define type
              />
              <Input
                label="NIC Number"
                name="nic"
                value={formData.nic}
                onChange={handleChange}
                placeholder="e.g., 199012345678 or 901234567V"
                type="text"
              />
              <Input
                label="Residential Address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="md:col-span-2"
                placeholder="e.g., 123 Main Street, Colombo 05"
                type="text"
              />
              <Input
                label="Phone Number"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                placeholder="e.g., 0771234567"
              />
              <Input
                label="Position / Designation"
                name="position"
                value={formData.position}
                onChange={handleChange}
                placeholder="e.g., Software Engineer"
                type="text"
              />
              <Input
                label="Email Address"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className="md:col-span-2"
                placeholder="e.g., john.doe@example.com"
              />
              <Input
                label="Date of Birth"
                name="dateofbirth"
                type="date"
                value={formData.dateofbirth}
                onChange={handleChange}
              />
              <Input
                label="Date of Appointment"
                name="dateofappointment"
                type="date"
                value={formData.dateofappointment}
                onChange={handleChange}
              />
              <Input
                label="Date of Retirement"
                name="dateofretirement"
                type="date"
                value={formData.dateofretirement}
                onChange={handleChange}
                required={false} // Make retirement date optional, if applicable
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full rounded-lg bg-blue-600 py-3 font-semibold text-white shadow-md transition-all duration-200 hover:bg-blue-700 focus:outline-none focus:ring-3 focus:ring-blue-400 focus:ring-offset-2 hover:scale-[1.01]"
            >
              Register Employee
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

// Reusable Input Component
function Input({ label, className = '', required = true, ...props }) { // Added required prop
  return (
    <label className={`flex flex-col ${className}`}>
      <span className="mb-1 text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>} {/* Indicate required fields */}
      </span>
      <input
        {...props}
        className="
          rounded-md border border-gray-300 px-4 py-2 text-base shadow-sm
          placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500
          transition duration-150 ease-in-out
        "
        required={required} // Apply required attribute based on prop
      />
    </label>
  );
}
