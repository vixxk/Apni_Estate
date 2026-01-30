import crypto from 'crypto';
import User from './userModel.js';
import Telecaller from '../telecaller/telecallerModel.js';
import generateToken from '../../utils/generateToken.js';
import { sendEmail, emailTemplates } from '../../config/nodemailer.js';
import { appConfig as config } from '../../config/config.js';
import { asyncHandler } from '../../middleware/asyncHandler.js';

// @desc    Register a new user (user or vendor)
// @route   POST /api/users/register
// @access  Public
export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, phone, role, promoCode } = req.body;

  // Add phone validation
  if (!phone || !phone.trim()) {
    res.status(400);
    throw new Error('Phone number is required');
  }

  // Block admin creation via signup
  if (role === 'admin') {
    res.status(403);
    throw new Error('Admin registration is not allowed');
  }

  const allowedRoles = ['user', 'vendor'];
  const userRole = allowedRoles.includes(role) ? role : 'user';

  const existingUser = await User.findOne({ email: email.toLowerCase() });
  if (existingUser) {
    res.status(400);
    throw new Error('User already exists with this email');
  }

  // Validate Promo Code BEFORE creating user
  let telecaller = null;
  if (promoCode && promoCode.trim() !== '') {
      telecaller = await Telecaller.findOne({ 
          referralId: promoCode.trim().toUpperCase(),
          active: true 
      });

      if (!telecaller) {
          res.status(400);
          throw new Error('Invalid Promo Code');
      }
  }

  const user = await User.create({
    name,
    email,
    password,
    phone,
    role: userRole,
  });

  // Link user to Telecaller if applicable
  if (telecaller) {
      telecaller.onboardings.push(user._id);
      await telecaller.save();
  }

  try {
    const tpl = emailTemplates.welcome(user.name);
    await sendEmail(user.email, tpl.subject, tpl.html);
  } catch (emailError) {
    console.error('Welcome email failed:', emailError);
  }

  const token = generateToken(user._id);

  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    data: {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    },
  });
});

// @desc    Authenticate user & get token
// @route   POST /api/users/login
// @access  Public
export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error('Please provide email and password');
  }

  const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
  
  if (!user || !(await user.comparePassword(password))) {
    res.status(401);
    throw new Error('Invalid credentials');
  }

  const token = generateToken(user._id);

  res.json({
    success: true,
    message: 'Login successful',
    data: {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    },
  });
});

// @desc    Admin login (using env credentials)
// @route   POST /api/users/admin
// @access  Public
export const adminLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Check env-configured admin credentials
  if (email !== config.ADMIN_EMAIL || password !== config.ADMIN_PASSWORD) {
    res.status(401);
    throw new Error('Invalid admin credentials');
  }

  // Ensure an admin user exists in DB
  let adminUser = await User.findOne({
    email: config.ADMIN_EMAIL.toLowerCase(),
  });

  if (!adminUser) {
    adminUser = await User.create({
      name: 'Admin',
      email: config.ADMIN_EMAIL,
      password: config.ADMIN_PASSWORD,
      role: 'admin',
    });
  }

  const token = generateToken(adminUser._id);

  res.json({
    success: true,
    message: 'Admin login successful',
    data: {
      user: {
        id: adminUser._id,
        name: adminUser.name,
        email: adminUser.email,
        role: adminUser.role,
      },
      token,
    },
  });
});

// @desc    Forgot password
// @route   POST /api/users/forgot
// @access  Public
export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email: email.toLowerCase() });

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  const resetToken = user.createPasswordResetToken();
  await user.save();

  const resetUrl = `${config.WEBSITE_URL}/reset-password/${resetToken}`;
  const tpl = emailTemplates.passwordReset(resetUrl);

  try {
    await sendEmail(user.email, tpl.subject, tpl.html);

    res.json({
      success: true,
      message: 'Password reset email sent',
    });
  } catch (emailError) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(500);
    throw new Error('Email could not be sent');
  }
});

// @desc    Reset password
// @route   POST /api/users/reset/:token
// @access  Public
export const resetPassword = asyncHandler(async (req, res) => {
  const { password } = req.body;

  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpires: { $gt: Date.now() },
  });

  if (!user) {
    res.status(400);
    throw new Error('Invalid or expired token');
  }

  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();

  res.json({
    success: true,
    message: 'Password reset successful',
  });
});
