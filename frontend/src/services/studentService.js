const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('authToken');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` })
  };
};

export const studentService = {
  // Get all students for logged-in teacher
  getStudents: async (search = '', filterMarks = 'all', sort = 'lastUpdated') => {
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (filterMarks !== 'all') params.append('filterMarks', filterMarks);
      if (sort) params.append('sort', sort);

      const response = await fetch(
        `${API_BASE_URL}/students?${params.toString()}`,
        {
          method: 'GET',
          headers: getAuthHeaders()
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch students');
      }

      return { success: true, students: data.students, statistics: data.statistics };
    } catch (error) {
      return { success: false, error: error.message, students: [], statistics: null };
    }
  },

  // Get single student details
  getStudent: async (studentId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/students/${studentId}`, {
        method: 'GET',
        headers: getAuthHeaders()
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Student not found');
      }

      return { success: true, student: data.student };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Create new student
  createStudent: async (name, subject, marks, remarks, parentName = '', parentEmail = '', parentPhone = '', rollNumber = '', attendance = 0) => {
    try {
      const response = await fetch(`${API_BASE_URL}/students`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          name,
          subject,
          marks: parseInt(marks),
          remarks,
          parentName,
          parentEmail,
          parentPhone,
          rollNumber,
          attendance: parseInt(attendance)
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create student');
      }

      return { success: true, student: data.student };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Update student performance
  updateStudent: async (studentId, data) => {
    try {
      const response = await fetch(`${API_BASE_URL}/students/${studentId}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          marks: data.marks ? parseInt(data.marks) : undefined,
          remarks: data.remarks,
          ...(data.name && { name: data.name }),
          ...(data.subject && { subject: data.subject }),
          ...(data.attendance !== undefined && { attendance: parseInt(data.attendance) })
        })
      });

      const data_response = await response.json();

      if (!response.ok) {
        throw new Error(data_response.message || 'Failed to update student');
      }

      return { success: true, student: data_response.student };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Delete student
  deleteStudent: async (studentId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/students/${studentId}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to delete student');
      }

      return { success: true, message: data.message };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Get performance statistics
  getStatistics: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/students/statistics/overview`, {
        method: 'GET',
        headers: getAuthHeaders()
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch statistics');
      }

      return { success: true, statistics: data.statistics };
    } catch (error) {
      return { success: false, error: error.message, statistics: null };
    }
  },

  // Search students
  searchStudents: async (searchTerm, filterMarks = 'all') => {
    try {
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (filterMarks !== 'all') params.append('filterMarks', filterMarks);

      const response = await fetch(
        `${API_BASE_URL}/students?${params.toString()}`,
        {
          method: 'GET',
          headers: getAuthHeaders()
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Search failed');
      }

      return { success: true, students: data.students };
    } catch (error) {
      return { success: false, error: error.message, students: [] };
    }
  }
};