// src/components/AuthLayout.jsx
import React from "react";

export default function AuthLayout({ children, title }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white px-4">
      <div className="w-full max-w-md bg-slate-800/60 backdrop-blur-md rounded-2xl shadow-2xl p-8 border border-slate-700">
        <h2 className="text-3xl font-semibold text-center text-blue-400 mb-6">{title}</h2>
        {children}
      </div>
    </div>
  );
}
