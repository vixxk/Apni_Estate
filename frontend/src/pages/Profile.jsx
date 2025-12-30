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
} from "lucide-react";

// Skeleton Loading Component
const SkeletonLoader = () => (
  <div className="max-w-4xl mx-auto p-4 sm:p-6 mt-16 sm:mt-20 animate-pulse">
    <div className="h-8 sm:h-10 bg-gray-200 rounded-lg w-48 mb-6"></div>

    <div className="bg-white shadow-lg rounded-2xl overflow-hidden">
      {/* Avatar Section Skeleton */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 sm:p-8 flex flex-col items-center border-b">
        <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-gray-300"></div>
        <div className="mt-4 space-y-2 flex flex-col items-center">
          <div className="h-10 bg-gray-200 rounded-lg w-32"></div>
          <div className="h-6 bg-gray-200 rounded w-48"></div>
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
      <div className="min-h-screen flex items-center justify-center px-4 mt-16">
        <div className="text-center bg-white p-8 rounded-2xl shadow-lg max-w-md">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-blue-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Not Logged In
          </h2>
          <p className="text-gray-600">
            Please sign in to view your profile.
          </p>
        </div>
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

        {/* <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
          My Profile
        </h1> */}

        <div className="bg-white shadow-lg rounded-2xl overflow-hidden">
          {/* Avatar Section */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 sm:p-8 border-b">
            <div className="flex flex-col items-center space-y-4">
              <div className="relative group">
                <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden bg-gradient-to-br from-blue-400 to-indigo-500 shadow-xl ring-4 ring-white">
                  {avatarPreview ? (
                    <img
                      src={avatarPreview}
                      alt="Avatar"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <User className="w-12 h-12 sm:w-16 sm:h-16 text-white" />
                    </div>
                  )}
                </div>

                {/* Camera Icon Overlay */}
                <label className="absolute bottom-0 right-0 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-2 sm:p-2.5 cursor-pointer shadow-lg transition-all hover:scale-110">
                  <Camera className="w-4 h-4 sm:w-5 sm:h-5" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </label>
              </div>

              <div className="text-center">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                  {name || "User"}
                </h2>
                <p className="text-sm text-gray-600 mt-1">{user.email}</p>
              </div>

              {/* Avatar Actions */}
              <div className="flex flex-wrap gap-2 justify-center">
                {selectedFile && (
                  <button
                    onClick={handleAvatarUpload}
                    disabled={uploadingAvatar}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium disabled:opacity-60 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg"
                  >
                    <Upload className="w-4 h-4" />
                    {uploadingAvatar ? "Uploading..." : "Upload"}
                  </button>
                )}

                {user.avatar && !selectedFile && (
                  <button
                    onClick={handleRemoveAvatar}
                    disabled={uploadingAvatar}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg text-sm font-medium disabled:opacity-60 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                    Remove
                  </button>
                )}
              </div>

              <p className="text-xs text-gray-500 text-center">
                Max 5MB • JPG, PNG, GIF
              </p>
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
