import { createContext, useContext, useEffect, useState } from "react";
import { getMe, loginUser, logoutUser } from "../services/auth";
import type { IUser } from "../services/user"; 
type User = IUser | null;

interface AuthContextType {
  user: User;
  loading: boolean;
  isAuthenticated: boolean;
  setUser: (user: User) => void;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  isAuthenticated: false,
  setUser: () => {},
  login: async () => {},
  logout: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User>(null);
  const [loading, setLoading] = useState(true);

  const isAuthenticated = !!user;

  
  useEffect(() => {
    getMe()
      .then((user) => setUser(user))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

 const login = async (email: string, password: string) => {
  try {
    
    await loginUser(email, password);

    
    const freshUser = await getMe();
    setUser(freshUser);
  } catch (error) {
    console.error("Login failed:", error);
    setUser(null);
    throw error;
  }
};


  const logout = async () => {
    try {
      await logoutUser();
    } finally {
      setUser(null);
      window.location.replace("/login");
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, isAuthenticated, setUser, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
