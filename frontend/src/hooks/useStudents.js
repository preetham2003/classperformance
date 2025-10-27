import { useState, useCallback, useEffect } from 'react';
import { studentService } from '../services/studentService';

export const useStudents = (teacherId) => {
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [statistics, setStatistics] = useState(null);

  // Fetch students on component mount or when teacherId changes
  useEffect(() => {
    if (teacherId) {
      fetchStudents();
      fetchStatistics();
    }
  }, [teacherId]);

  const fetchStudents = useCallback(async (search = '', filterMarks = 'all') => {
    if (!teacherId) return;

    setIsLoading(true);
    setError(null);

    try {
      const result = await studentService.getStudents(search, filterMarks);
      if (result.success) {
        setStudents(result.students);
        if (result.statistics) {
          setStatistics(result.statistics);
        }
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Failed to fetch students');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [teacherId]);

  const fetchStatistics = useCallback(async () => {
    if (!teacherId) return;

    try {
      const result = await studentService.getStatistics();
      if (result.success) {
        setStatistics(result.statistics);
      }
    } catch (err) {
      console.error('Failed to fetch statistics:', err);
    }
  }, [teacherId]);

  const updateStudent = useCallback(async (studentId, data) => {
    if (!teacherId) return { success: false };

    setIsLoading(true);
    setError(null);

    try {
      const result = await studentService.updateStudent(studentId, data);
      if (result.success) {
        setStudents(prev =>
          prev.map(s => s._id === studentId ? result.student : s)
        );
        await fetchStatistics();
        return { success: true };
      } else {
        setError(result.error);
        return { success: false, error: result.error };
      }
    } catch (err) {
      const errorMsg = 'Failed to update student';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setIsLoading(false);
    }
  }, [teacherId, fetchStatistics]);

  const addPerformance = useCallback(async (name, subject, marks, remarks, parentName = '', parentEmail = '', parentPhone = '', rollNumber = '', attendance = 0) => {
    if (!teacherId) return { success: false };

    setIsLoading(true);
    setError(null);

    try {
      const result = await studentService.createStudent(name, subject, marks, remarks, parentName, parentEmail, parentPhone, rollNumber, attendance);
      if (result.success) {
        setStudents(prev => [...prev, result.student]);
        await fetchStatistics();
        return { success: true };
      } else {
        setError(result.error);
        return { success: false, error: result.error };
      }
    } catch (err) {
      const errorMsg = 'Failed to add performance';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setIsLoading(false);
    }
  }, [teacherId, fetchStatistics]);

  const deleteStudent = useCallback(async (studentId) => {
    if (!teacherId) return { success: false };

    setIsLoading(true);
    setError(null);

    try {
      const result = await studentService.deleteStudent(studentId);
      if (result.success) {
        setStudents(prev => prev.filter(s => s._id !== studentId));
        await fetchStatistics();
        return { success: true };
      } else {
        setError(result.error);
        return { success: false, error: result.error };
      }
    } catch (err) {
      const errorMsg = 'Failed to delete student';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setIsLoading(false);
    }
  }, [teacherId, fetchStatistics]);

  const searchStudents = useCallback(async (searchTerm, filterMarks = 'all') => {
    if (!teacherId) return { success: false };

    setIsLoading(true);
    setError(null);

    try {
      const result = await studentService.searchStudents(searchTerm, filterMarks);
      if (result.success) {
        return { success: true, students: result.students };
      } else {
        setError(result.error);
        return { success: false, error: result.error };
      }
    } catch (err) {
      const errorMsg = 'Search failed';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setIsLoading(false);
    }
  }, [teacherId]);

  return {
    students,
    isLoading,
    error,
    statistics,
    fetchStudents,
    updateStudent,
    addPerformance,
    deleteStudent,
    searchStudents,
    fetchStatistics
  };
};