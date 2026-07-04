import axios from "axios";

const api = axios.create({
  baseURL: process.env.VITE_API_URL || "http://localhost:5000/api",
  withCredentials: true, // Required for cookies/sessions
});

// Interceptor to add Token to headers automatically (Phase 6)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
