import { createContext, useContext, useEffect, useMemo, useState } from "react";
import api from "../api/client";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);

  const persistSession = (nextUser, nextToken) => {
    localStorage.setItem("token", nextToken);
    localStorage.setItem("user", JSON.stringify(nextUser));
    setToken(nextToken);
    setUser(nextUser);
  };

  const clearSession = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  };

  const login = async (payload) => {
    const { data } = await api.post("/auth/login", payload);
    persistSession(
      {
        _id: data._id,
        name: data.name,
        email: data.email,
        role: data.role,
      },
      data.token,
    );
    return data;
  };

  const signup = async (payload) => {
    const { data } = await api.post("/auth/signup", payload);
    persistSession(
      {
        _id: data._id,
        name: data.name,
        email: data.email,
        role: data.role,
      },
      data.token,
    );
    return data;
  };

  const logout = () => {
    clearSession();
  };

  useEffect(() => {
    const bootstrap = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      const cachedUser = localStorage.getItem("user");
      if (cachedUser) {
        setUser(JSON.parse(cachedUser));
      }

      try {
        const { data } = await api.get("/auth/me");
        setUser(data);
        localStorage.setItem("user", JSON.stringify(data));
      } catch (error) {
        clearSession();
      } finally {
        setLoading(false);
      }
    };

    bootstrap();
  }, [token]);

  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      login,
      signup,
      logout,
      isAuthenticated: Boolean(token && user),
    }),
    [user, token, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
