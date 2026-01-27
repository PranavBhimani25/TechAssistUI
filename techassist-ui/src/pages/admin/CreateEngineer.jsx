import { useState } from "react";
import DashboardLayout from "../../layout/DashboardLayout";
import { createEngineer } from "../../services/adminService";
import { toast } from "react-hot-toast";

export default function CreateEngineer() {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    isActive: true,
  });
  const [submitting, setSubmitting] = useState(false);

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!form.fullName.trim()) return toast.error("Full name is required");
    if (!form.email.trim()) return toast.error("Email is required");
    if (!form.password) return toast.error("Password is required");
    if (form.password !== form.confirmPassword)
      return toast.error("Passwords do not match");

    setSubmitting(true);
    try {
      await createEngineer({
        fullName: form.fullName.trim(),
        email: form.email.trim(),
        password: form.password,
        isActive: form.isActive,
      });
      toast.success("Engineer created successfully");
      setForm({
        fullName: "",
        email: "",
        password: "",
        confirmPassword: "",
        isActive: true,
      });
    } catch (err) {
      console.error(err);
      const apiMsg =
        err?.response?.data?.message || "Failed to create engineer";
      toast.error(apiMsg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-semibold mb-6 text-blue-400">
          Create New Engineer
        </h1>

        <form
          onSubmit={onSubmit}
          className="bg-slate-800 border border-slate-700 rounded-2xl p-6 space-y-5"
        >
          <div>
            <label className="block text-sm text-gray-300 mb-1">Full Name</label>
            <input
              name="fullName"
              value={form.fullName}
              onChange={onChange}
              placeholder="e.g., Amit Sharma"
              className="w-full px-4 py-2 rounded-lg bg-slate-900 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-200"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-1">Email</label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={onChange}
              placeholder="engineer@company.com"
              className="w-full px-4 py-2 rounded-lg bg-slate-900 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-200"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-300 mb-1">Password</label>
              <input
                name="password"
                type="password"
                value={form.password}
                onChange={onChange}
                placeholder="••••••••"
                className="w-full px-4 py-2 rounded-lg bg-slate-900 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-200"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-1">
                Confirm Password
              </label>
              <input
                name="confirmPassword"
                type="password"
                value={form.confirmPassword}
                onChange={onChange}
                placeholder="••••••••"
                className="w-full px-4 py-2 rounded-lg bg-slate-900 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-200"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-gray-300">
              <input
                type="checkbox"
                name="isActive"
                checked={form.isActive}
                onChange={onChange}
                className="rounded border-slate-600 bg-slate-900"
              />
              Active
            </label>

            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 rounded-lg font-medium"
            >
              {submitting ? "Creating..." : "Create Engineer"}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
