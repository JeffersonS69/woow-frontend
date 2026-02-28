import { createContext, useContext, useState, ReactNode, useMemo } from "react";

interface AuthContextType {
  user: null | { id: string; email: string };
  login: (user: { id: string; email: string }) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: Readonly<{ children: ReactNode }>) {
  const [user, setUser] = useState<AuthContextType["user"]>(null);
  const login = (u: { id: string; email: string }) => setUser(u);
  const logout = () => setUser(null);

  const value = useMemo(() => ({ user, login, logout }), [user, login, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
