
/*'use client';
import { useState, useEffect } from 'react';
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

export default function LeaveForm() {
  const [form, setForm] = useState({
    employeeName: '',
    position: '',
    year: new Date().getFullYear(),
    vacationLeave: '',
    casualLeave: '',
    otherLeave: '',
    carryOver: '',
  });
  const [records, setRecords] = useState([]);
  const pathname = usePathname();

  useEffect(() => {
    API.get('/leaves').then(res => setRecords(res.data));
  }, []);

  const handleChange = ({ target }) =>
    setForm({ ...form, [target.name]: target.value });

  const handleSubmit = async e => {
    e.preventDefault();

    const totalTaken =
      Number(form.vacationLeave || 0) +
      Number(form.casualLeave || 0) +
      Number(form.otherLeave || 0);

    await API.post('/leaves', { ...form, totalTaken });

    const res = await API.get('/leaves');
    setRecords(res.data);

    setForm({
      employeeName: '',
      position: '',
      year: new Date().getFullYear(),
      vacationLeave: '',
      casualLeave: '',
      otherLeave: '',
      carryOver: '',
    });
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
      icon: <ClipboardList className="w-5 h-5" />, 
      href: "/pages/personal_info",
      exact: true
    },
    
    { 
      name: "Leave Form", 
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
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */
     /* <div className="hidden md:flex md:flex-shrink-0">
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
      /*<div className="flex-1 overflow-auto p-8">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold mb-6">Leave Summary Form</h2>
          <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow space-y-4">
            <Input label="Employee Name" name="employeeName" value={form.employeeName} onChange={handleChange} />
            <Input label="Position" name="position" value={form.position} onChange={handleChange} />
            <Input label="Year" name="year" type="number" value={form.year} onChange={handleChange} />
            <Input label="Vacation Leave" name="vacationLeave" type="number" value={form.vacationLeave} onChange={handleChange} />
            <Input label="Casual Leave" name="casualLeave" type="number" value={form.casualLeave} onChange={handleChange} />
            <Input label="Other Leave" name="otherLeave" type="number" value={form.otherLeave} onChange={handleChange} />
            <Input label="Carry Over" name="carryOver" type="number" value={form.carryOver} onChange={handleChange} />
            <button className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition-colors">
              Submit
            </button>
          </form>
                      
        </div>
      </div>
    </div>
  );
}

function Input({ label, ...props }) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-gray-700">{label}</span>
      <input 
        {...props} 
        className="w-full border rounded px-3 py-2 mt-1 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none" 
        required 
      />
    </label>
  );
}
*/

'use client';

import { useState, useEffect } from 'react';
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

export default function LeaveForm() {
  const [form, setForm] = useState({
    employeeName: '',
    position: '',
    year: new Date().getFullYear(),
    vacationLeave: '',
    casualLeave: '',
    otherLeave: '',
    carryOver: '',
  });
  
  const [records, setRecords] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const pathname = usePathname();

  useEffect(() => {
    API.get('/leaves').then(res => setRecords(res.data));
  }, []);

  const handleChange = ({ target }) =>
    setForm({ ...form, [target.name]: target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const totalTaken =
        Number(form.vacationLeave || 0) +
        Number(form.casualLeave || 0) +
        Number(form.otherLeave || 0);

      await API.post('/leaves', { ...form, totalTaken });
      const res = await API.get('/leaves');
      setRecords(res.data);

      setForm({
        employeeName: '',
        position: '',
        year: new Date().getFullYear(),
        vacationLeave: '',
        casualLeave: '',
        otherLeave: '',
        carryOver: '',
      });
      
      setSuccessMessage('Leave form submitted successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Submission error:', error);
    } finally {
      setIsSubmitting(false);
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
      icon: <ClipboardList className="w-5 h-5" />,
      href: "/pages/personal_info",
      exact: true
    },
    {
      name: "Leave Form",
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
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="hidden md:flex md:flex-shrink-0">
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
                </div>
              ))}
            </nav>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-auto p-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800">Leave Summary Form</h2>
            <p className="text-gray-600">Submit your leave requests and view your leave balance</p>
          </div>
          
          {successMessage && (
            <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-lg border border-green-200">
              {successMessage}
            </div>
          )}

          <div className="grid grid-cols-1 gap-6">
            {/* Leave Form */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Submit Leave Request</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input label="Employee Name" name="employeeName" value={form.employeeName} onChange={handleChange} />
                  <Input label="Position" name="position" value={form.position} onChange={handleChange} />
                  <Input label="Year" name="year" type="number" value={form.year} onChange={handleChange} />
                  <Input label="Carry Over" name="carryOver" type="number" value={form.carryOver} onChange={handleChange} />
                  <Input label="Vacation Leave" name="vacationLeave" type="number" value={form.vacationLeave} onChange={handleChange} />
                  <Input label="Casual Leave" name="casualLeave" type="number" value={form.casualLeave} onChange={handleChange} />
                  <Input label="Other Leave" name="otherLeave" type="number" value={form.otherLeave} onChange={handleChange} />
                </div>
                
                <div className="pt-2">
                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className={`w-full md:w-auto px-6 py-2.5 rounded-md text-white font-medium ${
                      isSubmitting ? 'bg-indigo-400' : 'bg-indigo-600 hover:bg-indigo-700'
                    } transition-colors duration-200`}
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Request'}
                  </button>
                </div>
              </form>
            </div>

            
          </div>
        </div>
      </div>
    </div>
  );
}

function Input({ label, ...props }) {
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <input
        {...props}
        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        required
      />
    </div>
  );
}
