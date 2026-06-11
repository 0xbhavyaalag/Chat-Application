import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('chat_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProfile() {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await api.get('/auth/me');
        setUser(response.data.user);
      } catch (_error) {
        localStorage.removeItem('chat_token');
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, [token]);

  async function register(payload) {
    const response = await api.post('/auth/register', payload);
    localStorage.setItem('chat_token', response.data.token);
    setToken(response.data.token);
    setUser(response.data.user);
    return response.data.user;
  }

  async function login(payload) {
    const response = await api.post('/auth/login', payload);
    localStorage.setItem('chat_token', response.data.token);
    setToken(response.data.token);
    setUser(response.data.user);
    return response.data.user;
  }

  function logout() {
    localStorage.removeItem('chat_token');
    setToken(null);
    setUser(null);
  }

  const value = useMemo(
    () => ({ user, token, loading, register, login, logout, setUser }),
    [user, token, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }
  return context;
}
