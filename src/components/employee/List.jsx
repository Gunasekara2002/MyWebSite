import React from "react";
import { Link } from "react-router-dom";
const List = () => {
    return (
    <div className="p-6">
        <div className="text-center">
            <h3 className="text-2xl font-bold">manage employee</h3>
        </div>
        <div className="flex justify-between items-center">
            <input
                type="text"
                placeholder="Search by name"
                className="px-4 py-0.5 border"
                />
                <Link
                to="/admin_dashboard/add_employee"
                className="px-4 py-1 bg-teal-600 rounded text-white "
                >
                Add Employee
                </Link>
        </div>
    </div>    
)};