import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, ArrowLeft, Shield, Lock, Key, CheckCircle, Loader } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";
import { Backendurl } from "../App";

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



const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [emailFocused, setEmailFocused] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${Backendurl}/api/users/forgot`, { email });
      if (response.data.success) {
        setIsSuccess(true);
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Forgot password error:", error);
      toast.error(error.response?.data?.message || "Failed to send reset email");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Background decorative elements - Static/Stable */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200/20 rounded-full blur-3xl opacity-60" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-indigo-200/20 rounded-full blur-3xl opacity-60" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-100/40 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 relative overflow-hidden">
          <div className="p-8">

            {/* Success State Overlay code ... (omitted, unchanged) */}

            {/* Logo & Title */}
            <div className="text-center mb-8">
              <Link to="/" className="inline-block mb-6 hover:scale-105 transition-transform duration-300">
                <div className="flex items-center justify-center gap-2">
                  <div className="p-3 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl shadow-lg shadow-blue-600/20">
                    <Lock className="w-6 h-6 text-white" />
                  </div>
                  <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                    ApniEstate
                  </h1>
                </div>
              </Link>

              <div className="animate-fade-in-up">
                <div className="flex items-center justify-center gap-2 mb-3">
                  <h2 className="text-2xl font-bold text-gray-900">Forgot Password?</h2>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed max-w-[280px] mx-auto">
                  Enter your email address and we'll send you a link to reset your password.
                </p>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Email Address
                </label>
                <div className="relative group">
                  <div className="relative">
                    <Mail
                      className={`absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 transition-colors duration-300 ${emailFocused ? "text-blue-600" : "text-gray-400"
                        }`}
                    />
                    <input
                      type="email"
                      name="email"
                      id="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onFocus={() => setEmailFocused(true)}
                      onBlur={() => setEmailFocused(false)}
                      className="w-full pl-12 pr-4 py-3.5 rounded-lg bg-gray-50 border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 text-gray-900 placeholder-gray-400 outline-none"
                      placeholder="Enter your email address"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3.5 rounded-lg flex items-center justify-center space-x-2 font-semibold shadow-md hover:shadow-lg transition-all duration-200 ${loading
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200 shadow-none"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                  }`}
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <Loader className="w-5 h-5 animate-spin" />
                    <span>Sending...</span>
                  </div>
                ) : (
                  <>
                    <Mail className="w-5 h-5" />
                    <span>Send Reset Link</span>
                  </>
                )}
              </button>

              <div className="text-center">
                <Link
                  to="/login"
                  className="inline-flex items-center text-sm text-gray-500 hover:text-blue-600 transition-colors duration-200 font-medium group"
                >
                  <ArrowLeft className="w-4 h-4 mr-1.5 group-hover:-translate-x-1 transition-transform duration-200" />
                  Back to login
                </Link>
              </div>
            </form>

            {/* Security Badge */}
            <div className="mt-8 flex items-center justify-center gap-2 text-xs text-gray-400 border-t border-gray-100 pt-6">
              <Shield className="w-3.5 h-3.5" />
              <span>Secured by 256-bit SSL encryption</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
