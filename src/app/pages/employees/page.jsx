/*"use client";
import React, { useEffect, useState } from "react";
import API from "@/API/axios";
import Link from "next/link";
import AdminLayout from "@/components/layout/AdminLayout";

export default function EmployeesPage() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    nic: "",
    position: "",
    phone: "",
    email: "",
    dateofbirth: "",
    dateofappointment: "",
    dateofretirement: "",
  });
  const [editingId, setEditingId] = useState(null);

  const resetForm = () => {
    setFormData({
      name: "",
      nic: "",
      position: "",
      phone: "",
      email: "",
      dateofbirth: "",
      dateofappointment: "",
      dateofretirement: "",
    });
    setEditingId(null);
  };

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const res = await API.get("/employees");
      setEmployees(res.data);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Error fetching employees");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await API.put(`/employees/${editingId}`, formData);
        setEmployees((prev) =>
          prev.map((emp) =>
            emp._id === editingId ? { ...emp, ...formData } : emp
          )
        );
      } else {
        const res = await API.post("/employees", formData);
        setEmployees((prev) => [...prev, res.data]);
      }
      resetForm();
    } catch (err) {
      alert(err.response?.data?.message || "Save failed");
    }
  };

  const handleEdit = (emp) => {
    setFormData({
      name: emp.name,
      nic: emp.nic,
      position: emp.position,
      phone: emp.phone,
      email: emp.email,
      dateofbirth: emp.dateofbirth,
      dateofappointment: emp.dateofappointment,
      dateofretirement: emp.dateofretirement,
    });
    setEditingId(emp._id);
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this employee?")) return;
    try {
      await API.delete(`/employees/${id}`);
      setEmployees((prev) => prev.filter((emp) => emp._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || "Delete failed");
    }
  };

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-6xl mx-auto bg-white p-8 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Employees</h2>
            <Link
              href={"/pages/personal_info"}
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition"
            >
              Add Employee
            </Link>
          </div>

          {/* Optional Form */
          /*{false && (
            <form
              onSubmit={handleSubmit}
              className="mb-8 grid md:grid-cols-4 gap-4"
            >
              {["name", "nic", "position", "phone"].map((field) => (
                <input
                  key={field}
                  type="text"
                  name={field}
                  placeholder={field.toUpperCase()}
                  className="p-2 border border-gray-300 rounded-md"
                  value={formData[field]}
                  onChange={(e) =>
                    setFormData({ ...formData, [field]: e.target.value })
                  }
                  required
                />
              ))}
              <button
                type="submit"
                className="col-span-full md:col-auto bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition"
              >
                {editingId ? "Update" : "Add"}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="col-span-full md:col-auto bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
              )}
            </form>
          )}

          {/* Table */
          /*{loading ? (
            <p>Loading…</p>
          ) : error ? (
            <p className="text-red-600">{error}</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-3 text-left border">Name</th>
                    <th className="p-3 text-left border">NIC</th>
                    <th className="p-3 text-left border">Position</th>
                    <th className="p-3 text-left border">Phone</th>
                    <th className="p-3 text-left border">Email</th>
                    <th className="p-3 text-left border">Date of Birth</th>
                    <th className="p-3 text-left border">
                      Date of Appointment
                    </th>
                    <th className="p-3 text-left border">Date of Retirement</th>
                    <th className="p-3 text-left border w-32">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {employees.map((emp) => (
                    <tr key={emp._id} className="hover:bg-gray-50">
                      <td className="p-3 border">{emp.name}</td>
                      <td className="p-3 border">{emp.nic}</td>
                      <td className="p-3 border">{emp.position}</td>
                      <td className="p-3 border">{emp.phone}</td>
                      <td className="p-3 border">{emp.email}</td>
                      <td className="p-3 border">{emp.dateofbirth}</td>
                      <td className="p-3 border">{emp.dateofappointment}</td>
                      <td className="p-3 border">{emp.dateofretirement}</td>
                      <td className="p-3 border">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEdit(emp)}
                            className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 text-sm"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(emp._id)}
                            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {employees.length === 0 && (
                    <tr>
                      <td colSpan={9} className="p-4 text-center text-gray-500">
                        No employees found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}*/

/*"use client";
import React, { useEffect, useState } from "react";
import API from "@/API/axios";
import Link from "next/link";
import AdminLayout from "@/components/layout/AdminLayout";

export default function EmployeesPage() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    nic: "",
    position: "",
    phone: "",
    email: "",
    dateofbirth: "",
    dateofappointment: "",
    dateofretirement: "",
  });
  const [editingId, setEditingId] = useState(null);

  const resetForm = () => {
    setFormData({
      name: "",
      nic: "",
      position: "",
      phone: "",
      email: "",
      dateofbirth: "",
      dateofappointment: "",
      dateofretirement: "",
    });
    setEditingId(null);
  };

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const res = await API.get("/employees");
      setEmployees(res.data);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Error fetching employees");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await API.put(`/employees/${editingId}`, formData);
        setEmployees((prev) =>
          prev.map((emp) =>
            emp._id === editingId ? { ...emp, ...formData } : emp
          )
        );
      } else {
        const res = await API.post("/employees", formData);
        setEmployees((prev) => [...prev, res.data]);
      }
      resetForm();
    } catch (err) {
      alert(err.response?.data?.message || "Save failed");
    }
  };

  const handleEdit = (emp) => {
    setFormData({
      name: emp.name,
      nic: emp.nic,
      position: emp.position,
      phone: emp.phone,
      email: emp.email,
      dateofbirth: emp.dateofbirth,
      dateofappointment: emp.dateofappointment,
      dateofretirement: emp.dateofretirement,
    });
    setEditingId(emp._id);
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this employee?")) return;
    try {
      await API.delete(`/employees/${id}`);
      setEmployees((prev) => prev.filter((emp) => emp._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || "Delete failed");
    }
  };

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-6xl mx-auto bg-white p-8 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Employees</h2>
            <Link
              href={"/pages/personal_info"}
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition"
            >
              Add Employee
            </Link>
          </div>

          {/* Employee Form */
          /*<form
            onSubmit={handleSubmit}
            className="mb-8 grid md:grid-cols-4 gap-4"
          >
            {[
              { name: "name", type: "text" },
              { name: "nic", type: "text" },
              { name: "position", type: "text" },
              { name: "phone", type: "text" },
              { name: "email", type: "email" },
              { name: "dateofbirth", type: "date" },
              { name: "dateofappointment", type: "date" },
              { name: "dateofretirement", type: "date" },
            ].map((field) => (
              <input
                key={field.name}
                type={field.type}
                name={field.name}
                placeholder={field.name.toUpperCase()}
                className="p-2 border border-gray-300 rounded-md"
                value={formData[field.name]}
                onChange={(e) =>
                  setFormData({ ...formData, [field.name]: e.target.value })
                }
                required
              />
            ))}

            <button
              type="submit"
              className="col-span-full md:col-auto bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition"
            >
              {editingId ? "Update" : "Add"}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="col-span-full md:col-auto bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400 transition"
              >
                Cancel
              </button>
            )}
          </form>

          {/* Employee Table */
          /*{loading ? (
            <p>Loading…</p>
          ) : error ? (
            <p className="text-red-600">{error}</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-3 text-left border">Name</th>
                    <th className="p-3 text-left border">NIC</th>
                    <th className="p-3 text-left border">Position</th>
                    <th className="p-3 text-left border">Phone</th>
                    <th className="p-3 text-left border">Email</th>
                    <th className="p-3 text-left border">Date of Birth</th>
                    <th className="p-3 text-left border">
                      Date of Appointment
                    </th>
                    <th className="p-3 text-left border">Date of Retirement</th>
                    <th className="p-3 text-left border w-32">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {employees.map((emp) => (
                    <tr key={emp._id} className="hover:bg-gray-50">
                      <td className="p-3 border">{emp.name}</td>
                      <td className="p-3 border">{emp.nic}</td>
                      <td className="p-3 border">{emp.position}</td>
                      <td className="p-3 border">{emp.phone}</td>
                      <td className="p-3 border">{emp.email}</td>
                      <td className="p-3 border">{emp.dateofbirth}</td>
                      <td className="p-3 border">{emp.dateofappointment}</td>
                      <td className="p-3 border">{emp.dateofretirement}</td>
                      <td className="p-3 border">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEdit(emp)}
                            className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 text-sm"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(emp._id)}
                            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {employees.length === 0 && (
                    <tr>
                      <td colSpan={9} className="p-4 text-center text-gray-500">
                        No employees found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
*/
"use client";
import React, { useEffect, useState } from "react";
import API from "@/API/axios";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function EmployeesPage() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    nic: "",
    position: "",
    phone: "",
    email: "",
    dateofbirth: "",
    dateofappointment: "",
    dateofretirement: "",
  });
  const [editingId, setEditingId] = useState(null);

  const resetForm = () => {
    setFormData({
      name: "",
      nic: "",
      position: "",
      phone: "",
      email: "",
      dateofbirth: "",
      dateofappointment: "",
      dateofretirement: "",
    });
    setEditingId(null);
  };

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const res = await API.get("/employees");
      setEmployees(res.data);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Error fetching employees");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await API.put(`/employees/${editingId}`, formData);
        setEmployees((prev) =>
          prev.map((emp) =>
            emp._id === editingId ? { ...emp, ...formData } : emp
          )
        );
      } else {
        const res = await API.post("/employees", formData);
        setEmployees((prev) => [...prev, res.data]);
      }
      resetForm();
    } catch (err) {
      alert(err.response?.data?.message || "Save failed");
    }
  };

  const handleEdit = (emp) => {
    setFormData({
      name: emp.name,
      nic: emp.nic,
      position: emp.position,
      phone: emp.phone,
      email: emp.email,
      dateofbirth: emp.dateofbirth,
      dateofappointment: emp.dateofappointment,
      dateofretirement: emp.dateofretirement,
    });
    setEditingId(emp._id);
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this employee?")) return;
    try {
      await API.delete(`/employees/${id}`);
      setEmployees((prev) => prev.filter((emp) => emp._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || "Delete failed");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md h-screen sticky top-0">
        <div className="p-6 text-xl font-bold text-green-700 border-b border-gray-200">
          Admin Dashboard
        </div>
        <nav className="flex flex-col gap-2 p-4">
          <Link
            href="/pages/admin_dashboard"
            className="text-gray-700 px-4 py-2 rounded hover:bg-green-100"
          >
            Dashboard
          </Link>
          <Link
            href="/pages/employees"
            className="text-gray-700 px-4 py-2 rounded hover:bg-green-100"
          >
            Employee
          </Link>
          <Link
            href="/pages/admin_leaves"
            className="text-gray-700 px-4 py-2 rounded hover:bg-green-100"
          >
            Leaves
          </Link>
          <Link
            href="/pages/admin_services"
            className="text-gray-700 px-4 py-2 rounded hover:bg-green-100"
          >
            Services
          </Link>
          <Link
            href="/pages/admin_subsidies"
            className="text-gray-700 px-4 py-2 rounded hover:bg-green-100"
          >
            Subsidies
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Employees</h2>
            <Link
              href="/pages/personal_info"
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition"
            >
              Add Employee
            </Link>
          </div>

          {/* Employee Form */}
          <form
            onSubmit={handleSubmit}
            className="mb-8 grid md:grid-cols-4 gap-4"
          >
            {[
              { name: "name", type: "text" },
              { name: "nic", type: "text" },
              { name: "position", type: "text" },
              { name: "phone", type: "text" },
              { name: "email", type: "email" },
              { name: "dateofbirth", type: "date" },
              { name: "dateofappointment", type: "date" },
              { name: "dateofretirement", type: "date" },
            ].map((field) => (
              <input
                key={field.name}
                type={field.type}
                name={field.name}
                placeholder={field.name.toUpperCase()}
                className="p-2 border border-gray-300 rounded-md"
                value={formData[field.name]}
                onChange={(e) =>
                  setFormData({ ...formData, [field.name]: e.target.value })
                }
                required
              />
            ))}

            <button
              type="submit"
              className="col-span-full md:col-auto bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition"
            >
              {editingId ? "Update" : "Add"}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="col-span-full md:col-auto bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400 transition"
              >
                Cancel
              </button>
            )}
          </form>

          {/* Employee Table */}
          {loading ? (
            <p>Loading…</p>
          ) : error ? (
            <p className="text-red-600">{error}</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-3 text-left border">Name</th>
                    <th className="p-3 text-left border">NIC</th>
                    <th className="p-3 text-left border">Position</th>
                    <th className="p-3 text-left border">Phone</th>
                    <th className="p-3 text-left border">Email</th>
                    <th className="p-3 text-left border">Date of Birth</th>
                    <th className="p-3 text-left border">Date of Appointment</th>
                    <th className="p-3 text-left border">Date of Retirement</th>
                    <th className="p-3 text-left border w-32">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {employees.map((emp) => (
                    <tr key={emp._id} className="hover:bg-gray-50">
                      <td className="p-3 border">{emp.name}</td>
                      <td className="p-3 border">{emp.nic}</td>
                      <td className="p-3 border">{emp.position}</td>
                      <td className="p-3 border">{emp.phone}</td>
                      <td className="p-3 border">{emp.email}</td>
                      <td className="p-3 border">{emp.dateofbirth}</td>
                      <td className="p-3 border">{emp.dateofappointment}</td>
                      <td className="p-3 border">{emp.dateofretirement}</td>
                      <td className="p-3 border">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEdit(emp)}
                            className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 text-sm"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(emp._id)}
                            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {employees.length === 0 && (
                    <tr>
                      <td colSpan={9} className="p-4 text-center text-gray-500">
                        No employees found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
