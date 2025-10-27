import Student from '../models/Student.js';

// @route   GET /api/students
// @desc    Get all students for logged-in teacher
// @access  Private
export const getStudents = async (req, res, next) => {
  try {
    const { search, filterMarks, sort } = req.query;

    // Build filter object
    let filter = { teacher: req.userId };

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { rollNumber: { $regex: search, $options: 'i' } }
      ];
    }

    if (filterMarks) {
      if (filterMarks === 'high') {
        filter.marks = { $gte: 80 };
      } else if (filterMarks === 'medium') {
        filter.marks = { $gte: 60, $lt: 80 };
      } else if (filterMarks === 'low') {
        filter.marks = { $lt: 60 };
      }
    }

    // Build sort object
    let sortObj = { lastUpdated: -1 };
    if (sort === 'name') {
      sortObj = { name: 1 };
    } else if (sort === 'marks') {
      sortObj = { marks: -1 };
    }

    const students = await Student.find(filter)
      .sort(sortObj)
      .select('-performanceHistory');

    // Calculate statistics
    const totalStudents = await Student.countDocuments({ teacher: req.userId });
    const avgMarks = students.length > 0
      ? Math.round(students.reduce((acc, s) => acc + s.marks, 0) / students.length)
      : 0;
    const highPerformers = students.filter(s => s.marks >= 80).length;
    const mediumPerformers = students.filter(s => s.marks >= 60 && s.marks < 80).length;
    const lowPerformers = students.filter(s => s.marks < 60).length;

    res.status(200).json({
      success: true,
      count: students.length,
      statistics: {
        total: totalStudents,
        average: avgMarks,
        high: highPerformers,
        medium: mediumPerformers,
        low: lowPerformers
      },
      students
    });
  } catch (error) {
    next(error);
  }
};

// @route   GET /api/students/:id
// @desc    Get single student
// @access  Private
export const getStudent = async (req, res, next) => {
  try {
    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    if (student.teacher.toString() !== req.userId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this student'
      });
    }

    res.status(200).json({
      success: true,
      student
    });
  } catch (error) {
    next(error);
  }
};

// @route   POST /api/students
// @desc    Create new student
// @access  Private
export const createStudent = async (req, res, next) => {
  try {
    const { name, subject, marks, remarks, parentName, parentEmail, parentPhone, rollNumber, attendance } = req.body;

    if (!name || !subject || marks === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    const student = await Student.create({
      name,
      subject,
      marks,
      remarks: remarks || '',
      teacher: req.userId,
      parentName: parentName || '',
      parentEmail: parentEmail || '',
      parentPhone: parentPhone || '',
      rollNumber: rollNumber || '',
      attendance: attendance || 0,
      performanceHistory: [
        {
          marks,
          remarks: remarks || ''
        }
      ]
    });

    res.status(201).json({
      success: true,
      message: 'Student created successfully',
      student
    });
  } catch (error) {
    next(error);
  }
};

// @route   PUT /api/students/:id
// @desc    Update student
// @access  Private
export const updateStudent = async (req, res, next) => {
  try {
    let student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    if (student.teacher.toString() !== req.userId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this student'
      });
    }

    const { name, subject, marks, remarks, parentName, parentEmail, parentPhone, attendance } = req.body;

    // Update fields
    if (name) student.name = name;
    if (subject) student.subject = subject;
    if (marks !== undefined) {
      // Add to performance history
      student.performanceHistory.push({
        marks,
        remarks: remarks || ''
      });
      student.marks = marks;
    }
    if (remarks !== undefined) student.remarks = remarks;
    if (parentName !== undefined) student.parentName = parentName;
    if (parentEmail !== undefined) student.parentEmail = parentEmail;
    if (parentPhone !== undefined) student.parentPhone = parentPhone;
    if (attendance !== undefined) student.attendance = attendance;

    student.lastUpdated = Date.now();
    await student.save();

    res.status(200).json({
      success: true,
      message: 'Student updated successfully',
      student
    });
  } catch (error) {
    next(error);
  }
};

// @route   DELETE /api/students/:id
// @desc    Delete student
// @access  Private
export const deleteStudent = async (req, res, next) => {
  try {
    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    if (student.teacher.toString() !== req.userId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this student'
      });
    }

    await Student.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Student deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @route   GET /api/students/statistics/overview
// @desc    Get performance statistics
// @access  Private
export const getStatistics = async (req, res, next) => {
  try {
    const students = await Student.find({ teacher: req.userId });

    const totalStudents = students.length;
    const avgMarks = students.length > 0
      ? Math.round(students.reduce((acc, s) => acc + s.marks, 0) / students.length)
      : 0;

    const gradesDistribution = {
      A: students.filter(s => s.grade === 'A').length,
      B: students.filter(s => s.grade === 'B').length,
      C: students.filter(s => s.grade === 'C').length,
      D: students.filter(s => s.grade === 'D').length,
      F: students.filter(s => s.grade === 'F').length
    };

    const performanceDistribution = {
      high: students.filter(s => s.marks >= 80).length,
      medium: students.filter(s => s.marks >= 60 && s.marks < 80).length,
      low: students.filter(s => s.marks < 60).length
    };

    const topPerformers = students
      .sort((a, b) => b.marks - a.marks)
      .slice(0, 5)
      .map(s => ({ name: s.name, marks: s.marks, grade: s.grade }));

    const lowPerformers = students
      .sort((a, b) => a.marks - b.marks)
      .slice(0, 5)
      .map(s => ({ name: s.name, marks: s.marks, grade: s.grade }));

    res.status(200).json({
      success: true,
      statistics: {
        totalStudents,
        avgMarks,
        gradesDistribution,
        performanceDistribution,
        topPerformers,
        lowPerformers
      }
    });
  } catch (error) {
    next(error);
  }
};