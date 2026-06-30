import { createContext, useContext, useEffect, useState } from "react";
import api from "../lib/api";

const AuthContext = createContext<any>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const fetchUser = async () => {
    const token = localStorage.getItem("viserXtoken");
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const res = await api.get("/me");
      setUser(res.data);
    } catch {
      localStorage.removeItem("viserXtoken");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchUser();
  }, []);

  const login = (token: string, user: any) => {
    localStorage.setItem("viserXtoken", token);
    setUser(user);
  };

  const logout = async () => {
    try {
      await api.post("/logout");
    } catch {
      // ignore
    }
    localStorage.removeItem("viserXtoken");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
