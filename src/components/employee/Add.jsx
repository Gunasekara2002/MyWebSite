/*import React,{ useEffect, useState} from "react";

const Add = () => {
    useEffect(() => {

    }, [])

    return (
        <div className="max-w-4xl mx-auto mt-10 bg-white p-8 rounded-md shadow-md">
            <h2 className="text-2xl font-bold mb-6">add new employee</h2>
            <form>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                    {/*Name*/

                    /*<div>
                        <label className="block text-sm font-medium text-gray-700">
                            Name
                        </label>
                        <input
                            type="text"
                            name="name"
                            placeholder="Enter Name"
                            className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
                            required
                        />
                    </div>

                    {/*Email*/
                    /*<div>
                        <label className="block text-sm font-medium text-gray-700">
                            Email
                        </label>
                        <input
                            type="email"
                            name="email"
                            placeholder="Enter Email"
                            className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
                            required
                        />
                    </div>
                    {/*employee id*/
                    /*<div>
                        <label className="block text-sm font-medium text-gray-700">
                            Employee ID
                        </label>
                        <input
                            type="text"
                            name="employee_id"
                            placeholder="Enter Employee ID"
                            className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
                            required
                        />
                    </div>

                    {/*date of birth*/
                    /*<div>
                        <label className="block text-sm font-medium text-gray-700">
                            Date of Birth
                        </label>
                        <input
                            type="date"
                            name="date_of_birth"
                            placeholder="Enter Date of Birth"
                            className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
                            required
                        />
                    </div>

                    {/*address*/
                    /*<div>
                        <label className="block text-sm font-medium text-gray-700">
                            Address
                        </label>
                        <input
                            type="text"
                            name="address"
                            placeholder="Enter Address"
                            className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
                            required
                        />
                    </div>

                    {/*phone number*/
                    /*<div>
                        <label className="block text-sm font-medium text-gray-700">
                            Phone Number
                        </label>
                        <input
                            type="tel"
                            name="phone_number"
                            placeholder="Enter Phone Number"
                            className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
                            required
                        />
                    </div>

                    {/*gender*/
                    /*<div>
                        <label className="block text-sm font-medium text-gray-700">
                            Gender
                        </label>
                        <input
                            type="text"
                            name="gender"
                            placeholder="Enter Gender"
                            className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
                            required
                        />
                    </div>

                    {/*marital status*/
                    /*<div>
                        <label className="block text-sm font-medium text-gray-700">
                            Marital Status
                        </label>
                        <input
                            type="text"
                            name="marital_status"
                            placeholder="Enter Marital Status"
                            className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
                            required
                        />

                        {/*disignation*/
                        /*<div>
                            <label className="block text-sm font-medium text-gray-700">
                                Designation
                            </label>
                            <input
                                type="text"
                                name="designation"
                                placeholder="Enter Designation"
                                className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
                                required
                            />
                        </div>

                        {/*department*/
                        /*<div>
                            <label className="block text-sm font-medium text-gray-700">
                                Department
                            </label>
                            <input
                                type="text"
                                name="department"
                                placeholder="Enter Department"
                                className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
                                required
                            />
                        </div>

                        {/*image upload*/
                       /* <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Upload Employee Image
                            </label>
                            <input
                                type="file"
                                name="image"
                                accept="image/*"
                                className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
                                required
                            />
                        </div>
                    </div>
                    <button
                        type="submit"
                        className="w-full mt-6 text-white py-2 rounded-xl hover:bg-green-700">
                            add employee
                    </button>
            </form>
        </div>
    );
};
*/

import React, { useState } from "react";

const AddEmployee = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    employeeId: "",
    dateOfBirth: "",
    address: "",
    phoneNumber: "",
    gender: "",
    maritalStatus: "",
    designation: "",
    department: "",
    image: null,
  });

  // update state on every field change
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  // submit handler (replace console.log with your POST request)
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);            // 👉🏽 here’s your payload
    // Example:
    // const data = new FormData();
    // Object.entries(formData).forEach(([k, v]) => data.append(k, v));
    // await axios.post("/api/employees", data);
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 bg-white p-8 rounded-md shadow-md">
      <h2 className="text-2xl font-bold mb-6">Add New Employee</h2>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              name="name"
              placeholder="Enter Name"
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter Email"
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          {/* Employee ID */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Employee ID
            </label>
            <input
              type="text"
              name="employeeId"
              placeholder="Enter Employee ID"
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
              value={formData.employeeId}
              onChange={handleChange}
              required
            />
          </div>

          {/* Date of Birth */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Date of Birth
            </label>
            <input
              type="date"
              name="dateOfBirth"
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
              value={formData.dateOfBirth}
              onChange={handleChange}
              required
            />
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Address</label>
            <input
              type="text"
              name="address"
              placeholder="Enter Address"
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
              value={formData.address}
              onChange={handleChange}
              required
            />
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Phone Number
            </label>
            <input
              type="tel"
              name="phoneNumber"
              placeholder="Enter Phone Number"
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
              value={formData.phoneNumber}
              onChange={handleChange}
              required
            />
          </div>

          {/* Gender */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Gender</label>
            <select
              name="gender"
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
              value={formData.gender}
              onChange={handleChange}
              required
            >
              <option value="" disabled>
                Select Gender
              </option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Marital Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Marital Status
            </label>
            <select
              name="maritalStatus"
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
              value={formData.maritalStatus}
              onChange={handleChange}
              required
            >
              <option value="" disabled>
                Select Status
              </option>
              <option value="single">Single</option>
              <option value="married">Married</option>
              <option value="divorced">Divorced</option>
              <option value="widowed">Widowed</option>
            </select>
          </div>

          {/* Designation */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Designation
            </label>
            <input
              type="text"
              name="designation"
              placeholder="Enter Designation"
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
              value={formData.designation}
              onChange={handleChange}
              required
            />
          </div>

          {/* Department */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Department
            </label>
            <input
              type="text"
              name="department"
              placeholder="Enter Department"
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
              value={formData.department}
              onChange={handleChange}
              required
            />
          </div>

          {/* Image Upload */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">
              Upload Employee Image
            </label>
            <input
              type="file"
              name="image"
              accept="image/*"
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
              onChange={handleChange}
              required
            />
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full mt-6 bg-green-600 text-white py-2 rounded-xl hover:bg-green-700 transition"
        >
          Add Employee
        </button>
      </form>
    </div>
  );
};

export default AddEmployee;

    
