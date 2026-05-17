import axios from "axios";

const api = axios.create({
  // Paksa selalu pakai path relatif
  baseURL: "/api",
  timeout: 5000,
});

export default api;