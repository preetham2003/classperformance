import { useState, useEffect, useCallback } from 'react';
import { authService } from '../services/authService';

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentTeacher, setCurrentTeacher] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is already authenticated on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (authService.isAuthenticated()) {
          const result = await authService.getCurrentUser();
          if (result.success) {
            setCurrentTeacher(result.teacher);
            setIsAuthenticated(true);
          } else {
            // Token is invalid or expired
            localStorage.removeItem('authToken');
            localStorage.removeItem('teacherId');
          }
        }
      } catch (err) {
        console.error('Auth check failed:', err);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = useCallback(async (email, password) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await authService.login(email, password);

      if (result.success) {
        setCurrentTeacher(result.teacher);
        setIsAuthenticated(true);
        return { success: true };
      } else {
        setError(result.error);
        return { success: false, error: result.error };
      }
    } catch (err) {
      const errorMsg = 'Login failed. Please try again.';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(async (name, email, password, subject, department = '', phone = '') => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await authService.register(name, email, password, subject, department, phone);

      if (result.success) {
        setCurrentTeacher(result.teacher);
        setIsAuthenticated(true);
        return { success: true };
      } else {
        setError(result.error);
        return { success: false, error: result.error };
      }
    } catch (err) {
      const errorMsg = 'Registration failed. Please try again.';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setIsLoading(true);

    try {
      await authService.logout();
      setCurrentTeacher(null);
      setIsAuthenticated(false);
      setError(null);
      return { success: true };
    } catch (err) {
      const errorMsg = 'Logout failed. Please try again.';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateProfile = useCallback(async (name, subject, department, phone) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await authService.updateProfile(name, subject, department, phone);

      if (result.success) {
        setCurrentTeacher(result.teacher);
        return { success: true };
      } else {
        setError(result.error);
        return { success: false, error: result.error };
      }
    } catch (err) {
      const errorMsg = 'Profile update failed.';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const changePassword = useCallback(async (oldPassword, newPassword, confirmPassword) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await authService.changePassword(oldPassword, newPassword, confirmPassword);

      if (result.success) {
        return { success: true, message: result.message };
      } else {
        setError(result.error);
        return { success: false, error: result.error };
      }
    } catch (err) {
      const errorMsg = 'Password change failed.';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    isAuthenticated,
    currentTeacher,
    isLoading,
    error,
    login,
    register,
    logout,
    updateProfile,
    changePassword
  };
};