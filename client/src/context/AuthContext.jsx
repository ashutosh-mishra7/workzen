import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";

import api from "../services/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {

  /* ================= STATE ================= */

  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem("user");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [loading, setLoading] = useState(true);


  /* ================= INIT AUTH ================= */

  useEffect(() => {

    let isMounted = true;

    const initAuth = async () => {

      const token = localStorage.getItem("token");

      if (!token) {
        if (isMounted) setLoading(false);
        return;
      }

      try {

        const res = await api.get("/auth/user");

        if (!isMounted) return;

        setUser(res.data);

        localStorage.setItem(
          "user",
          JSON.stringify(res.data)
        );

      } catch (err) {

        console.error("Auth Init Error:", err);

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        if (isMounted) setUser(null);

      } finally {

        if (isMounted) setLoading(false);

      }

    };

    initAuth();

    return () => {
      isMounted = false;
    };

  }, []);



  /* ================= LOGIN ================= */

  const login = useCallback(async (email, password) => {

    try {

      const res = await api.post("/auth/login", {
        email,
        password,
      });

      const { token, user } = res.data;

      if (!token || !user) {
        throw new Error("Invalid login response");
      }

      localStorage.setItem("token", token);

      localStorage.setItem(
        "user",
        JSON.stringify(user)
      );

      setUser(user);

      return user;

    } catch (err) {

      console.error("Login Error:", err);

      const message =
        err.response?.data?.message ||
        err.message ||
        "Wrong email or password";

      // normalize error
      throw {
        response: {
          data: {
            message,
          },
          status: err.response?.status || 401,
        },
      };

    }

  }, []);



  /* ================= REGISTER ================= */

  const register = useCallback(
    async (name, email, password) => {

      try {

        const res = await api.post("/auth/register", {
          name,
          email,
          password,
        });

        const { token, user } = res.data;

        if (!token || !user) {
          throw new Error("Invalid register response");
        }

        localStorage.setItem("token", token);

        localStorage.setItem(
          "user",
          JSON.stringify(user)
        );

        setUser(user);

        return user;

      } catch (err) {

        console.error("Register Error:", err);

        const message =
          err.response?.data?.message ||
          err.message ||
          "Registration failed";

        throw {
          response: {
            data: {
              message,
            },
            status: err.response?.status || 400,
          },
        };

      }

    },
    []
  );



  /* ================= LOGOUT ================= */

  const logout = useCallback(() => {

    localStorage.removeItem("token");

    localStorage.removeItem("user");

    setUser(null);

  }, []);



  /* ================= CONTEXT VALUE ================= */

  const value = useMemo(
    () => ({

      user,

      loading,

      isAuthenticated: !!user,

      login,

      register,

      logout,

    }),
    [
      user,
      loading,
      login,
      register,
      logout,
    ]
  );



  /* ================= PROVIDER ================= */

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );

};



/* ================= HOOK ================= */

export const useAuth = () => {

  const ctx = useContext(AuthContext);

  if (!ctx) {
    throw new Error(
      "useAuth must be used within AuthProvider"
    );
  }

  return ctx;

};