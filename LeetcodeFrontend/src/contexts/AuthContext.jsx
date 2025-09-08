// contexts/AuthContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const response = await axios.get('/user/check', { withCredentials: true });
      setUser(response.data.user);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await axios.post('/user/login', { emailId: email, password }, { withCredentials: true });
      setUser(response.data.user);
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data || 'Login failed' };
    }
  };

  const register = async (userData) => {
    try {
      const response = await axios.post('/user/register', userData, { withCredentials: true });
      setUser(response.data.user);
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data || 'Registration failed' };
    }
  };

  const logout = async () => {
    try {
      await axios.post('/user/logout', {}, { withCredentials: true });
      setUser(null);
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data || 'Logout failed' };
    }
  };

  const value = {
    user,
    login,
    register,
    logout,
    checkAuthStatus
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};