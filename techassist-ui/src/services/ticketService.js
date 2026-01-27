// src/services/ticketService.js
import api from "./api";

export const createTicket = async (payload) => {
  // payload: { title, description, productId, priority }
  const res = await api.post("/Ticket/CreateTicket", payload,{
    headers: { "Content-Type": "multipart/form-data" }
  });
  return res.data;
};

export const getTicketById = async (ticketId) => {
  const res = await api.get(`/Ticket/GetTicketById/${ticketId}`);
  return res.data;
};


