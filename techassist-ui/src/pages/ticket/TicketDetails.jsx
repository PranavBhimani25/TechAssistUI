import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import DashboardLayout from "../../layout/DashboardLayout";
import { getTicketById } from "../../services/ticketService";
import env from "react-dotenv";
import { toast } from "react-hot-toast";

export default function TicketDetails() {
  const { ticketId } = useParams();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  

  

  const role = localStorage.getItem("role");

  useEffect(() => {
    fetchTicket();
  }, [ticketId]);

  const fetchTicket = async () => {
    try {
      const data = await getTicketById(ticketId);
      setTicket(data);
    } catch {
      toast.error("Failed to load ticket");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <DashboardLayout>Loading...</DashboardLayout>;
  if (!ticket) return <DashboardLayout>Ticket not found</DashboardLayout>;

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* HEADER */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-blue-400">
            Ticket #{ticket.id}
          </h1>

          <span className="px-3 py-1 text-sm rounded-full bg-slate-800">
            {ticket.status}
          </span>
        </div>
        {/* ROLE-SPECIFIC ACTIONS */}
        {role === "Engineer" && (
          <EngineerActions ticket={ticket} onUpdate={fetchTicket} />
        )}

        {role === "Admin" && (
          <AdminActions ticket={ticket} onUpdate={fetchTicket} />
        )}

        {/* DETAILS */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
          <Detail label="Title" value={ticket.title} />
          <Detail label="Description" value={ticket.description} />
          <Detail label="Priority" value={ticket.priority} />
          <Detail label="Product" value={ticket.product.name || "—"} />
          <Detail label="Created At" value={new Date(ticket.createdAt).toLocaleString()} />
        </div>
        

        {/* IMAGE OR PDF ATTACHMENT */}
        {ticket.imageUrl && (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <p className="text-sm text-gray-400 mb-2">Attachment</p>
            {/\.(pdf)$/i.test(ticket.imageUrl) ? (
              <iframe
                src={`${import.meta.env.VITE_API_URL}${ticket.imageUrl}`}
                title="Ticket PDF Attachment"
                className="w-full max-w-md h-96 rounded-lg border border-slate-700"
              />
            ) : (
              <img
                src={`${import.meta.env.VITE_API_URL}${ticket.imageUrl}`}
                alt="Ticket Attachment"
                className="max-w-md rounded-lg border border-slate-700"
              />
            )}
          </div>
        )}    

      </div>
    </DashboardLayout>
  );
}

function Detail({ label, value }) {
  return (
    <div>
      <p className="text-xs text-gray-400">{label}</p>
      <p className="text-gray-200">{value}</p>
    </div>
  );
}

function EngineerActions({ ticket, onUpdate }) {
  const [status, setStatus] = useState(ticket.status);
  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    try {
      setLoading(true);
      await updateTicketStatus(ticket.id, status);
      toast.success("Status updated");
      onUpdate(); // refresh ticket
    } catch {
      toast.error("Failed to update status");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
      <p className="text-sm text-gray-300 font-semibold">Engineer Actions</p>

      <div className="flex gap-3">
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="bg-slate-800 px-3 py-2 rounded"
        >
          <option value="Open">Open</option>
          <option value="InProgress">In Progress</option>
          <option value="Closed">Closed</option>
        </select>

        <button
          onClick={handleUpdate}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700"
        >
          Update
        </button>

        
      </div>
    </div>
  );
}

function AdminActions({ ticket, onUpdate }) {
  const [engineers, setEngineers] = useState([]);
  const [engineerId, setEngineerId] = useState(ticket.assignedEngineerId || "");

  useEffect(() => {
    loadEngineers();
  }, []);

  const loadEngineers = async () => {
    const list = await getEngineers();
    setEngineers(list);
  };

  const handleAssign = async () => {
    try {
      await assignEngineer(ticket.id, engineerId);
      toast.success("Engineer assigned");
      onUpdate();
    } catch {
      toast.error("Failed to assign engineer");
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
      <p className="text-sm text-gray-300 font-semibold">Admin Actions</p>

      <div className="flex gap-3">
        <select
          value={engineerId}
          onChange={(e) => setEngineerId(e.target.value)}
          className="bg-slate-800 px-3 py-2 rounded w-full"
        >
          <option value="">Unassigned</option>
          {engineers.map((e) => (
            <option key={e.id} value={e.id}>
              {e.fullName}
            </option>
          ))}
        </select>

        <button
          onClick={handleAssign}
          className="px-4 py-2 bg-green-600 rounded hover:bg-green-700"
        >
          Assign
        </button>
      </div>
    </div>
  );
}

