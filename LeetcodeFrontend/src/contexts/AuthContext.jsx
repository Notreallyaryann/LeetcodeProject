import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

const api = axios.create({
  baseURL: 'http://localhost:3000', 
  withCredentials: true,            
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const response = await api.get('/user/check');
      setUser(response.data.user);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await api.post('/user/login', { emailId: email, password });
      setUser(response.data.user);
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data || 'Login failed' };
    }
  };

  const register = async (userData) => {
    try {
      const response = await api.post('/user/register', userData);
      setUser(response.data.user);
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data || 'Registration failed' };
    }
  };

  const logout = async () => {
    try {
      await api.post('/user/logout');
      setUser(null);
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data || 'Logout failed' };
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, checkAuthStatus }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
