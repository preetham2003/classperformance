import React, { useState } from 'react';
import { Search, Edit2, Trash2 } from 'lucide-react';
import './Dashboard.css';

const StudentList = ({ students, onEdit, onDelete, isLoading }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMarks, setFilterMarks] = useState('all');

  const filteredStudents = students
    .filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter(s => {
      if (filterMarks === 'all') return true;
      if (filterMarks === 'high') return s.marks >= 80;
      if (filterMarks === 'medium') return s.marks >= 60 && s.marks < 80;
      if (filterMarks === 'low') return s.marks < 60;
      return true;
    });

  const getMarksColor = (marks) => {
    if (marks >= 80) return 'marks-high';
    if (marks >= 60) return 'marks-medium';
    return 'marks-low';
  };

  const handleDelete = (studentId, studentName) => {
    if (window.confirm(`Are you sure you want to delete ${studentName}?`)) {
      onDelete(studentId);
    }
  };

  return (
    <div className="student-list-container">
      <h2 className="list-title">Student Performance</h2>

      <div className="filters-container">
        <div className="search-box">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search by student name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
            disabled={isLoading}
          />
        </div>

        <select
          value={filterMarks}
          onChange={(e) => setFilterMarks(e.target.value)}
          className="filter-select"
          disabled={isLoading}
        >
          <option value="all">All Performance</option>
          <option value="high">High (80+)</option>
          <option value="medium">Medium (60-79)</option>
          <option value="low">Low (&lt;60)</option>
        </select>
      </div>

      <div className="table-container">
        <table className="students-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Subject</th>
              <th>Marks</th>
              <th>Grade</th>
              <th>Remarks</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.length > 0 ? (
              filteredStudents.map(student => (
                <tr key={student._id}>
                  <td>{student.name}</td>
                  <td>{student.subject}</td>
                  <td>
                    <span className={`marks-badge ${getMarksColor(student.marks)}`}>
                      {student.marks}%
                    </span>
                  </td>
                  <td>
                    <span className="grade-badge">{student.grade}</span>
                  </td>
                  <td className="remarks-cell">{student.remarks}</td>
                  <td>
                    <div className="action-buttons">
                      <button
                        onClick={() => onEdit(student)}
                        className="edit-button"
                        disabled={isLoading}
                        aria-label={`Edit ${student.name}`}
                      >
                        <Edit2 size={16} />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => handleDelete(student._id, student.name)}
                        className="delete-button"
                        disabled={isLoading}
                        aria-label={`Delete ${student.name}`}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="no-data">
                  {isLoading ? 'Loading...' : 'No students found'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentList;