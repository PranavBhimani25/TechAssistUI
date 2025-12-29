import { useEffect, useState } from "react";
import DashboardLayout from "../../layout/DashboardLayout";
import { getEngineers } from "../../services/adminService";
import Badge from "../../components/Badge";
import Empty from "../../components/Empty";
import toast from "react-hot-toast";

const PAGE_SIZE = 10;

export default function EngineersPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await getEngineers({ search: search || undefined, page, pageSize: PAGE_SIZE });
      setItems(res.items ?? res);
      setTotal(res.total ?? (res.items ? res.items.length : res.length ?? 0));
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Failed to load engineers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-blue-400">Engineers</h1>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 mb-4">
        <div className="flex gap-3">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && (setPage(1), fetchData())}
            placeholder="Search engineer and press Enter"
            className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-gray-200"
          />
          <button
            onClick={() => { setPage(1); fetchData(); }}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg"
          >
            Search
          </button>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-800 text-gray-300">
              <tr>
                <th className="text-left px-4 py-3">Full Name</th>
                <th className="text-left px-4 py-3">Email</th>
                <th className="text-left px-4 py-3">Role</th>
                <th className="text-left px-4 py-3">Status</th>
                <th className="text-left px-4 py-3">Created</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td className="px-4 py-6" colSpan="5">Loading…</td></tr>
              ) : items?.length ? (
                items.map((u) => (
                  <tr key={u.id} className="border-t border-slate-800">
                    <td className="px-4 py-3">{u.fullName}</td>
                    <td className="px-4 py-3 text-gray-300">{u.email}</td>
                    <td className="px-4 py-3"><Badge kind="engineer">Engineer</Badge></td>
                    <td className="px-4 py-3">
                      <Badge kind={u.isActive ? "active" : "inactive"}>
                        {u.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "—"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="px-4 py-6" colSpan="5">
                    <Empty title="No engineers found" hint="Try a different search." />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between p-4 border-t border-slate-800">
          <p className="text-xs text-gray-400">
            Page {page} of {totalPages}
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1.5 rounded-lg bg-slate-800 disabled:opacity-50"
            >
              Prev
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-3 py-1.5 rounded-lg bg-slate-800 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
