import { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Loader, 
  Building2, 
  Mail, 
  CheckCircle, 
  AlertCircle, 
  Shield, 
  Star,
  ArrowRight,
  User,
  Key,
  Home,
  Phone,
  Award,
  Briefcase
} from 'lucide-react';
import { Backendurl } from '../App';
import { toast } from 'react-toastify';

// Animation Variants
const containerVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  },
  exit: { opacity: 0, y: -20 }
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
      duration: 0.8
    }
  }
};

const inputVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  }
};

const floatingAnimation = {
  y: [-3, 3, -3],
  transition: {
    duration: 4,
    repeat: Infinity,
    ease: "easeInOut"
  }
};

const pulseAnimation = {
  scale: [1, 1.05, 1],
  transition: { 
    duration: 2,
    repeat: Infinity,
    ease: "easeInOut"
  }
};

const VendorRegister = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    role: 'vendor'
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
      case 'name':
        if (!value.trim()) errors.name = 'Business/Vendor name is required';
        else if (value.trim().length < 2) errors.name = 'Name must be at least 2 characters';
        break;
      case 'email': {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value) errors.email = 'Email is required';
        else if (!emailRegex.test(value)) errors.email = 'Please enter a valid email';
        break;
      }
      case 'password':
        if (!value) errors.password = 'Password is required';
        else if (value.length < 6) errors.password = 'Password must be at least 6 characters';
        break;
      case 'phone': {
        const phoneRegex = /^[0-9]{10}$/;
        if (!value) errors.phone = 'Phone number is required';
        else if (!phoneRegex.test(value)) errors.phone = 'Please enter a valid 10-digit phone number';
        break;
      }
    }
    
    setValidationErrors(prev => ({ ...prev, ...errors }));
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (validationErrors[name]) {
      setValidationErrors(prev => ({ ...prev, [name]: '' }));
    }

    if (name === 'password') {
      setPasswordStrength(calculatePasswordStrength(value));
    }

    validateField(name, value);
  };

  const handleFocus = (fieldName) => {
    setFieldFocus(prev => ({ ...prev, [fieldName]: true }));
  };

  const handleBlur = (fieldName) => {
    setFieldFocus(prev => ({ ...prev, [fieldName]: false }));
    validateField(fieldName, formData[fieldName]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Create a timeout promise that rejects after 5 seconds
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => {
        reject(new Error('Request timeout - redirecting to login'));
      }, 5000);
    });

    // Create the actual API request promise
    const requestPromise = axios.post(`${Backendurl}/api/users/register`, {
      ...formData,
      role: 'vendor',
    });

    try {
      // Race between the API request and the timeout
      const response = await Promise.race([requestPromise, timeoutPromise]);

      if (response.data.success) {
        // ✅ DO NOT SAVE ANYTHING TO LOCALSTORAGE
        toast.success(
          'Vendor account created successfully! Please sign in to continue.'
        );

        // ✅ STRICTLY REDIRECT TO LOGIN PAGE
        navigate('/login', { replace: true });
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      // Check if it's a timeout error
      if (error.message === 'Request timeout - redirecting to login') {
        toast.warning(
          'Request is taking too long. Redirecting to login page...'
        );
        // Redirect to login after timeout
        navigate('/login', { replace: true });
      } else {
        console.error('Error creating vendor account:', error);
        toast.error(
          error.response?.data?.message || 'An error occurred. Please try again.'
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={floatingAnimation}
          className="absolute top-20 left-10 w-72 h-72 bg-indigo-400/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            y: [5, -5, 5],
            transition: { duration: 6, repeat: Infinity, ease: "easeInOut" }
          }}
          className="absolute top-40 right-20 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            y: [-5, 5, -5],
            transition: { duration: 5, repeat: Infinity, ease: "easeInOut" }
          }}
          className="absolute bottom-20 left-1/3 w-64 h-64 bg-pink-400/10 rounded-full blur-3xl"
        />
      </div>

      {/* Floating Sparkles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              y: [-20, 20, -20],
              x: [-10, 10, -10],
              rotate: [0, 360],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 4 + i,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.5
            }}
            className={`absolute w-2 h-2 bg-indigo-400 rounded-full ${
              i % 2 === 0 ? 'top-1/4' : 'top-3/4'
            } ${
              i % 3 === 0 ? 'left-1/4' : i % 3 === 1 ? 'left-1/2' : 'left-3/4'
            }`}
          />
        ))}
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen px-4 py-20">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="w-full max-w-md"
        >
          <motion.div
            variants={cardVariants}
            className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl shadow-indigo-500/10 p-8 border border-white/20"
          >
            {/* Logo & Title */}
            <motion.div
              variants={inputVariants}
              className="text-center mb-8"
            >
              <Link to="/" className="inline-block mb-6">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center justify-center space-x-2"
                >
                  <motion.div
                    animate={pulseAnimation}
                    className="w-10 h-10 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center"
                  >
                    <Home className="w-6 h-6 text-white" />
                  </motion.div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    ApniEstate
                  </h1>
                </motion.div>
              </Link>
              
              <div className="space-y-2">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Building2 className="w-6 h-6 text-indigo-600" />
                  <h2 className="text-2xl font-bold text-gray-800">Vendor Registration</h2>
                </div>
                <p className="text-gray-600">Join our network of trusted property vendors</p>
                
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 flex items-center gap-2 bg-indigo-50 border border-indigo-200 
                    text-indigo-700 px-4 py-3 rounded-xl text-sm"
                >
                  <AlertCircle className="w-4 h-4 text-indigo-600" />
                  <span>
                    You'll need to <strong>sign in after registration</strong> to access vendor dashboard
                  </span>
                </motion.div>
                
                {/* Vendor Benefits */}
                <div className="flex items-center justify-center space-x-6 mt-4 text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Award className="w-4 h-4 text-indigo-500" />
                    <span>Verified</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Shield className="w-4 h-4 text-green-500" />
                    <span>Secure</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Briefcase className="w-4 h-4 text-purple-500" />
                    <span>Professional</span>
                  </div>
                </div>
              </div>
            </motion.div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Field */}
              <motion.div variants={inputVariants}>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Business/Vendor Name
                </label>
                <div className="relative group">
                  <div className={`absolute left-3 top-1/2 -translate-y-1/2 transition-colors duration-200 ${
                    fieldFocus.name ? 'text-indigo-500' : 'text-gray-400'
                  }`}>
                    <Building2 className="h-5 w-5" />
                  </div>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    onFocus={() => handleFocus('name')}
                    onBlur={() => handleBlur('name')}
                    className={`w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50/50 border-2 transition-all duration-200 placeholder-gray-400 ${
                      validationErrors.name
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20'
                        : fieldFocus.name
                        ? 'border-indigo-500 focus:border-indigo-500 focus:ring-indigo-500/20'
                        : 'border-gray-200 hover:border-gray-300 focus:border-indigo-500 focus:ring-indigo-500/20'
                    } focus:ring-4 focus:outline-none`}
                    placeholder="Enter your business name"
                  />
                  {validationErrors.name && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                    >
                      <AlertCircle className="h-5 w-5 text-red-500" />
                    </motion.div>
                  )}
                  {formData.name && !validationErrors.name && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                    >
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    </motion.div>
                  )}
                </div>
                <AnimatePresence>
                  {validationErrors.name && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="mt-1 text-sm text-red-600"
                    >
                      {validationErrors.name}
                    </motion.p>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Email Field */}
              <motion.div variants={inputVariants}>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Business Email
                </label>
                <div className="relative group">
                  <div className={`absolute left-3 top-1/2 -translate-y-1/2 transition-colors duration-200 ${
                    fieldFocus.email ? 'text-indigo-500' : 'text-gray-400'
                  }`}>
                    <Mail className="h-5 w-5" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    onFocus={() => handleFocus('email')}
                    onBlur={() => handleBlur('email')}
                    className={`w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50/50 border-2 transition-all duration-200 placeholder-gray-400 ${
                      validationErrors.email
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20'
                        : fieldFocus.email
                        ? 'border-indigo-500 focus:border-indigo-500 focus:ring-indigo-500/20'
                        : 'border-gray-200 hover:border-gray-300 focus:border-indigo-500 focus:ring-indigo-500/20'
                    } focus:ring-4 focus:outline-none`}
                    placeholder="vendor@company.com"
                  />
                  {validationErrors.email && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                    >
                      <AlertCircle className="h-5 w-5 text-red-500" />
                    </motion.div>
                  )}
                  {formData.email && !validationErrors.email && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                    >
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    </motion.div>
                  )}
                </div>
                <AnimatePresence>
                  {validationErrors.email && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="mt-1 text-sm text-red-600"
                    >
                      {validationErrors.email}
                    </motion.p>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Phone Field */}
              <motion.div variants={inputVariants}>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                  Contact Phone
                </label>
                <div className="relative group">
                  <div className={`absolute left-3 top-1/2 -translate-y-1/2 transition-colors duration-200 ${
                    fieldFocus.phone ? 'text-indigo-500' : 'text-gray-400'
                  }`}>
                    <Phone className="h-5 w-5" />
                  </div>
                  <input
                    type="tel"
                    name="phone"
                    id="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    onFocus={() => handleFocus('phone')}
                    onBlur={() => handleBlur('phone')}
                    className={`w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50/50 border-2 transition-all duration-200 placeholder-gray-400 ${
                      validationErrors.phone
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20'
                        : fieldFocus.phone
                        ? 'border-indigo-500 focus:border-indigo-500 focus:ring-indigo-500/20'
                        : 'border-gray-200 hover:border-gray-300 focus:border-indigo-500 focus:ring-indigo-500/20'
                    } focus:ring-4 focus:outline-none`}
                    placeholder="10-digit phone number"
                  />
                  {validationErrors.phone && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                    >
                      <AlertCircle className="h-5 w-5 text-red-500" />
                    </motion.div>
                  )}
                  {formData.phone && !validationErrors.phone && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                    >
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    </motion.div>
                  )}
                </div>
                <AnimatePresence>
                  {validationErrors.phone && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="mt-1 text-sm text-red-600"
                    >
                      {validationErrors.phone}
                    </motion.p>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Password Field */}
              <motion.div variants={inputVariants}>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative group">
                  <div className={`absolute left-3 top-1/2 -translate-y-1/2 transition-colors duration-200 ${
                    fieldFocus.password ? 'text-indigo-500' : 'text-gray-400'
                  }`}>
                    <Key className="h-5 w-5" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    id="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    onFocus={() => handleFocus('password')}
                    onBlur={() => handleBlur('password')}
                    className={`w-full pl-10 pr-12 py-3 rounded-xl bg-gray-50/50 border-2 transition-all duration-200 placeholder-gray-400 ${
                      validationErrors.password
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20'
                        : fieldFocus.password
                        ? 'border-indigo-500 focus:border-indigo-500 focus:ring-indigo-500/20'
                        : 'border-gray-200 hover:border-gray-300 focus:border-indigo-500 focus:ring-indigo-500/20'
                    } focus:ring-4 focus:outline-none`}
                    placeholder="Create a strong password"
                  />
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
                  >
                    {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                  </motion.button>
                </div>
                
                {/* Password Strength Indicator */}
                <AnimatePresence>
                  {formData.password && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-2"
                    >
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-sm text-gray-600">Password strength:</span>
                        <span className={`text-sm font-medium ${
                          passwordStrength < 50 ? 'text-red-500' : 
                          passwordStrength < 75 ? 'text-yellow-500' : 'text-green-500'
                        }`}>
                          {passwordStrength < 50 ? 'Weak' : 
                           passwordStrength < 75 ? 'Medium' : 'Strong'}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${passwordStrength}%` }}
                          transition={{ duration: 0.3 }}
                          className={`h-2 rounded-full transition-colors duration-300 ${
                            passwordStrength < 50 ? 'bg-red-500' : 
                            passwordStrength < 75 ? 'bg-yellow-500' : 'bg-green-500'
                          }`}
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <AnimatePresence>
                  {validationErrors.password && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="mt-1 text-sm text-red-600"
                    >
                      {validationErrors.password}
                    </motion.p>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Submit Button */}
              <motion.div variants={inputVariants}>
                <motion.button
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={loading || Object.keys(validationErrors).some(key => validationErrors[key])}
                  className={`w-full py-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg ${
                    loading || Object.keys(validationErrors).some(key => validationErrors[key])
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-indigo-500/25 hover:shadow-indigo-500/40'
                  }`}
                >
                  {loading ? (
                    <>
                      <Loader className="w-5 h-5 animate-spin" />
                      <span>Creating Vendor Account...</span>
                    </>
                  ) : (
                    <>
                      <Building2 className="w-5 h-5" />
                      <span>Register as Vendor</span>
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </motion.button>
              </motion.div>

              {/* Vendor Benefits */}
              <motion.div variants={inputVariants} className="bg-indigo-50/50 rounded-xl p-4 space-y-2">
                <h3 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                  <Star className="w-4 h-4 text-indigo-600" />
                  Vendor Benefits
                </h3>
                <ul className="text-xs text-gray-600 space-y-1 ml-6">
                  <li>• List unlimited properties</li>
                  <li>• Access to vendor dashboard</li>
                  <li>• Direct customer inquiries</li>
                  <li>• Premium listing features</li>
                </ul>
              </motion.div>

              {/* Divider */}
              <motion.div variants={inputVariants} className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500">Already have an account?</span>
                </div>
              </motion.div>

              {/* Sign In Link */}
              <motion.div variants={inputVariants}>
                <Link
                  to="/login"
                  className="group w-full flex items-center justify-center px-4 py-3 border-2 border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 font-medium"
                >
                  <User className="w-4 h-4 mr-2" />
                  <span className="group-hover:mr-2 transition-all duration-200">Sign in to your account</span>
                  <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all duration-200 ml-1" />
                </Link>
              </motion.div>

              {/* User Registration Link */}
              <motion.div variants={inputVariants} className="text-center pt-4 border-t border-gray-100">
                <p className="text-sm text-gray-600 mb-3">Want to register as a user instead?</p>
                <Link
                  to="/signup"
                  className="group inline-flex items-center justify-center text-indigo-600 hover:text-indigo-700 transition-colors font-medium text-sm"
                >
                  <span>Create User Account</span>
                  <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform duration-200" />
                </Link>
              </motion.div>
            </form>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default VendorRegister;
