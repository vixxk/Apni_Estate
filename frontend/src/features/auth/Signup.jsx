import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import {
  Loader,
  UserPlus,
  ArrowRight,
  Shield,
  CheckCircle,
  Sparkles,
  Building2,
  Mail,
  User,
  Phone,
  Key,
} from "lucide-react";
import { Backendurl } from "../../App";
import { toast } from "react-toastify";
import SignupHeader from "./components/signup/SignupHeader";
import InputField from "./components/signup/InputField";
import PasswordStrength from "./components/signup/PasswordStrength";

// Animation Variants
const pulseAnimation = {
  scale: [1, 1.05, 1],
  transition: {
    duration: 2,
    repeat: Infinity,
    ease: "easeInOut",
  },
};

const containerVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
  exit: { opacity: 0, y: -20 },
};

const cardVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 20,
      duration: 0.8,
    },
  },
};

const inputVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};



const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    role: "user",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fieldFocus, setFieldFocus] = useState({
    name: false,
    email: false,
    password: false,
    phone: false
  });
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [validationErrors, setValidationErrors] = useState({});
  const navigate = useNavigate();

  // Password strength calculation
  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[a-z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 25;
    return strength;
  };

  // Real-time validation
  const validateField = (name, value) => {
    const errors = {};

    switch (name) {
      case "name":
        if (!value.trim()) errors.name = "Name is required";
        else if (value.trim().length < 2)
          errors.name = "Name must be at least 2 characters";
        break;
      case "email": {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value) errors.email = "Email is required";
        else if (!emailRegex.test(value))
          errors.email = "Please enter a valid email";
        break;
      }
      case "password":
        if (!value) errors.password = "Password is required";
        else if (value.length < 6)
          errors.password = "Password must be at least 6 characters";
        break;
      case "phone":
        if (!value.trim()) errors.phone = "Phone number is required";
        else if (!/^\+?[\d\s\-\(\)]{10,}$/.test(value.trim()))
          errors.phone = "Please enter a valid phone number";
        break;
    }

    setValidationErrors((prev) => ({ ...prev, ...errors }));
    return Object.keys(errors).length === 0;
  };


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (validationErrors[name]) {
      setValidationErrors((prev) => ({ ...prev, [name]: "" }));
    }

    if (name === "password") {
      setPasswordStrength(calculatePasswordStrength(value));
    }

    validateField(name, value);
  };

  const handleFocus = (fieldName) => {
    setFieldFocus((prev) => ({ ...prev, [fieldName]: true }));
  };

  const handleBlur = (fieldName) => {
    setFieldFocus((prev) => ({ ...prev, [fieldName]: false }));
    validateField(fieldName, formData[fieldName]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Create a timeout promise that rejects after 5 seconds
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => {
        reject(new Error("Request timeout - redirecting to login"));
      }, 5000);
    });

    // Create the actual API request promise
    const requestPromise = axios.post(`${Backendurl}/api/users/register`, {
      ...formData,
      role: "user",
    });

    try {
      // Race between the API request and the timeout
      const response = await Promise.race([requestPromise, timeoutPromise]);

      if (response.data.success) {
        toast.success(
          "Account created successfully! Please sign in to continue."
        );

        //STRICTLY REDIRECT TO LOGIN PAGE
        navigate("/login", { replace: true });
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      // Check if it's a timeout error
      if (error.message === "Request timeout - redirecting to login") {
        toast.warning(
          "Request is taking too long. Redirecting to login page..."
        );
        // Redirect to login after timeout
        navigate("/login", { replace: true });
      } else {
        console.error("Error signing up:", error);
        toast.error(
          error.response?.data?.message || "An error occurred. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Animated Background Elements - Static/Stable */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="absolute top-20 left-10 w-72 h-72 bg-blue-400/10 rounded-full blur-3xl"
        />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="absolute top-40 right-20 w-96 h-96 bg-indigo-400/10 rounded-full blur-3xl"
        />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="absolute bottom-20 left-1/3 w-64 h-64 bg-purple-400/10 rounded-full blur-3xl"
        />
      </div>

      {/* Floating Sparkles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              y: [-10, 10, -10],
              x: [-5, 5, -5],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 6 + i,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.5,
            }}
            className={`absolute w-2 h-2 bg-blue-400 rounded-full ${i % 2 === 0 ? "top-1/4" : "top-3/4"
              } ${i % 3 === 0 ? "left-1/4" : i % 3 === 1 ? "left-1/2" : "left-3/4"
              }`}
          />
        ))}
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen px-4 py-8 md:py-12">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="w-full max-w-md"
        >
          <motion.div
            variants={cardVariants}
            className="glass-card rounded-3xl shadow-blue-500/10 p-8"
          >
            {/* Logo & Title */}
            <SignupHeader />

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Field */}
              {/* Name Field */}
              <InputField
                id="name"
                label="Full Name"
                icon={User}
                value={formData.name}
                onChange={handleChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
                error={validationErrors.name}
                isFocused={fieldFocus.name}
                placeholder="Enter your full name"
              />

              {/* Email Field */}
              {/* Email Field */}
              <InputField
                id="email"
                type="email"
                label="Email Address"
                icon={Mail}
                value={formData.email}
                onChange={handleChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
                error={validationErrors.email}
                isFocused={fieldFocus.email}
                placeholder="name@company.com"
              />

              {/* Phone Field */}
              <InputField
                id="phone"
                type="tel"
                label="Phone Number"
                icon={Phone}
                value={formData.phone}
                onChange={handleChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
                error={validationErrors.phone}
                isFocused={fieldFocus.phone}
                placeholder="+91 98765 43210"
              />

              {/* Password Field */}
              <motion.div variants={inputVariants}>
                <InputField
                  id="password"
                  type={showPassword ? "text" : "password"}
                  label="Password"
                  icon={Key}
                  value={formData.password}
                  onChange={handleChange}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  error={validationErrors.password}
                  isFocused={fieldFocus.password}
                  placeholder="Create a strong password"
                  rightElement={
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
                    >
                      {showPassword ? (
                        <FaEyeSlash size={18} />
                      ) : (
                        <FaEye size={18} />
                      )}
                    </motion.button>
                  }
                />

                {/* Password Strength Indicator */}
                <PasswordStrength
                  password={formData.password}
                  strength={passwordStrength}
                />
              </motion.div>

              {/* Submit Button */}
              <motion.div variants={inputVariants}>
                <motion.button
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={
                    loading ||
                    Object.keys(validationErrors).some(
                      (key) => validationErrors[key]
                    )
                  }
                  className={`w-full py-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg ${loading ||
                    Object.keys(validationErrors).some(
                      (key) => validationErrors[key]
                    )
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-blue-500/25 hover:shadow-blue-500/40"
                    }`}
                >
                  {loading ? (
                    <div className="flex items-center gap-2 animate-pulse">
                      <Loader className="w-5 h-5" />
                      <span>Creating Account...</span>
                    </div>
                  ) : (
                    <>
                      <UserPlus className="w-5 h-5" />
                      <span>Create Account</span>
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </motion.button>
              </motion.div>

              {/* Features */}
              <motion.div
                variants={inputVariants}
                className="grid grid-cols-3 gap-4 py-4"
              >
                <div className="text-center">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Shield className="w-4 h-4 text-blue-600" />
                  </div>
                  <p className="text-xs text-gray-600">Secure</p>
                </div>
                <div className="text-center">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  </div>
                  <p className="text-xs text-gray-600">Verified</p>
                </div>
                <div className="text-center">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Sparkles className="w-4 h-4 text-purple-600" />
                  </div>
                  <p className="text-xs text-gray-600">Premium</p>
                </div>
              </motion.div>

              {/* Divider */}
              <motion.div variants={inputVariants} className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500">
                    Already have an account?
                  </span>
                </div>
              </motion.div>

              {/* Sign In Link */}
              <motion.div variants={inputVariants}>
                <Link
                  to="/login"
                  className="group w-full flex items-center justify-center px-4 py-3 border-2 border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 font-medium"
                >
                  <span className="group-hover:mr-2 transition-all duration-200">
                    Sign in to your account
                  </span>
                  <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all duration-200 ml-1" />
                </Link>
              </motion.div>

              {/* Vendor Registration Link */}
              <motion.div
                variants={inputVariants}
                className="text-center pt-4 border-t border-gray-100"
              >
                <p className="text-sm text-gray-600 mb-3">
                  Are you a property vendor?
                </p>
                <Link
                  to="/register"
                  className="group inline-flex items-center justify-center px-6 py-3 border-2 border-indigo-200 rounded-xl text-indigo-700 hover:bg-indigo-50 hover:border-indigo-300 transition-all duration-200 font-medium"
                >
                  <Building2 className="w-4 h-4 mr-2" />
                  <span>Register as Vendor</span>
                  <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all duration-200 ml-1" />
                </Link>
              </motion.div>
            </form>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Signup;
