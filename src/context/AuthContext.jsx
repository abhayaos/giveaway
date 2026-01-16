import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Check if user is logged in on app start
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Get user profile from localStorage or make API call to verify token
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          setCurrentUser(JSON.parse(storedUser));
        } catch (error) {
          localStorage.removeItem('user');
          localStorage.removeItem('token');
        }
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await api.post('/auth/login', { email, password });
      
      if (response.data) {
        // Save token and user data
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        setCurrentUser(response.data.user);
        navigate('/participants');
        return { success: true };
      } else {
        return { success: false, error: response.data.msg || 'Login failed' };
      }
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.msg || error.message || 'Login failed' 
      };
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password, phone, referredBy = null) => {
    setLoading(true);
    try {
      const response = await api.post('/auth/register', { 
        name, 
        email, 
        password, 
        phone, 
        referredBy 
      });
      
      if (response.data) {
        // Save token and user data
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        setCurrentUser(response.data.user);
        navigate('/participants');
        return { success: true };
      } else {
        return { success: false, error: response.data.msg || 'Registration failed' };
      }
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.msg || error.message || 'Registration failed' 
      };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setCurrentUser(null);
    navigate('/');
  };

  const updateUserProfile = async () => {
    try {
      const response = await api.get('/auth/profile');
      if (response.data) {
        localStorage.setItem('user', JSON.stringify(response.data));
        setCurrentUser(response.data);
        return response.data;
      }
    } catch (error) {
      console.error('Error updating user profile:', error);
    }
    return null;
  };

  const value = {
    currentUser,
    login,
    register,
    logout,
    updateUserProfile,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

// Protected Route Component
export function ProtectedRoute({ children }) {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
    }
  }, [currentUser, navigate]);
  
  return currentUser ? children : null;
}

// Admin Route Component
export function AdminRoute({ children }) {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
    } else if (currentUser.role !== 'admin' && currentUser.role !== 'organizer') {
      navigate('/participants'); // Redirect non-admins to participants page
    }
  }, [currentUser, navigate]);
  
  return currentUser && (currentUser.role === 'admin' || currentUser.role === 'organizer') ? children : null;
}
