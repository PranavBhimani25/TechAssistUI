// src/services/ticketService.js
import api from "./api";

export const createTicket = async (payload) => {
  // payload: { title, description, productId, priority }
  const res = await api.post("/Ticket/CreateTicket", payload);
  return res.data;
};


