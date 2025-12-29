// src/components/Sidebar.jsx
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FiHome, FiUsers, FiClipboard, FiSettings, FiLogOut } from "react-icons/fi";
import { logoutUser } from "../services/authService";

export default function Sidebar() {
  const location = useLocation();
  const role = localStorage.getItem("role"); 

  const adminOnly = role === "Admin";
  const engineerOnly = role === "Engineer";
  const userOnly = role === "User";

  const logoutUser = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    window.location.href = "/login";
  }

  const links = [
    ...(adminOnly
    ? [
        {to: "/admin/dashboard", label: "Dashboard", icon: <FiClipboard />},
        { to: "/admin/engineers/new", label: "Add Engineer", icon: <FiUsers /> },
        { to: "/admin/users", label: "Users/Enginner", icon: <FiUsers /> },
        
      ]
    : []),

    ...(engineerOnly
    ? [
        // Engineer specific links can be added here
        {to: "/engineer/dashboard", label: "Dashboard", icon: <FiClipboard />},
        
      ]
      : []),
      
      ...(userOnly
        ? [
          // User specific links can be added here
          {to: "/user/dashboard", label: "Dashboard", icon: <FiClipboard />},
          { to: "/user/tickets/new", label: "Tickets", icon: <FiClipboard /> },

      ]
    : []),

    { to: "/settings", label: "Settings", icon: <FiSettings /> },
  ];

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 p-5 hidden md:flex flex-col">
      <h1 className="text-xl font-bold mb-8 text-blue-400">TechAssist</h1>
      <nav className="flex flex-col space-y-2 flex-1">
        {links.map((link) => (
          <Link
            key={link.to}
            to={link.to}
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
      <button onClick={logoutUser} className="sticky bottom-0 bg-slate-900 border-t border-slate-800 p-4 flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-red-600 transition text-gray-300">
        <FiLogOut /> Logout
      </button>
    </aside>
  );
}
