import React, { useState } from 'react';
import { Plus, Save } from 'lucide-react';
import './Dashboard.css';

const AddPerformance = ({ students, teacher, onSubmit, isLoading }) => {
  const [formData, setFormData] = useState({
    name: '',
    subject: '',
    marks: '',
    remarks: '',
    parentName: '',
    parentEmail: '',
    parentPhone: '',
    rollNumber: '',
    attendance: ''
  });
  const [draftData, setDraftData] = useState(null);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = 'Student name is required';
    if (!formData.subject.trim()) newErrors.subject = 'Subject is required';
    if (!formData.marks) newErrors.marks = 'Marks are required';
    else if (isNaN(formData.marks) || formData.marks < 0 || formData.marks > 100) {
      newErrors.marks = 'Marks must be between 0 and 100';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    await onSubmit(
      formData.name,
      formData.subject,
      formData.marks,
      formData.remarks,
      formData.parentName,
      formData.parentEmail,
      formData.parentPhone,
      formData.rollNumber,
      formData.attendance
    );

    setFormData({
      name: '',
      subject: '',
      marks: '',
      remarks: '',
      parentName: '',
      parentEmail: '',
      parentPhone: '',
      rollNumber: '',
      attendance: ''
    });
    setDraftData(null);
    setErrors({});
  };

  const handleSaveDraft = () => {
    setDraftData(formData);
  };

  const handleLoadDraft = () => {
    if (draftData) {
      setFormData(draftData);
    }
  };

  return (
    <div className="add-performance-container">
      <div className="form-card">
        <h2 className="form-title">Add Student Performance</h2>

        <form onSubmit={handleSubmit} className="performance-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="name" className="form-label">
                Student Name
                <span className="required">*</span>
              </label>
              <input
                id="name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                disabled={isLoading}
                className={`form-input ${errors.name ? 'error' : ''}`}
                placeholder="Enter student name"
              />
              {errors.name && <p className="error-text">{errors.name}</p>}
            </div>

            <div className="form-group">
              <label htmlFor="rollNumber" className="form-label">
                Roll Number
              </label>
              <input
                id="rollNumber"
                type="text"
                name="rollNumber"
                value={formData.rollNumber}
                onChange={handleChange}
                disabled={isLoading}
                className="form-input"
                placeholder="Enter roll number"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="subject" className="form-label">
                Subject
                <span className="required">*</span>
              </label>
              <input
                id="subject"
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                disabled={isLoading}
                className={`form-input ${errors.subject ? 'error' : ''}`}
                placeholder="Enter subject"
              />
              {errors.subject && <p className="error-text">{errors.subject}</p>}
            </div>

            <div className="form-group">
              <label htmlFor="marks" className="form-label">
                Marks (0-100)
                <span className="required">*</span>
              </label>
              <input
                id="marks"
                type="number"
                name="marks"
                min="0"
                max="100"
                value={formData.marks}
                onChange={handleChange}
                disabled={isLoading}
                className={`form-input ${errors.marks ? 'error' : ''}`}
                placeholder="Enter marks"
              />
              {errors.marks && <p className="error-text">{errors.marks}</p>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="attendance" className="form-label">
                Attendance (%)
              </label>
              <input
                id="attendance"
                type="number"
                name="attendance"
                min="0"
                max="100"
                value={formData.attendance}
                onChange={handleChange}
                disabled={isLoading}
                className="form-input"
                placeholder="Enter attendance percentage"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="remarks" className="form-label">
              Remarks (Max 200 characters)
            </label>
            <textarea
              id="remarks"
              name="remarks"
              value={formData.remarks}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                remarks: e.target.value.slice(0, 200)
              }))}
              disabled={isLoading}
              maxLength="200"
              rows="3"
              className="form-input textarea"
              placeholder="Enter remarks"
            />
            <p className="char-count">{formData.remarks.length}/200</p>
          </div>

          <div className="divider">
            <span>Parent Information (Optional)</span>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="parentName" className="form-label">
                Parent Name
              </label>
              <input
                id="parentName"
                type="text"
                name="parentName"
                value={formData.parentName}
                onChange={handleChange}
                disabled={isLoading}
                className="form-input"
                placeholder="Enter parent name"
              />
            </div>

            <div className="form-group">
              <label htmlFor="parentEmail" className="form-label">
                Parent Email
              </label>
              <input
                id="parentEmail"
                type="email"
                name="parentEmail"
                value={formData.parentEmail}
                onChange={handleChange}
                disabled={isLoading}
                className="form-input"
                placeholder="Enter parent email"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="parentPhone" className="form-label">
              Parent Phone
            </label>
            <input
              id="parentPhone"
              type="tel"
              name="parentPhone"
              value={formData.parentPhone}
              onChange={handleChange}
              disabled={isLoading}
              className="form-input"
              placeholder="Enter parent phone"
            />
          </div>

          <div className="button-group">
            <button
              type="submit"
              disabled={isLoading}
              className="btn btn-primary"
            >
              <Plus size={18} />
              <span>{isLoading ? 'Adding...' : 'Add Performance'}</span>
            </button>

            <button
              type="button"
              onClick={handleSaveDraft}
              disabled={isLoading}
              className="btn btn-secondary"
            >
              <Save size={18} />
              <span>Save Draft</span>
            </button>

            {draftData && (
              <button
                type="button"
                onClick={handleLoadDraft}
                disabled={isLoading}
                className="btn btn-tertiary"
              >
                Load Draft
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPerformance;