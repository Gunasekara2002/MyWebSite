
"use client";
import { useEffect, useState } from "react";
import API from "@/API/axios";
import AdminLayout from "@/components/layout/AdminLayout";
import { usePathname } from "next/navigation";
import { FaRegBell, FaSearch } from "react-icons/fa";

export default function LeavesPage() {
  const [leaves, setLeaves] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const pathname = usePathname();

  useEffect(() => {
    API.get("/leaves").then((res) => setLeaves(res.data));
  }, []);

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this leave record?")) {
      try {
        await API.delete(`/leaves/${id}`);
        setLeaves((prev) => prev.filter((leave) => leave._id !== id));
      } catch (err) {
        console.error("Delete failed", err);
      }
    }
  };

  const handleUpdate = async (id) => {
    const updatedVacation = prompt("Enter new Vacation Leave:");
    const updatedCasual = prompt("Enter new Casual Leave:");
    const updatedOther = prompt("Enter new Other Leave:");

    if (
      updatedVacation !== null &&
      updatedCasual !== null &&
      updatedOther !== null
    ) {
      try {
        const updatedLeave = {
          vacationLeave: parseInt(updatedVacation),
          casualLeave: parseInt(updatedCasual),
          otherLeave: parseInt(updatedOther),
          totalTaken:
            parseInt(updatedVacation) +
            parseInt(updatedCasual) +
            parseInt(updatedOther),
        };

        const res = await API.put(`/leaves/${id}`, updatedLeave);
        setLeaves((prev) =>
          prev.map((leave) => (leave._id === id ? res.data : leave))
        );
      } catch (err) {
        console.error("Update failed", err);
      }
    }
  };

  const handlePrint = () => {
    const printContent = document.getElementById("print-section").innerHTML;
    const originalContent = document.body.innerHTML;

    document.body.innerHTML = printContent;
    window.print();
    document.body.innerHTML = originalContent;
    window.location.reload(); // Reload to restore app
  };

  const filteredLeaves = leaves.filter(
    (leave) =>
      leave.year === currentYear &&
      (leave.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        leave.position.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const leaveTypes = ["Vacation", "Casual", "Other"];
  const leaveStats = leaveTypes.map((type) => ({
    type,
    total: filteredLeaves.reduce(
      (sum, leave) => sum + leave[`${type.toLowerCase()}Leave`],
      0
    ),
  }));

  return (
    <AdminLayout>
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm z-10">
          <div className="flex items-center justify-between px-6 py-4">
            <h1 className="text-2xl font-bold text-gray-800">
              Leave Management
            </h1>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search employees..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button className="p-2 text-gray-500 hover:text-gray-700 relative">
                <FaRegBell className="text-xl" />
                <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
              </button>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-sm font-medium text-gray-500 mb-1">
                Total Employees
              </h3>
              <p className="text-2xl font-bold text-gray-800">
                {new Set(filteredLeaves.map((l) => l.employeeName)).size}
              </p>
            </div>
            {leaveStats.map((stat, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
              >
                <h3 className="text-sm font-medium text-gray-500 mb-1">
                  {stat.type} Leaves
                </h3>
                <p className="text-2xl font-bold text-gray-800">{stat.total}</p>
              </div>
            ))}
          </div>

          {/* Year Selector */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex space-x-2">
              {[currentYear - 1, currentYear, currentYear + 1].map((year) => (
                <button
                  key={year}
                  onClick={() => setCurrentYear(year)}
                  className={`px-4 py-2 rounded-lg ${
                    year === currentYear
                      ? "bg-blue-600 text-white"
                      : "bg-white text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {year}
                </button>
              ))}
            </div>
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Print Data
            </button>
          </div>

          {/* Leaves Table */}
          <div
            id="print-section"
            className="bg-white rounded-xl shadow-sm overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {[
                      "Employee",
                      "Position",
                      "Vacation",
                      "Casual",
                      "Other",
                      "Total",
                      "Carry Over",
                      "Actions",
                    ].map((head) => (
                      <th
                        key={head}
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        {head}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredLeaves.length > 0 ? (
                    filteredLeaves.map((leave, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                              <span className="text-blue-600 font-medium">
                                {leave.employeeName.charAt(0)}
                              </span>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {leave.employeeName}
                              </div>
                              <div className="text-sm text-gray-500">
                                {leave.employeeId}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {leave.position}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              leave.vacationLeave > 10
                                ? "bg-red-100 text-red-800"
                                : "bg-green-100 text-green-800"
                            }`}
                          >
                            {leave.vacationLeave} days
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm">
                          {leave.casualLeave} days
                        </td>
                        <td className="px-6 py-4 text-sm">
                          {leave.otherLeave} days
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">
                          {leave.totalTaken} days
                        </td>
                        <td className="px-6 py-4 text-sm">
                          {leave.carryOver} days
                        </td>
                        <td className="px-6 py-4 text-sm font-medium print:hidden">
                          <button
                            onClick={() => handleUpdate(leave._id)}
                            className="text-blue-600 hover:text-blue-900 mr-3"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(leave._id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="8"
                        className="px-6 py-4 text-center text-sm text-gray-500"
                      >
                        No leave records found for {currentYear}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </AdminLayout>
  );
}

