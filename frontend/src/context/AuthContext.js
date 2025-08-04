import React, { createContext, useState, useEffect, useCallback } from 'react';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import API from '../utils/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [cookies, setCookie, removeCookie] = useCookies(['token']);
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Define logout with useCallback to maintain stable reference
  const logout = useCallback(() => {
    API.get('/auth/logout');
    removeCookie('token', { path: '/' });
    setUser(null);
    setIsAuthenticated(false);
    navigate('/');
  }, [navigate, removeCookie]);

  // Define verifyToken separately
  const verifyToken = useCallback(async () => {
    try {
      if (cookies.token) {
        const res = await API.get('/auth/me');
        setUser(res.data.user);
        setIsAuthenticated(true);
      }
    } catch (err) {
      logout();
    } finally {
      setLoading(false);
    }
  }, [cookies.token, logout]);

  useEffect(() => {
    verifyToken();
  }, [verifyToken]); // Now only depends on verifyToken

  const login = async (email, password) => {
    try {
      const res = await API.post('/auth/login', { email, password });
      setCookie('token', res.data.token, { path: '/' });
      setUser(res.data.user);
      setIsAuthenticated(true);
      navigate('/rooms');
    } catch (err) {
      throw err;
    }
  };

  const register = async (name, email, password) => {
    try {
      const res = await API.post('/auth/register', { name, email, password });
      setCookie('token', res.data.token, { path: '/' });
      setUser(res.data.user);
      setIsAuthenticated(true);
      navigate('/rooms');
    } catch (err) {
      throw err;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        loading,
        login,
        register,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};