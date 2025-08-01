"use client";

import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  FaBars,
  FaTimes,
  FaUsers,
  FaCalendarCheck,
  FaProjectDiagram,
  FaCog,
  FaBell,
  FaMoon,
  FaSun,
} from "react-icons/fa";

const navLinks = [
  { label: "Dashboard", path: "/pages/admin_dashboard", icon: FaCalendarCheck },
  { label: "Employees", path: "/pages/employees", icon: FaUsers },
  { label: "Leaves", path: "/pages/admin_leaves", icon: FaCalendarCheck },
  { label: "services", path: "/pages/admin_services", icon: FaProjectDiagram },
  { label: "subsidies", path: "/pages/admin_subsidies", icon: FaCog },
];

export default function AdminLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [dark, setDark] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  return (
    <div className="flex h-screen overflow-hidden bg-purple-400 dark:bg-slate-900">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "w-64" : "w-0"
        } bg-purple-200 dark:bg-slate-800 shadow-lg transition-[width] duration-300 overflow-y-auto`}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 dark:border-slate-700">
          <h1 className="text-2xl font-black tracking-tight text-indigo-600 dark:text-indigo-400">
            Admin Dashboard
          </h1>
          <button
            className="md:hidden text-slate-600 dark:text-slate-300"
            onClick={() => setSidebarOpen(false)}
          >
            <FaTimes size={22} />
          </button>
        </div>

        <nav className="px-4 py-6 space-y-1">
          {navLinks.map(({ label, path, icon: Icon }) => {
            const active = pathname === path;
            return (
              <button
                key={label}
                onClick={() => router.push(path)}
                className={`flex items-center w-full gap-3 rounded-lg px-3 py-2 text-sm font-medium
                  transition
                  ${
                    active
                      ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-200"
                      : "text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-700/40"
                  }`}
              >
                <Icon size={16} />
                {label}
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Main panel */}
      <div className="flex flex-col flex-1">
        {/* Top-bar */}
      

        {/* Main content */}
        <main className="flex-1 overflow-y-auto p-8">{children}</main>
      </div>
    </div>
  );
}
