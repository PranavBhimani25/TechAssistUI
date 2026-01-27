import { useEffect, useState } from "react";
import DashboardLayout from "../../layout/DashboardLayout";
import { getUserDashboardStats, getMyTickets } from "../../services/userService";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

export default function UserDashboard() {
  const [stats, setStats] = useState({
    totalTickets: 0,
    openTickets: 0,
    inProgressTickets: 0,
    closedTickets: 0,
  });
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
        const dashboard = await getUserDashboardStats();
        const myTickets = await getMyTickets();

        setStats(dashboard);
        setTickets(myTickets); 
      } catch (err) {
        console.error(err);
        toast.error("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-blue-400">User Dashboard</h1>
        <Link
          to="/user/tickets/new"
          className="px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700"
        >
          + Create Ticket
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatCard label="Total Tickets" value={stats.totalTickets} loading={loading} />
        <StatCard label="Open" value={stats.openTickets} loading={loading} />
        <StatCard label="In Progress" value={stats.inProgressTickets} loading={loading} />
        <StatCard label="Closed" value={stats.closedTickets} loading={loading} />
      </div>

      {/* Recent Tickets */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl">
        <div className="flex items-center justify-between p-4 border-b border-slate-800">
          <h2 className="text-lg font-semibold text-gray-200">Recent Tickets</h2>
          
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-800 text-gray-300">
              <tr>
                <th className="px-4 py-3 text-left">Title</th>
                <th className="px-4 py-3 text-left">Priority</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Created</th>
                <th className="px-4 py-3 text-left">View Replies</th>
                <th className="px-4 py-3 text-left">View Ticket</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="4" className="px-4 py-6">Loading…</td></tr>
              ) : pagedTickets.length ? (
                pagedTickets.map((t) => (
                  <tr key={t.id} className="border-t border-slate-800">
                    <td className="px-4 py-3">{t.title}</td>
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
                      <Link
                        to={`/user/tickets/${t.id}/replies`}
                        className="text-blue-400 hover:underline"
                      >
                        View Replies
                      </Link>
                      </td>
                      <td className="px-4 py-3">
                      <Link
                        to={`/tickets/${t.id}`}
                        className="text-blue-400 hover:underline"> View Ticket
                      </Link>
                      </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-4 py-6 text-gray-400">
                    No tickets found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
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
    </DashboardLayout>
  );
}

/* ---------- UI Helpers ---------- */

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
    "In Progress": "bg-yellow-500/15 text-yellow-300 border-yellow-600/40",
    Closed: "bg-green-500/15 text-green-300 border-green-600/40",
  };
  return (
    <span className={`inline-flex items-center px-2 py-1 text-xs rounded-full border whitespace-nowrap ${map[value]}`}>
      {value === "In Progress" ? "In Progress" : value}
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
