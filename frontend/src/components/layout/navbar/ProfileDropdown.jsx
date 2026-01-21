import React, { useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
    ChevronDown,
    LogOut,
    Store,
    Crown,
    UserCircle,
    PlusCircle,
    Bookmark,
} from "lucide-react";
import PropTypes from "prop-types";

const ProfileDropdown = ({
    user,
    isVendor,
    isOpen,
    toggleOpen,
    closeDropdown,
    onLogout,
    getInitials,
}) => {
    const dropdownRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                closeDropdown();
            }
        };

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen, closeDropdown]);

    const handleGoToProfile = () => {
        closeDropdown();
        navigate("/profile");
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={toggleOpen}
                className="flex items-center space-x-3 p-1.5 rounded-xl hover:bg-gray-50 transition-all duration-200 focus:outline-none"
                aria-label="User menu"
                aria-expanded={isOpen}
            >
                <div className="relative">
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-md"
                    >
                        {getInitials(user?.name)}
                    </motion.div>
                    <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-500 border-2 border-white rounded-full flex items-center justify-center">
                        <div className="w-1.5 h-1.5 bg-white rounded-full" />
                    </div>
                </div>
                <div className="hidden lg:flex flex-col items-start">
                    <span className="text-sm font-semibold text-gray-700">
                        {user?.name}
                    </span>
                    <span className="text-xs text-gray-500">
                        {isVendor ? "Vendor" : "Premium Member"}
                    </span>
                </div>
                <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                </motion.div>
            </motion.button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-3 w-72 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden"
                    >
                        <div className="px-6 py-4 bg-gray-50 border-b border-gray-100">
                            <div className="flex items-center space-x-3">
                                <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold shadow-md">
                                    {getInitials(user?.name)}
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-bold text-gray-900">
                                        {user?.name}
                                    </p>
                                    <p className="text-xs text-gray-600 truncate">
                                        {user?.email}
                                    </p>
                                    <div className="flex items-center gap-1 mt-1">
                                        {isVendor ? (
                                            <>
                                                <Store className="w-3 h-3 text-blue-600" />
                                                <span className="text-xs text-blue-700 font-medium">
                                                    Vendor
                                                </span>
                                            </>
                                        ) : (
                                            <>
                                                <Crown className="w-3 h-3 text-orange-500" />
                                                <span className="text-xs text-orange-600 font-medium">
                                                    Premium
                                                </span>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="py-2">
                            <motion.button
                                whileHover={{
                                    x: 4,
                                    backgroundColor: "rgb(243 244 246)",
                                }}
                                onClick={handleGoToProfile}
                                className="w-full px-6 py-3 text-left text-sm text-gray-700 hover:text-blue-600 flex items-center space-x-3 transition-colors"
                            >
                                <UserCircle className="w-4 h-4" />
                                <span>My Profile</span>
                            </motion.button>

                            {isVendor && (
                                <motion.button
                                    whileHover={{
                                        x: 4,
                                        backgroundColor: "rgb(243 244 246)",
                                    }}
                                    onClick={() => {
                                        closeDropdown();
                                        navigate("/vendor/add-service");
                                    }}
                                    className="w-full px-6 py-3 text-left text-sm text-gray-700 hover:text-blue-600 flex items-center space-x-3 transition-colors"
                                >
                                    <PlusCircle className="w-4 h-4" />
                                    <span>Add New Service</span>
                                </motion.button>
                            )}

                            <motion.button
                                whileHover={{
                                    x: 4,
                                    backgroundColor: "rgb(243 244 246)",
                                }}
                                onClick={() => {
                                    closeDropdown();
                                    navigate("/saved");
                                }}
                                className="w-full px-6 py-3 text-left text-sm text-gray-700 hover:text-blue-600 flex items-center space-x-3 transition-colors"
                            >
                                <Bookmark className="w-4 h-4" />
                                <span>Favourite Properties</span>
                            </motion.button>

                            <div className="border-t border-gray-100 my-2" />
                            <motion.button
                                whileHover={{
                                    x: 4,
                                    backgroundColor: "rgb(254 242 242)",
                                }}
                                onClick={onLogout}
                                className="w-full px-6 py-3 text-left text-sm text-red-600 hover:text-red-700 flex items-center space-x-3 transition-colors"
                            >
                                <LogOut className="w-4 h-4" />
                                <span>Sign out</span>
                            </motion.button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

ProfileDropdown.propTypes = {
    user: PropTypes.object,
    isVendor: PropTypes.bool,
    isOpen: PropTypes.bool,
    toggleOpen: PropTypes.func.isRequired,
    closeDropdown: PropTypes.func.isRequired,
    onLogout: PropTypes.func.isRequired,
    getInitials: PropTypes.func.isRequired,
};

export default ProfileDropdown;
