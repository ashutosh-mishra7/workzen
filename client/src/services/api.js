import axios from "axios";

/* ================= FINAL BASE URL FIX ================= */

// IMPORTANT: Hardcode production API URL to avoid Vercel env issues
const api = axios.create({
  baseURL: "https://workzen-api.onrender.com/api",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 20000,
});

/* ================= REQUEST INTERCEPTOR ================= */

api.interceptors.request.use(
  (config) => {
    try {
      const token = localStorage.getItem("token");

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch {}

    return config;
  },
  (error) => Promise.reject(error)
);

/* ================= RESPONSE INTERCEPTOR ================= */

api.interceptors.response.use(
  (response) => response,

  (error) => {
    const status = error?.response?.status;
    const url = error?.config?.url || "";

    const isAuthRequest =
      url.includes("/auth/login") ||
      url.includes("/auth/register");

    // logout only if token expired and not login/register
    if (status === 401 && !isAuthRequest) {
      try {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        if (window.location.pathname !== "/login") {
          window.location.href = "/login";
        }
      } catch {}
    }

    // attach backend message
    if (error?.response?.data?.message) {
      error.message = error.response.data.message;
    }

    return Promise.reject(error);
  }
);

export default api;