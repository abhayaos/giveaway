import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

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
      const res = await fetch('https://backend-giveaway.vercel.app/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      
      const data = await res.json();
      
      if (res.ok) {
        // Save token and user data
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setCurrentUser(data.user);
        navigate('/participants');
        return { success: true };
      } else {
        return { success: false, error: data.msg || 'Login failed' };
      }
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password, phone, referredBy = null) => {
    setLoading(true);
    try {
      const res = await fetch('https://backend-giveaway.vercel.app/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password, phone, referredBy }),
      });
      
      const data = await res.json();
      
      if (res.ok) {
        // Save token and user data
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setCurrentUser(data.user);
        navigate('/participants');
        return { success: true };
      } else {
        return { success: false, error: data.msg || 'Registration failed' };
      }
    } catch (error) {
      return { success: false, error: error.message };
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
      const token = localStorage.getItem('token');
      if (!token) return null;
      
      const response = await fetch('https://backend-giveaway.vercel.app/api/auth/profile', {
        headers: {
          'x-auth-token': token,
        },
      });
      
      if (response.ok) {
        const userData = await response.json();
        localStorage.setItem('user', JSON.stringify(userData));
        setCurrentUser(userData);
        return userData;
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
