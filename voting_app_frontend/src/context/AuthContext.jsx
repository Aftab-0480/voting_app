import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) fetchProfile();
    else setLoading(false);
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await api.get('/user/profile');
      setUser(res.data);
    } catch {
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  };

  const login = async (aadharCardNumber, password) => {
    const res = await api.post('/user/login', { aadharCardNumber, password });
    localStorage.setItem('token', res.data.token);
    await fetchProfile();
  };

  const signup = async (formData) => {
    const res = await api.post('/user/signup', formData);
    localStorage.setItem('token', res.data.token);
    await fetchProfile();
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, fetchProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);