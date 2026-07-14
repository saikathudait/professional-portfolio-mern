import { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';
import toast from 'react-hot-toast';
import {
  getStoredJson,
  getStoredValue,
  removeStoredValue,
  setStoredValue,
} from '../utils/storage';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => getStoredJson('user'));
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(() => getStoredValue('token'));

  // Check if user is logged in on mount
  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = getStoredValue('token');
      const storedUser = getStoredJson('user');

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(storedUser);
        
        // Verify token is still valid
        try {
          const response = await api.get('/auth/me', { retry: false });
          setUser(response.data.user);
          setStoredValue('user', JSON.stringify(response.data.user));
        } catch (error) {
          // Token is invalid, clear storage
          removeStoredValue('token');
          removeStoredValue('user');
          setToken(null);
          setUser(null);
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  // Login function
  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token: newToken, user: newUser } = response.data;

      setStoredValue('token', newToken);
      setStoredValue('user', JSON.stringify(newUser));
      setToken(newToken);
      setUser(newUser);

      toast.success('Login successful!');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      toast.error(message);
      return { success: false, message };
    }
  };

  // Register function
  const register = async (name, email, password) => {
    try {
      const response = await api.post('/auth/register', {
        name,
        email,
        password,
      });
      const { token: newToken, user: newUser } = response.data;

      setStoredValue('token', newToken);
      setStoredValue('user', JSON.stringify(newUser));
      setToken(newToken);
      setUser(newUser);

      toast.success('Registration successful!');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed';
      toast.error(message);
      return { success: false, message };
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      removeStoredValue('token');
      removeStoredValue('user');
      setToken(null);
      setUser(null);
      toast.success('Logged out successfully');
    }
  };

  // Update profile
  const updateProfile = async (data) => {
    try {
      const response = await api.put('/auth/update', data);
      const updatedUser = response.data.user;
      
      setStoredValue('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      
      toast.success('Profile updated successfully');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Update failed';
      toast.error(message);
      return { success: false, message };
    }
  };

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    updateProfile,
    isAuthenticated: !!token && !!user,
    isAdmin: user?.role === 'admin',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
