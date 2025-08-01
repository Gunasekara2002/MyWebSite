"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import BASE_URL from "@/API/config";
import { useAuth } from "@/context/AuthContext";
import {
  FaUser,
  FaWheelchair,
  FaHome,
  FaAppleAlt,
  FaTrash,
  FaEye,
  FaDownload,
  FaCheck,
  FaTimes,
  FaClock,
  FaSearch,
  FaFileAlt,
  FaClipboardList,
} from "react-icons/fa";
import AdminLayout from "@/components/layout/AdminLayout";

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
  approved: "bg-green-100 text-green-800 border-green-200",
  rejected: "bg-red-100 text-red-800 border-red-200",
  under_review: "bg-blue-100 text-blue-800 border-blue-200",
};

const statusIcons = {
  pending: <FaClock className="w-4 h-4" />,
  approved: <FaCheck className="w-4 h-4" />,
  rejected: <FaTimes className="w-4 h-4" />,
  under_review: <FaEye className="w-4 h-4" />,
};

const subsidyIcons = {
  "① Elderly Allowance": <FaUser className="w-5 h-5" />,
  "② Disability Allowance": <FaWheelchair className="w-5 h-5" />,
  "③ Housing Assistance": <FaHome className="w-5 h-5" />,
  "④ Nutrition Allowance": <FaAppleAlt className="w-5 h-5" />,
};

export default function AdminSubsidies() {
  const { user, SignOut } = useAuth();
  const [applications, setApplications] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(""); // 'view', 'edit', 'review', 'delete'
  const [editData, setEditData] = useState({});
  const [reviewData, setReviewData] = useState({
    status: "",
    adminNotes: "",
    rejectionReason: "",
  });

  // Filters and pagination
  const [filters, setFilters] = useState({
    status: "",
    type: "",
    search: "",
  });
  const [pagination, setPagination] = useState({
    current: 1,
    pages: 1,
    total: 0,
  });
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (user && user.role === "admin") {
      fetchApplications();
      fetchStats();
    }
  }, [user, currentPage, filters]);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: "10",
        ...(filters.status && { status: filters.status }),
        ...(filters.type && { type: filters.type }),
      });

      const response = await axios.get(
        `${BASE_URL}/subsidies/admin/all?${params}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      let filteredApplications = response.data.applications || [];

      // Client-side search filter
      if (filters.search) {
        filteredApplications = filteredApplications.filter(
          (app) =>
            app.data?.fullName
              ?.toLowerCase()
              .includes(filters.search.toLowerCase()) ||
            app.data?.nationalIdNumber?.includes(filters.search) ||
            app.user?.email
              ?.toLowerCase()
              .includes(filters.search.toLowerCase())
        );
      }

      setApplications(filteredApplications);
      setPagination(
        response.data.pagination || { current: 1, pages: 1, total: 0 }
      );
    } catch (error) {
      console.error("Error fetching applications:", error);
      if (error.response?.status === 401) {
        SignOut();
      }
      // Set empty state on error
      setApplications([]);
      setPagination({ current: 1, pages: 1, total: 0 });
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${BASE_URL}/subsidies/admin/stats`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setStats(response.data);
    } catch (error) {
      console.error("Error fetching stats:", error);
      // Set default stats on error
      setStats({
        totalApplications: 0,
        statusStats: [],
        typeStats: [],
      });
    }
  };

  const handleStatusUpdate = async (applicationId, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${BASE_URL}/subsidies/admin/${applicationId}/status`,
        { status: newStatus },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Status updated successfully!");
      fetchApplications();
      fetchStats();
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update status!");
    }
  };

  const handleReview = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${BASE_URL}/subsidies/admin/${selectedApplication._id}/review`,
        reviewData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Application reviewed successfully!");
      setShowModal(false);
      setReviewData({ status: "", adminNotes: "", rejectionReason: "" });
      fetchApplications();
      fetchStats();
    } catch (error) {
      console.error("Error reviewing application:", error);
      alert("Failed to review application!");
    }
  };

  const handleDelete = async (applicationId) => {
    if (!window.confirm("Are you sure you want to delete this application?"))
      return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${BASE_URL}/subsidies/${applicationId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Application deleted successfully!");
      fetchApplications();
      fetchStats();
    } catch (error) {
      console.error("Error deleting application:", error);
      alert("Failed to delete application!");
    }
  };

  const handleDownloadDocument = async (applicationId, documentIndex) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${BASE_URL}/subsidies/${applicationId}/download/${documentIndex}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: "blob",
        }
      );

      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `document_${documentIndex}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading document:", error);
      alert("Failed to download document!");
    }
  };

  const openModal = (type, application = null) => {
    setModalType(type);
    setSelectedApplication(application);
    if (type === "edit" && application) {
      setEditData(application.data || {});
    }
    if (type === "review" && application) {
      setReviewData({
        status: application.status || "",
        adminNotes: application.adminNotes || "",
        rejectionReason: application.rejectionReason || "",
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedApplication(null);
    setEditData({});
    setReviewData({ status: "", adminNotes: "", rejectionReason: "" });
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      return "Invalid Date";
    }
  };

  const formatStatusName = (status) => {
    if (!status) return "Unknown";
    return status.replace("_", " ");
  };

  if (!user || user.role !== "admin") {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Access Denied
          </h1>
          <p className="text-gray-600">
            You need admin privileges to access this page.
          </p>
        </div>
      </div>
    );
  }

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Subsidy Management
                </h1>
                <p className="mt-1 text-sm text-gray-500">
                  Manage all subsidy applications
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">
                  Welcome, {user?.name || "Admin"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-blue-100">
                    <FaClipboardList className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">
                      Total Applications
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {stats.totalApplications || 0}
                    </p>
                  </div>
                </div>
              </div>

              {/* Fixed stats rendering with null checks */}
              {stats.statusStats && stats.statusStats.length > 0
                ? stats.statusStats
                    .filter((stat) => stat && stat._id) // Filter out null/undefined stats
                    .map((stat) => (
                      <div
                        key={stat._id}
                        className="bg-white rounded-lg shadow p-6"
                      >
                        <div className="flex items-center">
                          <div
                            className={`p-3 rounded-full ${
                              statusColors[stat._id]
                                ? statusColors[stat._id]
                                    .replace("text-", "bg-")
                                    .replace("border-", "")
                                : "bg-gray-100"
                            }`}
                          >
                            {statusIcons[stat._id] || (
                              <FaClock className="w-4 h-4" />
                            )}
                          </div>
                          <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500 capitalize">
                              {formatStatusName(stat._id)}
                            </p>
                            <p className="text-2xl font-bold text-gray-900">
                              {stat.count || 0}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                : // Show placeholder cards if no stats
                  ["pending", "approved", "rejected"].map((status) => (
                    <div
                      key={status}
                      className="bg-white rounded-lg shadow p-6"
                    >
                      <div className="flex items-center">
                        <div
                          className={`p-3 rounded-full ${
                            statusColors[status]
                              ?.replace("text-", "bg-")
                              .replace("border-", "") || "bg-gray-100"
                          }`}
                        >
                          {statusIcons[status] || (
                            <FaClock className="w-4 h-4" />
                          )}
                        </div>
                        <div className="ml-4">
                          <p className="text-sm font-medium text-gray-500 capitalize">
                            {formatStatusName(status)}
                          </p>
                          <p className="text-2xl font-bold text-gray-900">0</p>
                        </div>
                      </div>
                    </div>
                  ))}
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow mb-6 p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search
                </label>
                <div className="relative">
                  <FaSearch className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by name, NIC, or email..."
                    value={filters.search}
                    onChange={(e) =>
                      setFilters({ ...filters, search: e.target.value })
                    }
                    className="pl-10 w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={filters.status}
                  onChange={(e) =>
                    setFilters({ ...filters, status: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="under_review">Under Review</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type
                </label>
                <select
                  value={filters.type}
                  onChange={(e) =>
                    setFilters({ ...filters, type: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">All Types</option>
                  <option value="① Elderly Allowance">Elderly Allowance</option>
                  <option value="② Disability Allowance">
                    Disability Allowance
                  </option>
                  <option value="③ Housing Assistance">
                    Housing Assistance
                  </option>
                  <option value="④ Nutrition Allowance">
                    Nutrition Allowance
                  </option>
                </select>
              </div>

              <div className="flex items-end">
                <button
                  onClick={() => {
                    setFilters({ status: "", type: "", search: "" });
                    setCurrentPage(1);
                  }}
                  className="w-full bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium transition"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Applications Table */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">
                Applications ({pagination.total || 0})
              </h2>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-2 text-gray-600">
                  Loading applications...
                </span>
              </div>
            ) : applications.length === 0 ? (
              <div className="text-center py-12">
                <FaClipboardList className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                  No applications found
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Try adjusting your filters.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Applicant
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Applied Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {applications.map((application) => (
                      <tr key={application._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                                <FaUser className="h-5 w-5 text-gray-600" />
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {application.data?.fullName || "N/A"}
                              </div>
                              <div className="text-sm text-gray-500">
                                {application.user?.email || "N/A"}
                              </div>
                              <div className="text-xs text-gray-400">
                                NIC:{" "}
                                {application.data?.nationalIdNumber || "N/A"}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="text-blue-600 mr-2">
                              {subsidyIcons[application.type] || (
                                <FaUser className="w-5 h-5" />
                              )}
                            </div>
                            <span className="text-sm text-gray-900">
                              {application.type || "Unknown"}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                              statusColors[application.status] ||
                              "bg-gray-100 text-gray-800 border-gray-200"
                            }`}
                          >
                            {statusIcons[application.status] || (
                              <FaClock className="w-4 h-4" />
                            )}
                            <span className="ml-1 capitalize">
                              {formatStatusName(application.status)}
                            </span>
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(application.applicationDate)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => openModal("view", application)}
                              className="text-blue-600 hover:text-blue-900 p-1 rounded"
                              title="View Details"
                            >
                              <FaEye className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => openModal("review", application)}
                              className="text-green-600 hover:text-green-900 p-1 rounded"
                              title="Review Application"
                            >
                              <FaCheck className="h-4 w-4" />
                            </button>
                            <div className="relative group">
                              <select
                                value={application.status || "pending"}
                                onChange={(e) =>
                                  handleStatusUpdate(
                                    application._id,
                                    e.target.value
                                  )
                                }
                                className="text-xs border border-gray-300 rounded px-2 py-1 focus:ring-1 focus:ring-blue-500"
                                title="Quick Status Change"
                              >
                                <option value="pending">Pending</option>
                                <option value="under_review">
                                  Under Review
                                </option>
                                <option value="approved">Approved</option>
                                <option value="rejected">Rejected</option>
                              </select>
                            </div>
                            {application.status === "pending" && (
                              <button
                                onClick={() => handleDelete(application._id)}
                                className="text-red-600 hover:text-red-900 p-1 rounded"
                                title="Delete Application"
                              >
                                <FaTrash className="h-4 w-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                <div className="flex-1 flex justify-between sm:hidden">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() =>
                      setCurrentPage(
                        Math.min(pagination.pages, currentPage + 1)
                      )
                    }
                    disabled={currentPage === pagination.pages}
                    className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Showing page{" "}
                      <span className="font-medium">{currentPage}</span> of{" "}
                      <span className="font-medium">{pagination.pages}</span> (
                      {pagination.total} total applications)
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                      {Array.from(
                        { length: pagination.pages },
                        (_, i) => i + 1
                      ).map((page) => (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                            page === currentPage
                              ? "z-10 bg-blue-50 border-blue-500 text-blue-600"
                              : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                          }`}
                        >
                          {page}
                        </button>
                      ))}
                    </nav>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modal */}
        {showModal && selectedApplication && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">
                  {modalType === "view" && "Application Details"}
                  {modalType === "review" && "Review Application"}
                  {modalType === "edit" && "Edit Application"}
                </h3>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100"
                >
                  <FaTimes className="h-5 w-5" />
                </button>
              </div>

              <div className="px-6 py-4">
                {modalType === "view" && (
                  <div className="space-y-6">
                    {/* Application Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 mb-3">
                          Application Information
                        </h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-500">Type:</span>
                            <span className="font-medium">
                              {selectedApplication.type || "N/A"}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Status:</span>
                            <span
                              className={`px-2 py-1 rounded-full text-xs ${
                                statusColors[selectedApplication.status] ||
                                "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {formatStatusName(selectedApplication.status)}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Applied:</span>
                            <span>
                              {formatDate(selectedApplication.applicationDate)}
                            </span>
                          </div>
                          {selectedApplication.reviewDate && (
                            <div className="flex justify-between">
                              <span className="text-gray-500">Reviewed:</span>
                              <span>
                                {formatDate(selectedApplication.reviewDate)}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium text-gray-900 mb-3">
                          Applicant Information
                        </h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-500">Email:</span>
                            <span>
                              {selectedApplication.user?.email || "N/A"}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Name:</span>
                            <span>
                              {selectedApplication.data?.fullName || "N/A"}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">NIC:</span>
                            <span>
                              {selectedApplication.data?.nationalIdNumber ||
                                "N/A"}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Contact:</span>
                            <span>
                              {selectedApplication.data?.contactNumber || "N/A"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Application Data */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-3">
                        Application Details
                      </h4>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          {selectedApplication.data &&
                            Object.entries(selectedApplication.data)
                              .filter(([key]) => key !== "uploadedDocuments")
                              .map(([key, value]) => (
                                <div key={key} className="flex justify-between">
                                  <span className="text-gray-500 capitalize">
                                    {key
                                      .replace(/([A-Z])/g, " $1")
                                      .replace(/^./, (str) =>
                                        str.toUpperCase()
                                      )}
                                    :
                                  </span>
                                  <span
                                    className="font-medium text-right max-w-xs truncate"
                                    title={value || "N/A"}
                                  >
                                    {value || "N/A"}
                                  </span>
                                </div>
                              ))}
                        </div>
                      </div>
                    </div>

                    {/* Documents */}
                    {selectedApplication.data?.uploadedDocuments &&
                      selectedApplication.data.uploadedDocuments.length > 0 && (
                        <div>
                          <h4 className="text-sm font-medium text-gray-900 mb-3">
                            Uploaded Documents
                          </h4>
                          <div className="space-y-2">
                            {selectedApplication.data.uploadedDocuments.map(
                              (doc, index) => (
                                <div
                                  key={index}
                                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                                >
                                  <div className="flex items-center">
                                    <FaFileAlt className="h-5 w-5 text-gray-400 mr-3" />
                                    <div>
                                      <p className="text-sm font-medium text-gray-900">
                                        {doc.fileName || "Unknown File"}
                                      </p>
                                      <p className="text-xs text-gray-500">
                                        Uploaded: {formatDate(doc.uploadDate)}
                                      </p>
                                    </div>
                                  </div>
                                  <button
                                    onClick={() =>
                                      handleDownloadDocument(
                                        selectedApplication._id,
                                        index
                                      )
                                    }
                                    className="text-blue-600 hover:text-blue-800 p-2 rounded-full hover:bg-blue-50"
                                    title="Download Document"
                                  >
                                    <FaDownload className="h-4 w-4" />
                                  </button>
                                </div>
                              )
                            )}
                          </div>
                        </div>
                      )}

                    {/* Admin Notes */}
                    {(selectedApplication.adminNotes ||
                      selectedApplication.rejectionReason) && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 mb-3">
                          Admin Notes
                        </h4>
                        <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                          {selectedApplication.adminNotes && (
                            <div>
                              <span className="text-sm font-medium text-gray-700">
                                Notes:
                              </span>
                              <p className="text-sm text-gray-600 mt-1">
                                {selectedApplication.adminNotes}
                              </p>
                            </div>
                          )}
                          {selectedApplication.rejectionReason && (
                            <div>
                              <span className="text-sm font-medium text-red-700">
                                Rejection Reason:
                              </span>
                              <p className="text-sm text-red-600 mt-1">
                                {selectedApplication.rejectionReason}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {modalType === "review" && (
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Status
                      </label>
                      <select
                        value={reviewData.status}
                        onChange={(e) =>
                          setReviewData({
                            ...reviewData,
                            status: e.target.value,
                          })
                        }
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Select Status</option>
                        <option value="pending">Pending</option>
                        <option value="under_review">Under Review</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Admin Notes
                      </label>
                      <textarea
                        value={reviewData.adminNotes}
                        onChange={(e) =>
                          setReviewData({
                            ...reviewData,
                            adminNotes: e.target.value,
                          })
                        }
                        rows={4}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Add your review notes here..."
                      />
                    </div>

                    {reviewData.status === "rejected" && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Rejection Reason
                        </label>
                        <textarea
                          value={reviewData.rejectionReason}
                          onChange={(e) =>
                            setReviewData({
                              ...reviewData,
                              rejectionReason: e.target.value,
                            })
                          }
                          rows={3}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Explain why this application is being rejected..."
                        />
                      </div>
                    )}

                    <div className="flex justify-end space-x-3">
                      <button
                        onClick={closeModal}
                        className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleReview}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      >
                        Save Review
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
