const API_BASE_URL =  'http://localhost:5000/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('authToken');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` })
  };
};

export const authService = {
  // Register new teacher
  register: async (name, email, password, subject, department = '', phone = '') => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          password,
          subject,
          department,
          phone
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      if (data.token) {
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('teacherId', data.teacher.id);
      }

      return { success: true, teacher: data.teacher, token: data.token };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Login with email and password
  login: async (email, password) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      if (data.token) {
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('teacherId', data.teacher.id);
      }

      return { success: true, teacher: data.teacher, token: data.token };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Logout
  logout: async () => {
    try {
      await fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
        headers: getAuthHeaders()
      });

      localStorage.removeItem('authToken');
      localStorage.removeItem('teacherId');
      return { success: true };
    } catch (error) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('teacherId');
      return { success: false, error: error.message };
    }
  },

  // Get current user
  getCurrentUser: async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        return { success: false, error: 'No token found' };
      }

      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        method: 'GET',
        headers: getAuthHeaders()
      });

      const data = await response.json();

      if (!response.ok) {
        localStorage.removeItem('authToken');
        localStorage.removeItem('teacherId');
        throw new Error(data.message || 'Failed to get user');
      }

      return { success: true, teacher: data.teacher };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem('authToken') && !!localStorage.getItem('teacherId');
  },

  // Update profile
  updateProfile: async (name, subject, department, phone) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/update-profile`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ name, subject, department, phone })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Update failed');
      }

      return { success: true, teacher: data.teacher };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Change password
  changePassword: async (oldPassword, newPassword, confirmPassword) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/change-password`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ oldPassword, newPassword, confirmPassword })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Password change failed');
      }

      return { success: true, message: data.message };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
};