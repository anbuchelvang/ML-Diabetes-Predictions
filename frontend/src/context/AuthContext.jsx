import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiRequest } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('diabetes_auth_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      if (token) {
        try {
          const res = await apiRequest('/auth/profile', 'GET', null, token);
          setUser(res.user);
        } catch (err) {
          console.warn('Session expired or invalid token');
          logout();
        }
      }
      setLoading(false);
    };
    fetchProfile();
  }, [token]);

  const login = async (emailOrUsername, password) => {
    const res = await apiRequest('/auth/login', 'POST', {
      email_or_username: emailOrUsername,
      password: password
    });
    setToken(res.token);
    setUser(res.user);
    localStorage.setItem('diabetes_auth_token', res.token);
    return res;
  };

  const register = async (username, email, password) => {
    const res = await apiRequest('/auth/register', 'POST', {
      username,
      email,
      password
    });
    setToken(res.token);
    setUser(res.user);
    localStorage.setItem('diabetes_auth_token', res.token);
    return res;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('diabetes_auth_token');
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
