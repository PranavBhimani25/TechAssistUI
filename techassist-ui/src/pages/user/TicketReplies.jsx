import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import DashboardLayout from "../../layout/DashboardLayout";
import { getUserTicketReplies } from "../../services/userService";
import {toast} from "react-toastify";


export default function TicketReplies() {
  const { ticketId } = useParams();
  const [ticket, setTicket] = useState(null);
  const [replies, setReplies] = useState([]);
  const [loading, setLoading] = useState(true);


useEffect(() => {
  (async () => {
    try {
      const data = await getUserTicketReplies(ticketId);

      setTicket({
        id: data.id,
        title: data.title,
        status: data.status,
      });

      // ✅ SAFE
      setReplies(Array.isArray(data.replies) ? data.replies : []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load replies");
    } finally {
      setLoading(false);
    }
  })();
}, [ticketId]);


  return (
    <DashboardLayout>
      <h1 className="text-2xl font-semibold mb-4 text-blue-400">
        Ticket Replies
      </h1>

      {ticket && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 mb-6">
          <p className="text-gray-300">
            <b>Ticket:</b> {ticket.title}
          </p>
          <p className="text-gray-400 text-sm">
            Status: {ticket.status}
          </p>
        </div>
      )}

      <div className="space-y-4">
  {loading ? (
    <p className="text-gray-400">Loading replies...</p>
  ) : Array.isArray(replies) && replies.length > 0 ? (
    replies.map((r) => <ReplyCard key={r.id} reply={r} />)
  ) : (
    <p className="text-gray-400">No replies yet.</p>
  )}
</div>

    </DashboardLayout>
  );
}


function ReplyCard({ reply }) {
  const roleColor =
    reply.role === "Engineer"
      ? "text-blue-400"
      : reply.role === "Admin"
      ? "text-red-400"
      : "text-gray-400";

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
      <div className="flex justify-between items-center mb-1">
        <p className={`text-sm font-medium ${roleColor}`}>
          {reply.author} ({reply.role})
        </p>
        <p className="text-xs text-gray-500">
          {new Date(reply.createdAt).toLocaleString()}
        </p>
      </div>

      <p className="text-gray-200 text-sm">
        {reply.message}
      </p>
    </div>
  );
}
