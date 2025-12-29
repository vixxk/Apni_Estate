import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, ArrowLeft, Shield, Lock, Key, AlertCircle } from "lucide-react";


// Animation variants
const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
      staggerChildren: 0.1
    }
  },
  exit: { opacity: 0, y: -20 }
};


const cardVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 20
    }
  }
};


const floatingAnimation = {
  y: [-3, 3, -3],
  rotate: [-1, 1, -1],
  transition: {
    duration: 4,
    repeat: Infinity,
    ease: "easeInOut"
  }
};


const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [emailFocused, setEmailFocused] = useState(false);


  const handleSubmit = (e) => {
    e.preventDefault();
    // Disabled - Coming Soon
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={floatingAnimation}
          className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-br from-blue-200/30 to-indigo-300/30 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ ...floatingAnimation, transition: { ...floatingAnimation.transition, delay: 1 } }}
          className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-br from-purple-200/30 to-pink-300/30 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ ...floatingAnimation, transition: { ...floatingAnimation.transition, delay: 2 } }}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-br from-indigo-200/20 to-blue-300/20 rounded-full blur-3xl"
        />
      </div>


      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="w-full max-w-md relative z-10"
      >
        <motion.div
          variants={cardVariants}
          className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 relative overflow-hidden"
        >
          {/* Animated gradient border */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500 rounded-3xl opacity-75 blur-sm animate-pulse"></div>
          <div className="relative bg-white/95 backdrop-blur-xl rounded-3xl m-[2px] p-8">
            
            {/* Logo & Title */}
            <div className="text-center mb-8">
              <Link to="/" className="inline-block mb-6 group">
                <motion.div 
                  className="flex items-center justify-center gap-2"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <motion.div
                    animate={floatingAnimation}
                    className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg shadow-blue-500/25"
                  >
                    <Lock className="w-6 h-6 text-white" />
                  </motion.div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    ApniEstate
                  </h1>
                </motion.div>
              </Link>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="flex items-center justify-center gap-2 mb-3">
                  <Key className="w-5 h-5 text-blue-500" />
                  <h2 className="text-2xl font-bold text-gray-800">Forgot Password?</h2>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">
                  No worries, we&apos;ll send you reset instructions to get you back on track.
                </p>
              </motion.div>
            </div>

            {/* Coming Soon Notice */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3"
            >
              <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-amber-800 mb-1">Coming Soon</p>
                <p className="text-xs text-amber-700 leading-relaxed">
                  Password reset functionality is currently under development. Please contact support for assistance.
                </p>
              </div>
            </motion.div>


            {/* Form */}
            <motion.form
              onSubmit={handleSubmit}
              className="space-y-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative group">
                  <div className={`absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm ${emailFocused ? 'opacity-100' : ''}`}></div>
                  <div className="relative">
                    <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 transition-colors duration-300 ${emailFocused ? 'text-blue-600' : 'text-gray-400'}`} />
                    <input
                      type="email"
                      name="email"
                      id="email"
                      disabled
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onFocus={() => setEmailFocused(true)}
                      onBlur={() => setEmailFocused(false)}
                      className="w-full pl-12 pr-4 py-4 rounded-xl bg-gray-50/80 backdrop-blur-sm border-2 border-gray-200 transition-all duration-300 text-gray-700 placeholder-gray-400 disabled:opacity-60 disabled:cursor-not-allowed"
                      placeholder="Enter your email address"
                    />
                  </div>
                </div>
              </div>


              <motion.button
                type="submit"
                disabled
                className="w-full bg-gray-400 text-white py-4 rounded-xl cursor-not-allowed flex items-center justify-center space-x-2 font-semibold shadow-lg opacity-60 relative overflow-hidden"
              >
                <Mail className="w-5 h-5" />
                <span>Coming Soon</span>
              </motion.button>


              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-center"
              >
                <Link
                  to="/login"
                  className="inline-flex items-center text-sm text-gray-600 hover:text-gray-800 transition-colors duration-300 font-medium group"
                >
                  <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform duration-300" />
                  Back to login
                </Link>
              </motion.div>
            </motion.form>


            {/* Security Badge */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-8 flex items-center justify-center gap-2 text-xs text-gray-500"
            >
              <Shield className="w-4 h-4 text-green-500" />
              <span className="font-medium">Secured by 256-bit SSL encryption</span>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};


export default ForgotPassword;
