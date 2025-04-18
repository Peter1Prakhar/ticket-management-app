import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import api from '../services/api';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'customer' | 'agent' | 'admin';
}

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAdmin: () => boolean;
  isAgent: () => boolean;
  isCustomer: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Check if user is already logged in (token in localStorage)
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        
        // Check if token is expired
        if (decoded.exp * 1000 < Date.now()) {
          localStorage.removeItem('token');
          setCurrentUser(null);
          setLoading(false);
          return;
        }
        
        // Set auth header
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        // Get current user info
        api.get('/api/auth/me')
          .then(response => {
            setCurrentUser(response.data.user);
          })
          .catch(() => {
            localStorage.removeItem('token');
            setCurrentUser(null);
          })
          .finally(() => setLoading(false));
      } catch (error) {
        localStorage.removeItem('token');
        setCurrentUser(null);
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, []);
  
  // Login
  const login = async (email: string, password: string) => {
    try {
      const response = await api.post('/api/auth/login', { email, password });
      const { user, token } = response.data;
      
      // Save token to localStorage
      localStorage.setItem('token', token);
      
      // Set auth header
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      setCurrentUser(user);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message || 'Login failed');
      }
      throw new Error('Login failed');
    }
  };
  
  // Register
  const register = async (name: string, email: string, password: string) => {
    try {
      const response = await api.post('/api/auth/register', { name, email, password });
      const { user, token } = response.data;
      
      // Save token to localStorage
      localStorage.setItem('token', token);
      
      // Set auth header
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      setCurrentUser(user);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message || 'Registration failed');
      }
      throw new Error('Registration failed');
    }
  };
  
  // Logout
  const logout = async () => {
    try {
      await api.post('/api/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Remove token from localStorage
      localStorage.removeItem('token');
      
      // Remove auth header
      delete api.defaults.headers.common['Authorization'];
      
      setCurrentUser(null);
    }
  };
  
  // Role checks
  const isAdmin = () => currentUser?.role === 'admin';
  const isAgent = () => ['admin', 'agent'].includes(currentUser?.role || '');
  const isCustomer = () => currentUser?.role === 'customer';
  
  const value = {
    currentUser,
    loading,
    login,
    register,
    logout,
    isAdmin,
    isAgent,
    isCustomer,
  };
  
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};