import api from "./api";

export const getProducts = async () => {
   // Expecting array like: [{ id: 1, name: "HP LaserJet 1020" }, ...]
   const res = await api.get("/Common/GetProduct");
   return res.data;
}

export const getMyProfile = async () => {
  const res = await api.get("/Common/GetProfile");
  return res.data;
};

export const updateMyProfile = async (payload) => {
  const res = await api.put("/Common/UpDateProfile", payload);
  return res.data;
};


