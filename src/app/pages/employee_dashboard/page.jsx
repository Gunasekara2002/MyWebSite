
'use client';
import { useRouter } from 'next/navigation';
import { FaUser, FaCalendarAlt, FaSitemap, FaAngleRight, FaAngleDown, FaSignOutAlt } from 'react-icons/fa';
import { useState } from 'react';

const links = [
  { label: "Personal Information", path: "/pages/personal_info", icon: <FaUser className="mr-3" /> },
  { label: "Leave Application", path: "/pages/leave_form", icon: <FaCalendarAlt className="mr-3" /> },
];

const OrgNode = ({ node, level = 0 }) => {
  const [isOpen, setIsOpen] = useState(level < 2); // Auto-expand first two levels
  const hasChildren = node.children && node.children.length > 0;
  const colors = ['text-blue-600', 'text-green-600', 'text-purple-600', 'text-orange-600'];
  const bgColors = ['bg-blue-50', 'bg-green-50', 'bg-purple-50', 'bg-orange-50'];
  const borderColors = ['border-blue-200', 'border-green-200', 'border-purple-200', 'border-orange-200'];

  return (
    <div className={`ml-${level === 0 ? 0 : 4} my-1`}>
      <div 
        className={`flex items-center cursor-pointer hover:${bgColors[level % 4]} p-2 rounded-lg transition-all duration-200 ${hasChildren ? 'font-semibold' : ''}`}
        onClick={() => hasChildren && setIsOpen(!isOpen)}
      >
        {hasChildren ? (
          isOpen ? (
            <FaAngleDown className={`mr-3 ${colors[level % 4]} text-sm`} />
          ) : (
            <FaAngleRight className={`mr-3 ${colors[level % 4]} text-sm`} />
          )
        ) : (
          <span className="w-6"></span>
        )}
        <span className={`${colors[level % 4]}`}>{node.title}</span>
      </div>
      {hasChildren && isOpen && (
        <div className={`border-l-2 ${borderColors[level % 4]} ml-4 pl-4`}>
          {node.children.map((child, index) => (
            <OrgNode key={index} node={child} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
};

export default function EmployeeDashboard() {
  const router = useRouter();

  const orgStructure = {
    title: "Divisional Secretary",
    children: [
      {
        title: "Assistant Divisional Secretary",
        children: [
          {
            title: "Administrative Officer",
            children: [
              { title: "Staff Officer" },
              { title: "Development Office" },
              { title: "Office Assistant" }
            ]
          },
          { title: "Management Assistant" }
        ]
      },
      {
        title: "Assistant Director",
        children: [
          {
            title: "Assistant Development Officer",
            children: [
              { title: "Managerial Assistant" },
              { title: "Assistant Officer" },
              { title: "Assistant Officer" }
            ]
          }
        ]
      }
    ]
  };

  const handleLogout = () => {
    router.push('/');
  };

  return (
    <div className="flex min-h-screen bg-purple-70">
      {/* Sidebar */}
      <div className="w-64 bg-indigo-800 text-shadow-purple-900 p-6 shadow-lg">
        <h2 className="text-2xl font-bold mb-10 flex items-center">
          <FaSitemap className="mr-3 text-indigo-800" />
          Employee Portal
        </h2>
        <ul className="space-y-3">
          <li
            className="hover:bg-indigo-700 p-3 rounded-lg cursor-pointer flex items-center bg-indigo-700/90"
            onClick={() => router.push('/employee_dashboard')}
          >
            <FaSitemap className="mr-3 text-indigo-200" />
            <span className="font-medium">Dashboard</span>
          </li>
          {links.map((item, index) => (
            <li
              key={index}
              onClick={() => router.push(item.path)}
              className="hover:bg-indigo-700 p-3 rounded-lg cursor-pointer flex items-center transition-colors"
            >
              {item.icon}
              <span className="font-medium">{item.label}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 overflow-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Welcome Back,</h1>
            <p className="text-gray-600">Here's your organizational overview</p>
          </div>
          <button
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center"
            onClick={handleLogout}
          >
            <FaSignOutAlt className="mr-2" />
            Logout
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center">
              <FaSitemap className="mr-3 text-indigo-500" />
              Divisional Secretariat Structure
            </h2>
            <span className="text-sm text-gray-500">Last updated: 2025.06.17</span>
          </div>
          
          <div className="tree-view pl-2">
            <OrgNode node={orgStructure} />
          </div>

          <div className="mt-8 pt-4 border-t border-gray-100 text-right">
            <p className="text-xs text-gray-400">vivo YTs • 2025.06.17 19:08</p>
          </div>
        </div>
      </div>
    </div>
  );
}
