import api from "./api";

export const getEngineerDashboardStats = async () =>
  (await api.get("/Common/GetEngineerDashboard")).data;

export const getEngineerTickets = async () =>
  (await api.get("/Ticket/GetEngineerTickets")).data;

export const updateTicketStatus = async (id, status) =>
  api.patch(`/Ticket/${id}/status`, status, {
    headers: { "Content-Type": "application/json" },
  });

export const addReply = async (ticketId, message) =>
  api.post(`/TicketReplies/${ticketId}`, message, 
    {
      headers: {
        "Content-Type": "application/json",
      },

    }
  );
