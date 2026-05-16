// AuthContext provides the current user (name + role) to the whole app.
// The user can be a "student" or "admin". Auth state persists via localStorage.

import { createContext, useContext, useState, useEffect } from 'react';
import { getItem, setItem, KEYS } from '../utils/storage';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // On mount, restore auth state from localStorage.
  useEffect(() => {
    const saved = getItem(KEYS.AUTH);
    if (saved) setUser(saved);
    setLoading(false);
  }, []);

  function login(name, role, extra = {}) {
    const userData = { name, role, id: `user-${Date.now()}`, ...extra };
    setUser(userData);
    setItem(KEYS.AUTH, userData);
  }

  function logout() {
    setUser(null);
    localStorage.removeItem(KEYS.AUTH);
  }

  const isAdmin = user?.role === 'admin';
  const isLoggedIn = !!user;

  return (
    <AuthContext.Provider value={{ user, login, logout, isAdmin, isLoggedIn, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook so components don't have to import useContext + AuthContext separately.
export function useAuth() {
  return useContext(AuthContext);
}
