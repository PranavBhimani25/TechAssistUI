// src/services/adminService.js
import api from "./api";

// Adjust the endpoint to match your backend
// Example 1: Dedicated admin endpoint
export const createEngineer = async (payload) => {
  // payload: { fullName, email, password, isActive }
  const res = await api.post("/Admin/CreateEngineer", payload);
  return res.data;
};

export const getUsers = async ({ role, search, page = 1, pageSize = 10 } = {}) => {
  const res = await api.get("/Admin/GetAll", {
    params: { role, search, page, pageSize },
  });
  return res.data; // expect { items: [...], total: 123 }
};

// Adjust the endpoint to your backend route
export const fetchAllUsers = async () => {
  const res = await api.get("/Admin/GetAll"); // or "/users"
  return res.data; // should be an array of users
};

export const getEngineers = async ({ search, page = 1, pageSize = 10 } = {}) => {
  const res = await api.get("/Admin/GetAllEngineer", {
    params: { role: "Engineer", search, page, pageSize },
  });
  return res.data;
};

export const getTicket = async () => {
  const res = await api.get("/Ticket/GetAllTicket");
}

export const getAdminTickets = async () => {
  const res = await api.get("/Ticket/AdminDashboardTicket");
  return res.data;
}

export const getAdminDashboardStats = async () =>{
  const res = await api.get("/Common/GetDashboardStats");
  return res.data;
}

export const assignTicket = async (ticketId, engineerId) => {
  return api.patch(
    `/Ticket/${ticketId}/assign`,
    Number(engineerId), // ✅ RAW NUMBER (CRITICAL)
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
};

export const getEngineersName = async () => {
  const res = await api.get("/Common/GetAllEngineerName");
  return res.data;
};