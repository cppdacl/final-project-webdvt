import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { type User } from "../types";
import { api } from "../api";

interface AuthCtx {
  user: User | null;
  loading: boolean;
  login: (username: string, pin: string) => Promise<void>;
  register: (username: string, fullName: string, pin: string) => Promise<void>;
  logout: () => void;
  refresh: () => Promise<void>;
}

const Ctx = createContext<AuthCtx>(null!);
export const useAuth = () => useContext(Ctx);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    try {
      const data = await api("/api/auth/me");
      setUser(data);
    } catch {
      setUser(null);
      localStorage.removeItem("gb_username");
    }
  };

  useEffect(() => {
    const u = localStorage.getItem("gb_username");
    if (u) refresh().finally(() => setLoading(false));
    else setLoading(false);
  }, []);

  const login = async (username: string, pin: string) => {
    const data = await api("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ username, pin }),
    });
    localStorage.setItem("gb_username", data.user.username);
    setUser(data.user);
  };

  const register = async (username: string, fullName: string, pin: string) => {
    const data = await api("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({ username, fullName, pin }),
    });
    localStorage.setItem("gb_username", data.user.username);
    setUser(data.user);
  };

  const logout = () => {
    localStorage.removeItem("gb_username");
    setUser(null);
  };

  return (
    <Ctx.Provider value={{ user, loading, login, register, logout, refresh }}>
      {children}
    </Ctx.Provider>
  );
};
