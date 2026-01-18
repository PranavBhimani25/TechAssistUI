import api from "./api";

export const getReplies = (ticketId) =>
  api.get(`/TicketReplies/GetRepliesForUserTicket/${ticketId}`).then(r => r.data);

export const getUserTicketReplies = async (ticketId) => {
    const res = await api.get(`/TicketReplies/GetRepliesForUserTicket/${ticketId}`);
    return res.data; // expect { id, title, status, replies: [...] }
}

export const addReply = async (ticketId, message) =>
  api.post(`/TicketReplies/${ticketId}`, message, 
    {
      headers: {
        "Content-Type": "application/json",
      },

    }
  );