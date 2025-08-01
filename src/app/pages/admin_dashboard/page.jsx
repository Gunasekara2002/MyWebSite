


'use client';

import React from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import { Line, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

// Register chart components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend
);

// Line Chart Data
const weeklyActivityData = {
  labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  datasets: [
    {
      label: "Check-ins",
      data: [90, 85, 80, 88, 92, 45, 38],
      borderColor: "#4f46e5",
      backgroundColor: "rgba(79, 70, 229, 0.1)",
      borderWidth: 2,
      tension: 0.4,
      pointBackgroundColor: "#fff",
      pointBorderColor: "#4f46e5",
      pointBorderWidth: 2,
      pointRadius: 4,
      pointHoverRadius: 6,
    },
    {
      label: "Check-outs",
      data: [88, 83, 79, 86, 90, 43, 35],
      borderColor: "#10b981",
      backgroundColor: "rgba(16, 185, 129, 0.1)",
      borderWidth: 2,
      tension: 0.4,
      pointBackgroundColor: "#fff",
      pointBorderColor: "#10b981",
      pointBorderWidth: 2,
      pointRadius: 4,
      pointHoverRadius: 6,
    },
  ],
};

// Doughnut Chart Data
const departmentData = {
  labels: ["IT", "Accounting", "Department of Social Services", "Social Welfare Sector", "Operations", "Human Resources"],
  datasets: [{
    data: [35, 20, 10, 15, 12, 8],
    backgroundColor: [
      "#4f46e5",
      "#10b981",
      "#f59e0b",
      "#ef4444",
      "#8b5cf6",
      "#ec4899"
    ],
    borderWidth: 0,
    hoverOffset: 10,
  }],
};

export default function AdminDashboard() {
  return (
    <AdminLayout>
      <div className="px-6 py-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            Dashboard Overview
          </h2>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Last updated: {new Date().toLocaleDateString()}
          </div>
        </div>

        {/* Metrics Grid */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <MetricCard
            title="Total Employees"
            value="124"
            change="+12"
            changeType="positive"
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            }
          />
          <MetricCard
            title="Present Today"
            value="98"
            change="79%"
            changeType="neutral"
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          />
          <MetricCard
            title="On Leave"
            value="8"
            change="6%"
            changeType="negative"
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          />
          <MetricCard
            title="Active Projects"
            value="16"
            change="3 due"
            changeType="warning"
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            }
          />
        </section>

        {/* Charts Section */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
          <ChartCard 
            title="Weekly Activity"
            description="Check-ins vs check-outs for the past week"
          >
            <Line 
              data={weeklyActivityData} 
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: 'top',
                  },
                  tooltip: {
                    mode: 'index',
                    intersect: false,
                  }
                },
                scales: {
                  y: {
                    beginAtZero: false,
                    min: 30,
                    max: 100
                  }
                }
              }}
            />
          </ChartCard>
          <ChartCard 
            title="Department Distribution"
            description="Employee count by department"
          >
            <Doughnut 
              data={departmentData} 
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: 'right',
                  },
                },
                cutout: '70%'
              }}
            />
          </ChartCard>
        </section>
      </div>
    </AdminLayout>
  );
}

// Metric Card Component
function MetricCard({ title, value, change, changeType, icon }) {
  const changeColors = {
    positive: "text-green-600 bg-green-100",
    negative: "text-red-600 bg-red-100",
    neutral: "text-blue-600 bg-blue-100",
    warning: "text-yellow-600 bg-yellow-100"
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
            {title}
          </p>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
            {value}
          </h3>
        </div>
        <div className={`p-2 rounded-lg ${changeColors[changeType]}`}>
          {icon}
        </div>
      </div>
      <div className="mt-4">
        <span className={`text-xs font-medium px-2 py-1 rounded-full ${changeColors[changeType]}`}>
          {change}
        </span>
      </div>
    </div>
  );
}

// Chart Card Component
function ChartCard({ title, description, children }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {title}
        </h3>
        {description && (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {description}
          </p>
        )}
      </div>
      <div className="h-80">
        {children}
      </div>
    </div>
  );
}
