import axios from "axios";

const api = axios.create({
  // This line is critical for deployment!
  baseURL: "https://student-attendance-api-g8bh.onrender.com/api",
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
