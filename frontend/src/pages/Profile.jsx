import { useEffect, useState } from "react";
import axios from "axios";
import { Backendurl } from "../App";

function Profile() {
  const [user, setUser] = useState(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

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

      alert("Profile updated");
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

    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("Image size should be less than 5MB");
      return;
    }

    setSelectedFile(file);

    // Create preview
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

      // Update localStorage
      const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
      localStorage.setItem(
        "user",
        JSON.stringify({ ...currentUser, avatar: data.data.avatar })
      );

      alert("Avatar updated successfully");
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

      // Update localStorage
      const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
      localStorage.setItem(
        "user",
        JSON.stringify({ ...currentUser, avatar: null })
      );

      alert("Avatar removed successfully");
    } catch (err) {
      console.error("Failed to remove avatar", err);
      alert("Failed to remove avatar");
    } finally {
      setUploadingAvatar(false);
    }
  };

  if (loading) {
    return <div className="p-8 mt-20">Loading profile...</div>;
  }

  if (!user) {
    return (
      <div className="p-8 mt-20">
        You are not logged in. Please sign in to view your profile.
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6 mt-20">
      <h1 className="text-2xl font-bold mb-6">My Profile</h1>

      <div className="bg-white shadow rounded-xl p-6 space-y-6">
        {/* Avatar Section */}
        <div className="flex flex-col items-center space-y-4 pb-6 border-b">
          <div className="relative">
            <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
              {avatarPreview ? (
                <img
                  src={avatarPreview}
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                <svg
                  className="w-16 h-16 text-gray-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </div>
          </div>

          <div className="flex flex-col items-center space-y-2">
            <label className="cursor-pointer px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition">
              Choose Image
              <input
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
            </label>

            {selectedFile && (
              <button
                onClick={handleAvatarUpload}
                disabled={uploadingAvatar}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium disabled:opacity-60 transition"
              >
                {uploadingAvatar ? "Uploading..." : "Upload Avatar"}
              </button>
            )}

            {user.avatar && !selectedFile && (
              <button
                onClick={handleRemoveAvatar}
                disabled={uploadingAvatar}
                className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg text-sm font-medium disabled:opacity-60 transition"
              >
                Remove Avatar
              </button>
            )}
          </div>

          <p className="text-xs text-gray-500">
            Max size: 5MB. Supported: JPG, PNG, GIF
          </p>
        </div>

        {/* Email Display */}
        <div>
          <p className="text-sm text-gray-500">Email</p>
          <p className="font-medium break-all">{user.email}</p>
        </div>

        {/* Profile Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border rounded-lg px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Phone</label>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white disabled:opacity-60 hover:bg-blue-700 transition"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Profile;
