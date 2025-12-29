// src/pages/Register.jsx
import React, { useState } from "react";
import AuthLayout from "../layout/AuthLayout";
import { registerUser } from "../services/authService";
import { toast } from "react-toastify";

export default function Register() {
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try { 
      const data = await registerUser(formData);
      // setMessage("Registration successful! Redirecting to login...");
      toast.success("Registration successful! Redirecting to login...")
      setTimeout(() => (window.location.href = "/login"), 2000);
    } catch (err) {
      console.error(err);
      // setMessage("Registration failed. Please try again.");
      toast.error("Registration failed. Please try again.")
    }
  };

  return (
    <AuthLayout title="Create Account">
      <form onSubmit={handleSubmit} className="space-y-5">
        {message && <p className="text-blue-400 text-sm text-center">{message}</p>}

        <div>
          <label className="block text-sm text-gray-300 mb-1">Full Name</label>
          <input
            type="text"
            name="name"
            placeholder="John Doe"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg bg-slate-900 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-200"
            required
          />
        </div>

        <div>
          <label className="block text-sm text-gray-300 mb-1">Email</label>
          <input
            type="email"
            name="email"
            placeholder="you@example.com"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg bg-slate-900 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-200"
            required
          />
        </div>

        <div>
          <label className="block text-sm text-gray-300 mb-1">Password</label>
          <input
            type="password"
            name="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg bg-slate-900 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-200"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full py-2 bg-blue-500 hover:bg-blue-600 rounded-lg font-medium transition duration-300"
        >
          Register
        </button>

        <p className="text-sm text-center text-gray-400 mt-3">
          Already have an account?{" "}
          <a href="/login" className="text-blue-400 hover:underline">
            Sign In
          </a>
        </p>
      </form>
    </AuthLayout>
  );
}
