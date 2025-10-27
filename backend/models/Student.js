import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide student name'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters']
    },
    subject: {
      type: String,
      required: [true, 'Please specify the subject'],
      trim: true
    },
    marks: {
      type: Number,
      required: [true, 'Please provide marks'],
      min: [0, 'Marks cannot be negative'],
      max: [100, 'Marks cannot exceed 100']
    },
    remarks: {
      type: String,
      trim: true,
      maxlength: [500, 'Remarks cannot exceed 500 characters']
    },
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Teacher',
      required: [true, 'Student must be associated with a teacher']
    },
    parentName: {
      type: String,
      trim: true
    },
    parentEmail: {
      type: String,
      trim: true,
      lowercase: true
    },
    parentPhone: {
      type: String,
      trim: true
    },
    rollNumber: {
      type: String,
      trim: true
    },
    attendance: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    },
    grade: {
      type: String,
      enum: ['A', 'B', 'C', 'D', 'F', '-'],
      default: '-'
    },
    performanceHistory: [
      {
        marks: Number,
        date: {
          type: Date,
          default: Date.now
        },
        remarks: String
      }
    ],
    lastUpdated: {
      type: Date,
      default: Date.now
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

// Index for faster queries
studentSchema.index({ teacher: 1 });
studentSchema.index({ name: 'text' });

// Method to calculate grade
studentSchema.methods.calculateGrade = function() {
  if (this.marks >= 90) return 'A';
  if (this.marks >= 80) return 'B';
  if (this.marks >= 70) return 'C';
  if (this.marks >= 60) return 'D';
  return 'F';
};

// Pre-save hook to update grade
studentSchema.pre('save', function(next) {
  this.grade = this.calculateGrade();
  next();
});

const Student = mongoose.model('Student', studentSchema);

export default Student;