import { useEffect, useState } from "react";
import DashboardLayout from "../layout/DashboardLayout";
import { getMyProfile, updateMyProfile } from "../services/commonService";
import {toast} from "react-toastify";

export default function Settings() {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    role: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const data = await getMyProfile();
        setForm({
          fullName: data.fullName || "",
          email: data.email || "",
          role: data.role || "",
        });
      } catch {
        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const onChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!form.fullName.trim()) {
      toast.error("Full name is required");
      return;
    }
    if (!form.email.trim()) {
      toast.error("Email is required");
      return;
    }

    try {
      setSaving(true);
      await updateMyProfile({
        fullName: form.fullName.trim(),
        email: form.email.trim(),
      });
      toast.success("Profile updated");
    } catch {
      toast.error("Update failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-semibold mb-6 text-blue-400">
        Settings
      </h1>

      {loading ? (
        <p className="text-gray-400">Loading profile...</p>
      ) : (
        <form
          onSubmit={onSubmit}
          className="max-w-xl bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-5"
        >
          {/* Full Name */}
          <div>
            <label className="block text-sm text-gray-300 mb-1">
              Full Name
            </label>
            <input
              name="fullName"
              value={form.fullName}
              onChange={onChange}
              className="w-full px-4 py-2 bg-slate-950 border border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-600"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm text-gray-300 mb-1">
              Email
            </label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={onChange}
              className="w-full px-4 py-2 bg-slate-950 border border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-600"
            />
          </div>

          {/* Role (Read-only) */}
          <div>
            <label className="block text-sm text-gray-300 mb-1">
              Role
            </label>
            <input
              value={form.role}
              disabled
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-gray-400 cursor-not-allowed"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-3">
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-60"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      )}
    </DashboardLayout>
  );
}
