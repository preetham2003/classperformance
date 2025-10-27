import Teacher from '../models/Teacher.js';
import jwt from 'jsonwebtoken';

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
};

// @route   POST /api/auth/register
// @desc    Register a new teacher
// @access  Public
export const register = async (req, res, next) => {
  try {
    const { name, email, password, subject, department, phone } = req.body;

    // Validation
    if (!name || !email || !password || !subject) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    // Check if teacher already exists
    let teacher = await Teacher.findOne({ email });
    if (teacher) {
      return res.status(400).json({
        success: false,
        message: 'Teacher already exists with this email'
      });
    }

    // Create teacher
    teacher = await Teacher.create({
      name,
      email,
      password,
      subject,
      department: department || '',
      phone: phone || ''
    });

    // Generate token
    const token = generateToken(teacher._id);

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      token,
      teacher: {
        id: teacher._id,
        name: teacher.name,
        email: teacher.email,
        subject: teacher.subject
      }
    });
  } catch (error) {
    next(error);
  }
};

// @route   POST /api/auth/login
// @desc    Login teacher
// @access  Public
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    // Check for teacher
    const teacher = await Teacher.findOne({ email }).select('+password');

    if (!teacher) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check if password matches
    const isMatch = await teacher.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    if (!teacher.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Your account has been deactivated'
      });
    }

    // Generate token
    const token = generateToken(teacher._id);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      teacher: {
        id: teacher._id,
        name: teacher.name,
        email: teacher.email,
        subject: teacher.subject,
        department: teacher.department,
        phone: teacher.phone
      }
    });
  } catch (error) {
    next(error);
  }
};

// @route   GET /api/auth/me
// @desc    Get current logged-in teacher
// @access  Private
export const getCurrentTeacher = async (req, res, next) => {
  try {
    const teacher = await Teacher.findById(req.userId);

    res.status(200).json({
      success: true,
      teacher: {
        id: teacher._id,
        name: teacher.name,
        email: teacher.email,
        subject: teacher.subject,
        department: teacher.department,
        phone: teacher.phone,
        isActive: teacher.isActive
      }
    });
  } catch (error) {
    next(error);
  }
};

// @route   POST /api/auth/logout
// @desc    Logout teacher
// @access  Private
export const logout = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      message: 'Logout successful'
    });
  } catch (error) {
    next(error);
  }
};

// @route   PUT /api/auth/update-profile
// @desc    Update teacher profile
// @access  Private
export const updateProfile = async (req, res, next) => {
  try {
    const { name, subject, department, phone } = req.body;

    const teacher = await Teacher.findByIdAndUpdate(
      req.userId,
      {
        name: name || undefined,
        subject: subject || undefined,
        department: department || undefined,
        phone: phone || undefined,
        updatedAt: Date.now()
      },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      teacher: {
        id: teacher._id,
        name: teacher.name,
        email: teacher.email,
        subject: teacher.subject,
        department: teacher.department,
        phone: teacher.phone
      }
    });
  } catch (error) {
    next(error);
  }
};

// @route   PUT /api/auth/change-password
// @desc    Change password
// @access  Private
export const changePassword = async (req, res, next) => {
  try {
    const { oldPassword, newPassword, confirmPassword } = req.body;

    if (!oldPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Passwords do not match'
      });
    }

    const teacher = await Teacher.findById(req.userId).select('+password');

    const isMatch = await teacher.matchPassword(oldPassword);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Old password is incorrect'
      });
    }

    teacher.password = newPassword;
    await teacher.save();

    res.status(200).json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    next(error);
  }
};