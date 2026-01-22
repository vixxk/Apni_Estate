import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
    User,
    Phone,
    Mail,
    Calendar,
    Shield,
    MessageCircle,
} from "lucide-react";
import { Backendurl } from "../../App";

const UserProfileSkeleton = () => {
    return (
        <div className="min-h-screen bg-gray-50 pb-16 md:pb-20 lg:pb-12 pt-20">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 animate-pulse">
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                    <div className="h-32 bg-slate-200"></div>
                    <div className="px-6 pb-8">
                        <div className="flex flex-col items-center -mt-12">
                            <div className="w-32 h-32 rounded-full bg-slate-200 border-4 border-white"></div>
                            <div className="mt-4 h-8 bg-slate-200 rounded w-48"></div>
                            <div className="mt-2 h-4 bg-slate-200 rounded w-32"></div>
                        </div>
                        <div className="mt-8 space-y-4">
                            <div className="h-12 bg-slate-200 rounded-xl"></div>
                            <div className="h-12 bg-slate-200 rounded-xl"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const UserProfile = () => {
    const { userId } = useParams();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);

    const token = localStorage.getItem("token");

    useEffect(() => {
        fetchUserData();
        if (token) {
            fetchCurrentUser();
        }
    }, [userId]);

    const fetchCurrentUser = async () => {
        try {
            const { data } = await axios.get(`${Backendurl}/api/users/me`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setCurrentUser(data.data.user);
        } catch (err) {
            console.error("Error fetching current user", err);
        }
    }

    const fetchUserData = async () => {
        try {
            setLoading(true);
            const response = await axios.get(
                `${Backendurl}/api/users/public/${userId}`
            );
            setUser(response.data.data);
            setError(null);
        } catch (err) {
            console.error("Error fetching user data:", err);
            setError("Failed to load user profile");
        } finally {
            setLoading(false);
        }
    };

    const handleChatClick = () => {
        if (!token) {
            navigate("/login");
            return;
        }

        // Prevent self-chat
        if (currentUser && (currentUser._id === user._id || currentUser.id === user._id)) {
            alert("You cannot chat with yourself");
            return;
        }

        navigate(`/chat/${user._id}`, {
            state: {
                vendorName: user.name,
                vendorAvatar: user.avatar || null,
            },
        });
    };

    if (loading) {
        return <UserProfileSkeleton />;
    }

    if (error || !user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
                <div className="text-center p-8 bg-white rounded-2xl shadow-lg max-w-md w-full">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <User className="w-8 h-8 text-red-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                        User Not Found
                    </h3>
                    <p className="text-gray-600 mb-6">{error || "The user you are looking for does not exist."}</p>
                    <button
                        onClick={() => navigate(-1)}
                        className="px-6 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">


                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    {/* Cover Area */}
                    <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-600 relative">
                        <div className="absolute inset-0 bg-pattern opacity-10"></div>
                    </div>

                    <div className="px-6 pb-8">
                        <div className="relative flex flex-col items-center -mt-16 mb-6">
                            <div className="relative">
                                {user.avatar ? (
                                    <img
                                        src={user.avatar}
                                        alt={user.name}
                                        className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover bg-white"
                                    />
                                ) : (
                                    <div className="w-32 h-32 rounded-full border-4 border-white shadow-lg bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center text-blue-500">
                                        <User className="w-16 h-16" />
                                    </div>
                                )}
                                <div className="absolute bottom-2 right-2 w-6 h-6 bg-green-500 border-2 border-white rounded-full"></div>
                            </div>

                            <h1 className="mt-4 text-2xl font-bold text-gray-900">
                                {user.name}
                            </h1>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="px-3 py-1 bg-blue-50 text-blue-700 text-sm font-medium rounded-full border border-blue-100 capitalize">
                                    {user.role}
                                </span>
                                <span className="text-sm text-gray-500 flex items-center gap-1">
                                    <Calendar className="w-3 h-3" />
                                    Joined {new Date(user.createdAt).getFullYear()}
                                </span>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
                            <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 flex items-center gap-3">
                                <div className="p-2 bg-white rounded-lg shadow-sm text-blue-600">
                                    <Mail className="w-5 h-5" />
                                </div>
                                <div className="overflow-hidden">
                                    <p className="text-xs text-gray-500 font-medium">Email Address</p>
                                    <p className="text-sm font-semibold text-gray-900 truncate" title={user.email}>{user.email}</p>
                                </div>
                            </div>

                            <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 flex items-center gap-3">
                                <div className="p-2 bg-white rounded-lg shadow-sm text-green-600">
                                    <Shield className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 font-medium">Account Status</p>
                                    <p className="text-sm font-semibold text-gray-900">Verified & Active</p>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        {currentUser && currentUser._id !== user._id && (
                            <div className="mt-8 flex justify-center">
                                <button
                                    onClick={handleChatClick}
                                    className="flex items-center gap-2 px-8 py-3 bg-blue-600 text-white rounded-xl shadow-lg hover:bg-blue-700 transition-all hover:-translate-y-1"
                                >
                                    <MessageCircle className="w-5 h-5" />
                                    Send Message
                                </button>
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;
