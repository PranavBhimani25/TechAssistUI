// src/components/Sidebar.jsx
import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FiUsers,
  FiClipboard,
  FiSettings,
  FiLogOut,
} from "react-icons/fi";

export default function Sidebar({ onClose }) {
  const location = useLocation();
  const role = localStorage.getItem("role");

  const adminOnly = role === "Admin";
  const engineerOnly = role === "Engineer";
  const userOnly = role === "User";

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    window.location.href = "/login";
  };

  const links = [
    ...(adminOnly
      ? [
          { to: "/admin/dashboard", label: "Dashboard", icon: <FiClipboard /> },
          { to: "/admin/engineers/new", label: "Add Engineer", icon: <FiUsers /> },
          { to: "/admin/users", label: "Users / Engineers", icon: <FiUsers /> },
        ]
      : []),

    ...(engineerOnly
      ? [{ to: "/engineer/dashboard", label: "Dashboard", icon: <FiClipboard /> }]
      : []),

    ...(userOnly
      ? [
          { to: "/user/dashboard", label: "Dashboard", icon: <FiClipboard /> },
          { to: "/user/tickets/new", label: "Create Ticket", icon: <FiClipboard /> },
        ]
      : []),

    { to: "/settings", label: "Settings", icon: <FiSettings /> },
  ];

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col h-full">
      
      {/* Logo */}
      <div className="p-5 border-b border-slate-800">
        <h1 className="text-xl font-bold text-blue-400">TechAssist</h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-2">
        {links.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            onClick={onClose} // closes mobile drawer
            className={`flex items-center gap-3 px-3 py-2 rounded-lg transition ${
              location.pathname === link.to
                ? "bg-blue-600 text-white"
                : "hover:bg-slate-800 text-gray-300"
            }`}
          >
            {link.icon}
            {link.label}
          </Link>
        ))}
      </nav>

      {/* Logout (FIXED AT BOTTOM) */}
      <button
        onClick={handleLogout}
        className="p-4 border-t border-slate-800 flex items-center gap-2 text-gray-300 hover:bg-red-600 transition"
      >
        <FiLogOut />
        Logout
      </button>
    </aside>
  );
}
