import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import './Dashboard.css';

const EditModal = ({ student, onSave, onClose, isLoading }) => {
  const [formData, setFormData] = useState({
    marks: '',
    remarks: ''
  });

  useEffect(() => {
    if (student) {
      setFormData({
        marks: student.marks,
        remarks: student.remarks
      });
    }
  }, [student]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onSave(formData);
  };

  if (!student) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">Edit {student.name}'s Performance</h3>
          <button
            onClick={onClose}
            className="modal-close"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label htmlFor="marks" className="form-label">
              Marks
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
              className="form-input"
            />
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
            />
            <p className="char-count">{formData.remarks.length}/200</p>
          </div>

          <div className="modal-buttons">
            <button
              type="submit"
              disabled={isLoading}
              className="btn btn-primary"
            >
              {isLoading ? 'Saving...' : 'Save Changes'}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="btn btn-secondary"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditModal;