import { useEffect, useState } from "react";
import axios from "axios";
import { Backendurl } from "../App";
import {
  User,
  Mail,
  Phone,
  Upload,
  Trash2,
  Save,
  Camera,
  CheckCircle,
  Sparkles
} from "lucide-react";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

const iconVariants = {
  hidden: { scale: 0, rotate: -180 },
  visible: {
    scale: 1,
    rotate: 0,
    transition: {
      type: "spring",
      stiffness: 200,
      damping: 15,
    },
  },
};

const floatingAnimation = {
  y: [0, -10, 0],
  transition: {
    duration: 3,
    repeat: Infinity,
    ease: "easeInOut",
  },
};

const pulseAnimation = {
  scale: [1, 1.05, 1],
  transition: {
    duration: 2,
    repeat: Infinity,
    ease: "easeInOut",
  },
};

const sparkleVariants = {
  initial: { scale: 0, rotate: 0, opacity: 0 },
  animate: {
    scale: [0, 1, 0],
    rotate: [0, 180, 360],
    opacity: [0, 1, 0],
    transition: {
      duration: 2,
      repeat: Infinity,
      repeatDelay: 1,
    },
  },
};

// Skeleton Loading Component
const SkeletonLoader = () => (
  <div className="max-w-4xl mx-auto p-4 sm:p-6 mt-16 sm:mt-20 animate-pulse">
    <div className="h-8 sm:h-10 bg-gray-200 rounded-lg w-48 mb-6"></div>

    <div className="bg-white shadow-lg rounded-2xl overflow-hidden">
      {/* Avatar Section Skeleton */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 sm:p-6 flex flex-col items-center border-b">
        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gray-300"></div>
        <div className="mt-3 space-y-2 flex flex-col items-center">
          <div className="h-6 bg-gray-200 rounded-lg w-32"></div>
          <div className="h-4 bg-gray-200 rounded w-40"></div>
        </div>
      </div>

      {/* Form Section Skeleton */}
      <div className="p-6 sm:p-8 space-y-6">
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-16"></div>
          <div className="h-12 bg-gray-200 rounded-lg"></div>
        </div>
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-16"></div>
          <div className="h-12 bg-gray-200 rounded-lg"></div>
        </div>
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-16"></div>
          <div className="h-12 bg-gray-200 rounded-lg"></div>
        </div>
        <div className="h-12 bg-gray-200 rounded-lg w-36"></div>
      </div>
    </div>
  </div>
);

function Profile() {
  const [user, setUser] = useState(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const { data } = await axios.get(`${Backendurl}/api/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const me = data.data.user;
        setUser(me);
        setName(me.name || "");
        setPhone(me.phone ?? "");
        setAvatarPreview(me.avatar || null);
      } catch (err) {
        console.error("Failed to load profile", err);
        alert("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchMe();
    } else {
      setLoading(false);
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);

      const { data } = await axios.put(
        `${Backendurl}/api/users/me`,
        { name, phone },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const updated = data.data.user;
      setUser(updated);
      localStorage.setItem("user", JSON.stringify(updated));

      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (err) {
      console.error("Failed to update profile", err);
      alert("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Image size should be less than 5MB");
      return;
    }

    setSelectedFile(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleAvatarUpload = async () => {
    if (!selectedFile) return;

    try {
      setUploadingAvatar(true);

      const formData = new FormData();
      formData.append("avatar", selectedFile);

      const { data } = await axios.post(
        `${Backendurl}/api/users/avatar`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setUser({ ...user, avatar: data.data.avatar });
      setAvatarPreview(data.data.avatar);
      setSelectedFile(null);

      const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
      localStorage.setItem(
        "user",
        JSON.stringify({ ...currentUser, avatar: data.data.avatar })
      );

      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (err) {
      console.error("Failed to upload avatar", err);
      alert(err.response?.data?.message || "Failed to upload avatar");
      setAvatarPreview(user?.avatar || null);
      setSelectedFile(null);
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleRemoveAvatar = async () => {
    if (!window.confirm("Are you sure you want to remove your avatar?")) return;

    try {
      setUploadingAvatar(true);

      await axios.delete(`${Backendurl}/api/users/avatar`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUser({ ...user, avatar: null });
      setAvatarPreview(null);
      setSelectedFile(null);

      const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
      localStorage.setItem(
        "user",
        JSON.stringify({ ...currentUser, avatar: null })
      );

      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (err) {
      console.error("Failed to remove avatar", err);
      alert("Failed to remove avatar");
    } finally {
      setUploadingAvatar(false);
    }
  };

  if (loading) {
    return <SkeletonLoader />;
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center px-4 pt-20">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-lg w-full bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/60 p-8 sm:p-10 text-center relative overflow-hidden"
        >
          {/* Background Gradient Orbs */}
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{ duration: 4, repeat: Infinity }}
            className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{ duration: 4, repeat: Infinity, delay: 2 }}
            className="absolute -bottom-20 -left-20 w-40 h-40 bg-gradient-to-br from-pink-400 to-indigo-400 rounded-full blur-3xl"
          />

          {/* Icon with Animation */}
          <motion.div
            variants={iconVariants}
            animate={floatingAnimation}
            className="relative mx-auto mb-6 w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg"
          >
            <User className="w-10 h-10 text-white" />
            
            {/* Sparkle Effects */}
            <motion.div
              variants={sparkleVariants}
              initial="initial"
              animate="animate"
              className="absolute -top-2 -right-2"
            >
              <Sparkles className="w-5 h-5 text-yellow-400" />
            </motion.div>
            
            <motion.div
              variants={sparkleVariants}
              initial="initial"
              animate="animate"
              style={{ transitionDelay: "1s" }}
              className="absolute -bottom-1 -left-1"
            >
              <Sparkles className="w-4 h-4 text-pink-400" />
            </motion.div>

            {/* Pulse Ring */}
            <motion.div
              animate={pulseAnimation}
              className="absolute inset-0 rounded-full border-4 border-blue-400/30"
            />
          </motion.div>

          {/* Heading */}
          <motion.h1
            variants={itemVariants}
            className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3"
          >
            Your Profile Awaits
          </motion.h1>

          {/* Description */}
          <motion.p
            variants={itemVariants}
            className="text-gray-600 text-sm sm:text-base mb-6"
          >
            Sign in to manage your profile, upload a photo, update your details,
            and get a personalized experience.
          </motion.p>

          {/* Benefits */}
          <motion.div
            variants={itemVariants}
            className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-4 mb-6 text-left border border-blue-100"
          >
            <ul className="space-y-2 text-sm text-blue-900">
              <motion.li
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
                className="flex items-center gap-2"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, delay: 0.7 }}
                >
                  <CheckCircle className="w-4 h-4 text-blue-600" />
                </motion.div>
                Edit personal details anytime
              </motion.li>
              <motion.li
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 }}
                className="flex items-center gap-2"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, delay: 0.9 }}
                >
                  <CheckCircle className="w-4 h-4 text-blue-600" />
                </motion.div>
                Upload and manage your profile photo
              </motion.li>
              <motion.li
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.0 }}
                className="flex items-center gap-2"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, delay: 1.1 }}
                >
                  <CheckCircle className="w-4 h-4 text-blue-600" />
                </motion.div>
                Secure and verified account
              </motion.li>
            </ul>
          </motion.div>

          {/* Actions */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-3 justify-center"
          >
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 10px 40px rgba(59, 130, 246, 0.3)" }}
              whileTap={{ scale: 0.95 }}
              onClick={() => (window.location.href = "/login")}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all relative overflow-hidden group"
            >
              <span className="relative z-10">Sign In</span>
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-blue-700 to-indigo-700 opacity-0 group-hover:opacity-100 transition-opacity"
              />
            </motion.button>

            <motion.button
              whileHover={{ 
                scale: 1.05, 
                borderColor: "rgb(96, 165, 250)",
                backgroundColor: "rgb(239, 246, 255)"
              }}
              whileTap={{ scale: 0.95 }}
              onClick={() => (window.location.href = "/signup")}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white border-2 border-gray-200 text-gray-700 font-semibold transition-all relative overflow-hidden group"
            >
              <span className="relative z-10 group-hover:text-blue-600 transition-colors">
                Create Account
              </span>
            </motion.button>
          </motion.div>

          {/* Footer note */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="mt-6 text-xs text-gray-500"
          >
            It takes less than a minute to get started.
          </motion.p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 mt-16 sm:mt-20">
        {/* Success Toast */}
        {showSuccess && (
          <div className="fixed top-20 right-4 sm:right-6 z-50 bg-green-500 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-slide-in">
            <CheckCircle className="w-5 h-5" />
            <span className="font-medium">Changes saved successfully!</span>
          </div>
        )}

        <div className="bg-white shadow-lg rounded-2xl overflow-hidden">
          {/* Compact Avatar Section */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 sm:p-6 border-b">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
              {/* Avatar */}
              <div className="relative group flex-shrink-0">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden bg-gradient-to-br from-blue-400 to-indigo-500 shadow-lg ring-4 ring-white">
                  {avatarPreview ? (
                    <img
                      src={avatarPreview}
                      alt="Avatar"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <User className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
                    </div>
                  )}
                </div>

                {/* Camera Icon Overlay */}
                <label className="absolute bottom-0 right-0 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-1.5 sm:p-2 cursor-pointer shadow-lg transition-all hover:scale-110">
                  <Camera className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </label>
              </div>

              {/* User Info & Actions */}
              <div className="flex-1 text-center sm:text-left space-y-3">
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                    {name || "User"}
                  </h2>
                  <p className="text-xs sm:text-sm text-gray-600">{user.email}</p>
                </div>

                {/* Avatar Actions - Compact */}
                <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                  {selectedFile && (
                    <button
                      onClick={handleAvatarUpload}
                      disabled={uploadingAvatar}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-medium disabled:opacity-60 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      {uploadingAvatar ? "Uploading..." : "Upload"}
                    </button>
                  )}

                  {user.avatar && !selectedFile && (
                    <button
                      onClick={handleRemoveAvatar}
                      disabled={uploadingAvatar}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg text-xs font-medium disabled:opacity-60 transition-all"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Remove
                    </button>
                  )}
                </div>

                <p className="text-[10px] sm:text-xs text-gray-500">
                  Max 5MB • JPG, PNG, GIF
                </p>
              </div>
            </div>
          </div>

          {/* Profile Form */}
          <form onSubmit={handleSubmit} className="p-6 sm:p-8">
            <div className="space-y-6">
              {/* Email (Read-only) */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <Mail className="w-4 h-4 text-gray-500" />
                  Email
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={user.email}
                    disabled
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-600 cursor-not-allowed focus:outline-none"
                  />
                </div>
                <p className="text-xs text-gray-500">
                  Email cannot be changed
                </p>
              </div>

              {/* Name */}
              <div className="space-y-2">
                <label
                  htmlFor="name"
                  className="flex items-center gap-2 text-sm font-semibold text-gray-700"
                >
                  <User className="w-4 h-4 text-gray-500" />
                  Full Name
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Enter your full name"
                  required
                />
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <label
                  htmlFor="phone"
                  className="flex items-center gap-2 text-sm font-semibold text-gray-700"
                >
                  <Phone className="w-4 h-4 text-gray-500" />
                  Phone Number
                </label>
                <input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Enter your phone number"
                />
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={saving}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium disabled:opacity-60 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg"
                >
                  <Save className="w-5 h-5" />
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Additional Info Card */}
        <div className="mt-6 bg-blue-50 border border-blue-100 rounded-xl p-4 sm:p-6">
          <h3 className="text-sm font-semibold text-blue-900 mb-2">
            Profile Tips
          </h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Keep your profile information up to date</li>
            <li>• Use a clear profile picture for better recognition</li>
            <li>• Your email is verified and cannot be changed</li>
          </ul>
        </div>
      </div>

      <style jsx>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}

export default Profile;
