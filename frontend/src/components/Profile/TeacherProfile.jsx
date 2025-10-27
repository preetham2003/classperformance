import React from 'react';
import './Profile.css';

const TeacherProfile = ({ teacher, totalStudents }) => {
  const profileFields = [
    { label: 'Name', value: teacher?.name },
    { label: 'Email', value: teacher?.email },
    { label: 'Subject', value: teacher?.subject },
    { label: 'Total Students', value: totalStudents }
  ];

  return (
    <div className="profile-container">
      <div className="profile-card">
        <h2 className="profile-title">Teacher Profile</h2>

        <div className="profile-content">
          <div className="profile-avatar">
            <div className="avatar-placeholder">
              {teacher?.name?.charAt(0).toUpperCase()}
            </div>
          </div>

          <div className="profile-details">
            {profileFields.map((field, index) => (
              <div key={index} className="profile-field">
                <span className="field-label">{field.label}</span>
                <span className="field-value">{field.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="profile-stats">
          <div className="stat-card">
            <p className="stat-label">Subject Expertise</p>
            <p className="stat-value">{teacher?.subject}</p>
          </div>
          <div className="stat-card">
            <p className="stat-label">Students Managed</p>
            <p className="stat-value">{totalStudents}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherProfile;