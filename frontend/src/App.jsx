import React, { useState } from 'react';
import LoginForm from './components/Auth/LoginForm';
import Sidebar from './components/Layout/Sidebar';
import Header from './components/Layout/Header';
import DashboardOverview from './components/Dashboard/DashboardOverview';
import StudentList from './components/Dashboard/StudentList';
import AddPerformance from './components/Dashboard/AddPerformance';
import TeacherProfile from './components/Profile/TeacherProfile';
import EditModal from './components/Dashboard/EditModal';
import Toast from './components/Common/Toast';
import { useAuth } from './hooks/useAuth';
import { useStudents } from './hooks/useStudents';
import { useToast } from './hooks/useToast';
import RegistrationForm from './components/Auth/Register';
import './App.css';

function App() {
  const { isAuthenticated, currentTeacher, isLoading: authLoading, login, logout } = useAuth();
  const { students, isLoading: studentsLoading, statistics, updateStudent, addPerformance, deleteStudent, fetchStudents } = useStudents(currentTeacher?.id);
  const { toast, showToast, closeToast } = useToast();

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentPage, setCurrentPage] = useState('overview');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showRegister, setShowRegister] = useState(false); 

  const handleLogin = async (email, password) => {
    const result = await login(email, password);
    if (result.success) {
      showToast('Login successful!', 'success');
      setCurrentPage('overview');
    } else {
      showToast(result.error, 'error');
    }
    return result;
  };

    const handleRegister = async (data) => {
    const result = await register(name, email, password);
    if (result.success) {
      showToast('Registration successful! You can now log in.', 'success');
      setShowRegister(false); 
    } else {
      showToast(result.error, 'error');
    }
    return result;
  };

  const handleLogout = async () => {
    await logout();
    showToast('Logged out successfully', 'success');
  };

  const handleEditStudent = (student) => {
    setSelectedStudent(student);
    setShowEditModal(true);
  };

  const handleSaveEdit = async (data) => {
    const result = await updateStudent(selectedStudent._id, {
      marks: parseInt(data.marks),
      remarks: data.remarks
    });

    if (result.success) {
      showToast('Student performance updated successfully', 'success');
      setShowEditModal(false);
      setSelectedStudent(null);
    } else {
      showToast(result.error, 'error');
    }
  };

  const handleAddPerformance = async (name, subject, marks, remarks, parentName = '', parentEmail = '', parentPhone = '', rollNumber = '', attendance = 0) => {
    const result = await addPerformance(name, subject, marks, remarks, parentName, parentEmail, parentPhone, rollNumber, attendance);

    if (result.success) {
      showToast('Performance added successfully', 'success');
      setCurrentPage('list');
    } else {
      showToast(result.error, 'error');
    }
  };

  const handleDeleteStudent = async (studentId) => {
    const result = await deleteStudent(studentId);

    if (result.success) {
      showToast('Student deleted successfully', 'success');
    } else {
      showToast(result.error, 'error');
    }
  };

  const handleRefreshStudents = async () => {
    await fetchStudents();
  };

   if (!isAuthenticated) {
    return showRegister ? (
      <RegistrationForm
        onRegister={handleRegister}
        isLoading={authLoading}
        onSwitchToLogin={() => setShowRegister(false)} 
      />
    ) : (
      <LoginForm
        onLogin={handleLogin}
        isLoading={authLoading}
        onSwitchToRegister={() => setShowRegister(true)} 
      />
    );
  }

  return (
    <div className="app-container">
      <Sidebar
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        onLogout={handleLogout}
      />

      <div className="main-wrapper">
        <Header teacher={currentTeacher} />

        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={closeToast}
          />
        )}

        <main className="main-content">
          {currentPage === 'overview' && (
            <DashboardOverview students={students} statistics={statistics} isLoading={studentsLoading} />
          )}

          {currentPage === 'list' && (
            <StudentList 
              students={students} 
              onEdit={handleEditStudent}
              onDelete={handleDeleteStudent}
              isLoading={studentsLoading}
            />
          )}

          {currentPage === 'add' && (
            <AddPerformance
              students={students}
              teacher={currentTeacher}
              onSubmit={handleAddPerformance}
              isLoading={studentsLoading}
            />
          )}

          {currentPage === 'profile' && (
            <TeacherProfile
              teacher={currentTeacher}
              totalStudents={students.length}
            />
          )}
        </main>
      </div>

      {showEditModal && selectedStudent && (
        <EditModal
          student={selectedStudent}
          onSave={handleSaveEdit}
          onClose={() => {
            setShowEditModal(false);
            setSelectedStudent(null);
          }}
          isLoading={studentsLoading}
        />
      )}
    </div>
  );
}

export default App;