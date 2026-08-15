import { createContext, useContext, useState } from 'react';
import { loginUser, registerUser, updateProfile as updateProfileApi } from '../services/authService';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('educonnect_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(false);

  const persist = (res) => {
    localStorage.setItem('educonnect_user', JSON.stringify(res));
    localStorage.setItem('educonnect_token', res.token);
    setUser(res);
  };

  const login = async (credentials) => {
    setLoading(true);
    try {
      const res = await loginUser(credentials);
      persist(res);
      return { success: true, user: res };
    } catch (err) {
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const register = async (data) => {
    setLoading(true);
    try {
      const res = await registerUser(data);
      persist(res);
      return { success: true, user: res };
    } catch (err) {
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('educonnect_user');
    localStorage.removeItem('educonnect_token');
    setUser(null);
  };

  const updateUser = async (updates) => {
    try {
      const res = await updateProfileApi(updates);
      const merged = { ...user, ...res, token: user.token };
      localStorage.setItem('educonnect_user', JSON.stringify(merged));
      setUser(merged);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
