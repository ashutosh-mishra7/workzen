import axios from "axios";

/* ================= BASE URL ================= */

// Use environment variable in production
const baseURL =
  import.meta.env.VITE_API_URL ||
  "https://workzen-api.onrender.com/api";

/* ================= AXIOS INSTANCE ================= */

const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000,
});

/* ================= REQUEST INTERCEPTOR ================= */

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/* ================= RESPONSE INTERCEPTOR ================= */

api.interceptors.response.use(
  (response) => response,

  (error) => {
    const status = error.response?.status;
    const url = error.config?.url;

    const isAuthRequest =
      url?.includes("/auth/login") ||
      url?.includes("/auth/register");

    // Logout only if token expired
    if (status === 401 && !isAuthRequest) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      window.location.href = "/login";
    }

    // Better error message
    if (error.response?.data?.message) {
      error.message = error.response.data.message;
    }

    return Promise.reject(error);
  }
);

export default api;