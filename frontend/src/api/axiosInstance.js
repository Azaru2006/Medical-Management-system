import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api"
});

// Attach JWT token to every request automatically
api.interceptors.request.use((config) => {
  const stored = localStorage.getItem("hms_user");
  if (stored) {
    const { token } = JSON.parse(stored);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// If token expired, redirect to login
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("hms_user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;