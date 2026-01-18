import  api from "./api";

export const getUserDashboardStats = async () => {
    const res = await api.get("/Common/GetUserDashboardStats");
    return res.data;
}

export const getMyTickets = async () => {
    const res = await api.get("/Ticket/GetTicketBySpecificUser");
    return res.data; 
}

export const getUserTicketReplies = async (ticketId) => {
    const res = await api.get(`/TicketReplies/GetRepliesForUserTicket/${ticketId}`);
    return res.data; 
}