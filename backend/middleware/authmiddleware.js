import jwt from "jsonwebtoken";
import User from '../features/users/userModel.js';
import { appConfig as config } from "../config/config.js";


export const protect = async (req, res, next) => {
  try {
    let token;


    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not authorized to access this route",
      });
    }

    try {
      const decoded = jwt.verify(token, config.JWT_SECRET);


      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "User not found",
        });
      }

      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: "Not authorized to access this route",
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error during authentication",
    });
  }
};


export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Not authorized to access this route",
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role '${req.user.role}' is not authorized to access this route`,
      });
    }

    next();
  };
};


export const optionalAuth = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (token) {
      try {
        const decoded = jwt.verify(token, config.JWT_SECRET);
        req.user = await User.findById(decoded.id).select("-password");
      } catch (error) {

        req.user = null;
      }
    }

    next();
  } catch (error) {
    next();
  }
};


export const adminProtect = async (req, res, next) => {
  try {
    const { email, password } = req.headers;

    if (!email || !password) {
      return res.status(401).json({
        success: false,
        message: "Admin credentials required in headers",
      });
    }


    if (
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASSWORD
    ) {
      req.admin = {
        email: process.env.ADMIN_EMAIL,
        role: "admin",
      };
      next();
    } else {
      return res.status(401).json({
        success: false,
        message: "Invalid admin credentials",
      });
    }
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Admin authentication failed",
      error: error.message,
    });
  }
};
