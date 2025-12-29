import { useEffect, useState } from "react";
import DashboardLayout from "../../layout/DashboardLayout";
import {
  getEngineerDashboardStats,
  getEngineerTickets,
  updateTicketStatus,
  addReply,
} from "../../services/engineerService";
import {toast} from "react-toastify";

export default function EngineerDashboard() {
  const [stats, setStats] = useState({});
  const [tickets, setTickets] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [activeTicket, setActiveTicket] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        setStats(await getEngineerDashboardStats());
        setTickets(await getEngineerTickets());
      } catch {
        toast.error("Failed to load dashboard");
      }
    })();
  }, []);

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-semibold mb-6 text-blue-400">
        Engineer Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Stat label="Assigned" value={stats.assignedTickets} />
        <Stat label="Open" value={stats.openTickets} />
        <Stat label="In Progress" value={stats.inProgressTickets} />
        <Stat label="Closed" value={stats.closedTickets} />
      </div>

      <TicketTable
        tickets={tickets}
        onOpen={(ticket) => {
          setActiveTicket(ticket);
          setShowModal(true);
        }}
      />

      {showModal && activeTicket && (
        <EngineerTicketModal
          ticket={activeTicket}
          onClose={() => setShowModal(false)}
        />
      )}
    </DashboardLayout>
  );
}


function Stat({ label, value }) {
  return (
    <div className="bg-slate-800 p-6 rounded-xl">
      <p className="text-gray-400 text-sm">{label}</p>
      <p className="text-3xl font-bold text-white mt-2">{value || 0}</p>
    </div>
  );
}

function TicketTable({ tickets, onOpen }) {
  return (
    <div className="bg-slate-900 rounded-xl border border-slate-800">
      <div className="p-4 border-b border-slate-800">
        <h2 className="text-lg text-gray-200">Assigned Tickets</h2>
      </div>

      <table className="min-w-full text-sm">
        <thead className="bg-slate-800 text-gray-300 text-left">
          <tr>
            <th className="px-4 py-3">Title</th>
            <th className="px-4 py-3">Creator</th>
            <th className="px-4 py-3">Priority</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Action</th>
          </tr>
        </thead>
        <tbody>
          {tickets.map((t) => (
            <tr key={t.id} className="border-t border-slate-800">
              <td className="px-4 py-3">{t.title}</td>
              <td className="px-4 py-3">{t.creator}</td>
              <td className="px-4 py-3">{t.priority}</td>
              <td className="px-4 py-3">{t.status}</td>
              <td className="px-4 py-3">
                <button
                  onClick={() => onOpen(t)}
                  className="text-blue-400 hover:underline"
                >
                  Open
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}


function EngineerTicketModal({ ticket, onClose }) {
  const [status, setStatus] = useState(ticket.status);
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(false);

  const handleStatusUpdate = async () => {
    try {
      setLoading(true);
      await updateTicketStatus(ticket.id, status);
      toast.success("Status updated");
    } catch {
      toast.error("Failed to update status");
    } finally {
      setLoading(false);
    }
  };

  const handleReply = async () => {
    if (!reply.trim()) return toast.error("Reply cannot be empty");

    try {
      setLoading(true);
      await addReply(ticket.id, reply.trim());
      toast.success("Reply sent");
      setReply("");
    } catch {
      toast.error("Failed to send reply");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-slate-900 w-full max-w-xl p-6 rounded-xl border border-slate-800">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl text-gray-200 font-semibold">
            Ticket #{ticket.id}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            ✕
          </button>
        </div>

        <p className="text-sm text-gray-300 mb-3">
          <b>Title:</b> {ticket.title}
        </p>

        <div className="flex gap-3 mb-4">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="bg-slate-800 px-3 py-2 rounded"
          >
            <option value="Open">Open</option>
            <option value="In Progress">In Progress</option>
            <option value="Closed">Closed</option>
          </select>

          <button
            onClick={handleStatusUpdate}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 rounded"
          >
            Update Status
          </button>
        </div>

        <textarea
          value={reply}
          onChange={(e) => setReply(e.target.value)}
          rows={4}
          placeholder="Write a reply..."
          className="w-full bg-slate-800 p-3 rounded mb-3"
        />

        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 bg-slate-700 rounded">
            Close
          </button>
          <button
            onClick={handleReply}
            disabled={loading}
            className="px-4 py-2 bg-green-600 rounded"
          >
            Send Reply
          </button>
        </div>
      </div>
    </div>
  );
}



function StatCard({ label, value }) {
  return (
    <div className="bg-slate-800 p-6 rounded-xl">
      <p className="text-gray-400 text-sm">{label}</p>
      <p className="text-3xl font-bold text-white mt-2">{value || 0}</p>
    </div>
  );
}
