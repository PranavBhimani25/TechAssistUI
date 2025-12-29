// src/components/Navbar.jsx
import React from "react";
import { FiBell } from "react-icons/fi";

export default function Navbar() {
  return (
    <header className="flex items-center justify-between px-6 py-3 bg-slate-900 border-b border-slate-800">
      <h2 className="text-lg font-semibold">Dashboard</h2>
      <div className="flex items-center gap-4">
        <button className="p-2 hover:bg-slate-800 rounded-full">
          <FiBell className="text-gray-400" size={20} />
        </button>
        <div className="h-8 w-8 bg-blue-600 rounded-full flex items-center justify-center font-bold">
          P
        </div>
      </div>
    </header>
  );
}
