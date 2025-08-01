"use client";

import React from "react";
import My_Navbar from "../Navbar";

const MainLayout = ({ children }) => {
  return (
    <div>
      <My_Navbar/>
      <div className="min-h-screen bg-gray-100">
        {/* You can add your navbar/header here if needed */}
        {children}
        {/* You can add your footer here */}
      </div>
    </div>
  );
};