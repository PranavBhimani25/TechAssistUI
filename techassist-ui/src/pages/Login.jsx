// src/pages/Login.jsx
import React, { useState } from "react";
import AuthLayout from "../layout/AuthLayout";
import { loginUser } from "../services/authService";
import { toast } from "react-toastify";

export default function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await loginUser(formData);
      console.log(data);
      toast.success("Login successful !");

      if (data.role === "Admin") {
        setTimeout(() => (window.location.href = "/admin/dashboard"), 1500);
      }
      if (data.role === "User") {
        setTimeout(() => (window.location.href = "/user/dashboard"), 1500);
      }
      if (data.role === "Engineer") {  
        setTimeout(() => (window.location.href = "/engineer/dashboard"), 1500);
      }
      // setTimeout(() => (window.location.href = "/dashboard"), 1500);
    } catch (err) {
      console.error(err);
      toast.error("Invalid credentials. Please try again.")
      // setError("Invalid credentials. Please try again.");
    }
  };

  return (
    <AuthLayout title="Welcome Back">
      <form onSubmit={handleSubmit} className="space-y-5">
        {error && <p className="text-red-400 text-sm text-center">{error}</p>}

        <div>
          <label className="block text-sm text-gray-300 mb-1">Email</label>
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
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
            placeholder="Enter your password"
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
          Sign In
        </button>

        <p className="text-sm text-center text-gray-400 mt-3">
          Don’t have an account?{" "}
          <a href="/register" className="text-blue-400 hover:underline">
            Create one
          </a>
        </p>
      </form>
    </AuthLayout>
  );
}
