// src/layout/DashboardLayout.jsx
import React from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

export default function DashboardLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-slate-950 text-gray-100">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Navbar />
        <main className="p-6 bg-slate-900 flex-1 rounded-tl-2xl">
          {children}
        </main>
      </div>
    </div>
  );
}
