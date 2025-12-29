import { useEffect, useState } from "react";
import DashboardLayout from "../../layout/DashboardLayout";
import {
  getAdminDashboardStats,
  getAdminTickets,
  getEngineersName,
  assignTicket
} from "../../services/adminService";
import {toast} from "react-toastify";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalTickets: 0,
    openTickets: 0,
    inProgressTickets: 0,
    closedTickets: 0,
    totalUsers: 0,
    engineers: 0,
    activeUsers: 0,
  });
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [engineers, setEngineers] = useState([]);
  const [selectedEngineer, setSelectedEngineer] = useState("");


  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  const PAGE_SIZE = 10;

  const [page, setPage] = useState(1);

  const totalPages = Math.ceil(tickets.length / PAGE_SIZE);

  const pagedTickets = tickets.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  useEffect(() => {
    (async () => {
      try {
        const dashboard = await getAdminDashboardStats();
        const allTickets = await getAdminTickets();
        const engineersList = await getEngineersName();
        setEngineers(engineersList);

        setStats(dashboard);
        setTickets(allTickets); // latest 10 tickets
      } catch (err) {
        console.error(err);
        toast.error("Failed to load admin dashboard");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-semibold mb-6 text-blue-400">
        Admin Dashboard
      </h1>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatCard label="Total Tickets" value={stats.totalTickets} loading={loading} />
        <StatCard label="Open" value={stats.openTickets} loading={loading} />
        <StatCard label="In Progress" value={stats.inProgressTickets} loading={loading} />
        <StatCard label="Closed" value={stats.closedTickets} loading={loading} />
      </div>

       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard label="Total Users" value={stats.totalUsers} loading={loading} />
          <StatCard label="Engineers" value={stats.engineers} loading={loading} />
          <StatCard label="Active Users" value={stats.activeUsers} loading={loading} />
        </div>

     {/* Tickets Table */}
<div className="bg-slate-900 border border-slate-800 rounded-xl mt-8">
  <div className="p-4 border-b border-slate-800">
    <h2 className="text-lg font-semibold text-gray-200">
      All Tickets
    </h2>
  </div>

  <div className="overflow-x-auto">
    <table className="min-w-full text-sm">
      <thead className="bg-slate-800 text-gray-300">
        <tr>
          <th className="px-4 py-3 text-left">Title</th>
          <th className="px-4 py-3 text-left">Creator</th>
          <th className="px-4 py-3 text-left">Engineer</th>
          <th className="px-4 py-3 text-left">Priority</th>
          <th className="px-4 py-3 text-left">Status</th>
          <th className="px-4 py-3 text-left">Created</th>
          <th className="px-4 py-3 text-left">Action</th>
        </tr>
      </thead>
      <tbody>
        {pagedTickets.length ? (
          pagedTickets.map((t) => (
            <tr key={t.id} className="border-t border-slate-800">
              <td className="px-4 py-3">{t.title}</td>
              <td className="px-4 py-3">{t.creator}</td>
              <td className="px-4 py-3">{t.engineer}</td>
              <td className="px-4 py-3">
                <PriorityBadge value={t.priority} />
              </td>
              <td className="px-4 py-3">
                <StatusBadge value={t.status} />
              </td>
              <td className="px-4 py-3">
                {new Date(t.createdAt).toLocaleDateString()}
              </td>
              <td className="px-4 py-3">
                <button
                  onClick={() => {
                    setSelectedTicket(t);
                    setShowAssignModal(true);
                  }}
                  className="px-3 py-1 text-sm bg-blue-600 rounded hover:bg-blue-700"
                >
                  {t.engineer === "Unassigned" ? "Assign" : "Reassign"}
                </button>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="6" className="px-4 py-6 text-gray-400">
              No tickets found
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>

  {/* Pagination */}
  <div className="flex items-center justify-between p-4 border-t border-slate-800">
    <span className="text-sm text-gray-400">
      Page {page} of {totalPages}
    </span>

    <div className="flex gap-2">
      <button
        disabled={page === 1}
        onClick={() => setPage(page - 1)}
        className="px-3 py-1 bg-slate-800 rounded disabled:opacity-50"
      >
        Prev
      </button>

      <button
        disabled={page === totalPages}
        onClick={() => setPage(page + 1)}
        className="px-3 py-1 bg-slate-800 rounded disabled:opacity-50"
      >
        Next
      </button>
    </div>
  </div>
</div>

    {showAssignModal && (
      <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
        <div className="bg-slate-900 p-6 rounded-xl w-full max-w-md border border-slate-800">
          <h2 className="text-lg font-semibold mb-4 text-gray-200">
            Assign Engineer
          </h2>

          <select
            value={selectedEngineer.id}
            onChange={(e) => setSelectedEngineer(e.target.value)}
            className="w-full bg-slate-800 p-2 rounded mb-4"
          >
            <option value="">Select engineer</option>
            {engineers.map((e) => (
              <option key={e.id} value={e.id}>
                {e.fullName}
              </option>
            ))}
          </select>

          <div className="flex justify-end gap-2">
            <button
              onClick={() => setShowAssignModal(false)}
              className="px-4 py-2 bg-slate-700 rounded"
            >
              Cancel
            </button>

            <button
                onClick={async () => {
                  if (!selectedEngineer) {
                    toast.error("Select an engineer");
                    return;
                  }

                  try {
                    await assignTicket(
                      selectedTicket.id,
                      Number(selectedEngineer) // ✅ ensure number
                    );

                    toast.success("Engineer assigned");

                    // update UI immediately
                    setTickets((prev) =>
                      prev.map((t) =>
                        t.id === selectedTicket.id
                          ? {
                              ...t,
                              engineer:
                                engineers.find(
                                  (e) => e.id === Number(selectedEngineer)
                                )?.fullName || "Assigned",
                              status: "InProgress",
                            }
                          : t
                      )
                    );

                    setShowAssignModal(false);
                    setSelectedEngineer("");
                  } catch (err) {
                    console.error(err);
                    toast.error("Assignment failed");
                  }
                }}
                className="px-4 py-2 bg-blue-600 rounded"
              >
                Assign
              </button>

          </div>
        </div>
      </div>
    )}


    </DashboardLayout>
  );
}

/* ---------- UI helpers ---------- */

function StatCard({ label, value, loading }) {
  return (
    <div className="bg-slate-800 p-6 rounded-xl">
      <p className="text-gray-400 text-sm">{label}</p>
      <p className="text-3xl font-bold text-white mt-2">
        {loading ? "—" : value}
      </p>
    </div>
  );
}

function StatusBadge({ value }) {
  const map = {
    Open: "bg-blue-500/15 text-blue-300 border-blue-600/40",
    InProgress: "bg-yellow-500/15 text-yellow-300 border-yellow-600/40",
    Closed: "bg-green-500/15 text-green-300 border-green-600/40",
  };
  return (
    <span className={`px-2 py-1 text-xs rounded-full border ${map[value]}`}>
      {value}
    </span>
  );
}

function PriorityBadge({ value }) {
  const map = {
    Low: "bg-slate-500/15 text-slate-300 border-slate-600/40",
    Medium: "bg-yellow-500/15 text-yellow-300 border-yellow-600/40",
    High: "bg-red-500/15 text-red-300 border-red-600/40",
  };
  return (
    <span className={`px-2 py-1 text-xs rounded-full border ${map[value]}`}>
      {value}
    </span>
  );
}
