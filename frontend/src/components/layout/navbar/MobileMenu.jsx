import React from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
    X,
    Home,
    Search,
    Users,
    MessageCircle,
    Crown,
    UserCircle,
    PlusCircle,
    MessageSquare,
    Bookmark,
    LogOut,
    Store,
    BotMessageSquare,
    LogIn,
    Phone,
} from "lucide-react";
import PropTypes from "prop-types";
import logo from "../../../assets/images/apniestate-logo.png";

// Mobile Drawer Animation Variants (from right)
const drawerVariants = {
    hidden: { x: "100%", opacity: 0 },
    visible: {
        x: 0,
        opacity: 1,
        transition: {
            type: "spring",
            stiffness: 300,
            damping: 30,
        },
    },
    exit: {
        x: "100%",
        opacity: 0,
        transition: {
            type: "spring",
            stiffness: 300,
            damping: 30,
        },
    },
};

const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
};

const MobileNavItem = ({
    icon: Icon,
    label,
    path,
    currentPath,
    onClick,
    description,
}) => {
    const isActive =
        path === "/" ? currentPath === path : currentPath.startsWith(path);

    return (
        <Link
            to={path}
            onClick={onClick}
            className={`flex items-center gap-2 px-3 py-2.5 rounded-xl transition-all mb-1 ${isActive
                ? "bg-blue-600 text-white shadow-lg"
                : "text-gray-700 hover:bg-gray-50"
                }`}
        >
            <Icon className="w-4 h-4" />
            <div className="flex-1 min-w-0">
                <span className="text-sm font-medium truncate block">{label}</span>
                {description && !isActive && (
                    <span className="block text-xs text-gray-500 truncate">
                        {description}
                    </span>
                )}
            </div>
            {isActive && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
        </Link>
    );
};

MobileNavItem.propTypes = {
    icon: PropTypes.elementType.isRequired,
    label: PropTypes.string.isRequired,
    path: PropTypes.string.isRequired,
    currentPath: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
    description: PropTypes.string,
};

const MobileMenu = ({
    isOpen,
    onClose,
    isAuthenticated,
    user,
    isVendor,
    onLogout,
    getInitials,
    currentPath,
}) => {
    return (
        <>
            {/* Mobile Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        variants={overlayVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        onClick={onClose}
                        className="md:hidden fixed inset-0 bg-black/50 z-40"
                    />
                )}
            </AnimatePresence>

            {/* Mobile Drawer Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        variants={drawerVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="md:hidden fixed right-0 top-0 h-full w-72 bg-white z-50 overflow-y-auto shadow-2xl"
                    >
                        {/* Drawer Header */}
                        <div
                            className={`relative bg-blue-600 transition-all ${isAuthenticated ? "p-4 pb-6" : "p-3"
                                }`}
                        >
                            {/* Close Button */}
                            <button
                                onClick={onClose}
                                className="absolute top-3 right-3 p-1.5 rounded-lg bg-white/20 hover:bg-white/30 transition-colors"
                            >
                                <X className="w-4 h-4 text-white" />
                            </button>

                            {/* Logo & Brand */}
                            <div
                                className={`flex items-center space-x-2 ${isAuthenticated ? "mb-4" : "mb-2"
                                    }`}
                            >
                                <div className="w-10 h-10 rounded-xl bg-white overflow-hidden shadow-sm">
                                    <img
                                        src={logo}
                                        alt="ApniEstate logo"
                                        className="w-full h-full object-cover"
                                    />
                                </div>

                                <div className="flex flex-col">
                                    <span className="text-xl font-bold text-white">
                                        ApniEstate
                                    </span>
                                    <span className="text-xs text-white/80">
                                        Premium Properties
                                    </span>
                                </div>
                            </div>

                            {/* User Info */}
                            {isAuthenticated ? (
                                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20">
                                    <div className="flex items-center space-x-2">
                                        <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-blue-600 font-bold text-sm shadow-sm">
                                            {getInitials(user?.name)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-bold text-white truncate">
                                                {user?.name}
                                            </p>
                                            <p className="text-xs text-white/80 truncate">
                                                {user?.email}
                                            </p>
                                            <div className="flex items-center gap-1 mt-0.5">
                                                {isVendor ? (
                                                    <>
                                                        <Store className="w-3 h-3 text-white" />
                                                        <span className="text-xs text-white font-medium">
                                                            Vendor
                                                        </span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <Crown className="w-3 h-3 text-yellow-300" />
                                                        <span className="text-xs text-white font-medium">
                                                            Premium
                                                        </span>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : null}
                        </div>

                        {/* Navigation Links */}
                        <div className="px-3 py-4">
                            {/* Special Feature */}
                            <div className="mb-3">
                                <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-2">
                                    AI Feature
                                </div>
                                <Link
                                    to="/ai-features"
                                    onClick={onClose}
                                    className={`relative flex items-center gap-3 p-3 rounded-xl transition-all border ${currentPath.startsWith("/ai-property-hub")
                                        ? "bg-blue-600 text-white shadow-lg border-transparent"
                                        : "bg-blue-50 text-blue-800 border-blue-200 hover:shadow-md"
                                        }`}
                                >
                                    {/* Icon Box */}
                                    <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center shadow-sm">
                                        <BotMessageSquare className="w-6 h-6 text-blue-600" />
                                    </div>

                                    {/* Text */}
                                    <div className="flex flex-col flex-1 min-w-0">
                                        <span className="text-sm font-bold truncate">
                                            AI Property Hub
                                        </span>
                                        <span className="text-xs opacity-80 truncate">
                                            Smart recommendations
                                        </span>
                                    </div>

                                    {/* NEW badge */}
                                    <span className="text-xs bg-yellow-400 text-yellow-900 px-2 py-0.5 rounded-full font-bold shadow-sm">
                                        NEW
                                    </span>
                                </Link>
                            </div>

                            {/* Navigation Section */}
                            <div className="mb-3">
                                <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-2">
                                    Navigation
                                </div>
                                <MobileNavItem
                                    icon={Home}
                                    label="Home"
                                    path="/"
                                    currentPath={currentPath}
                                    onClick={onClose}
                                    description="Welcome home"
                                />
                                <MobileNavItem
                                    icon={Search}
                                    label="Properties"
                                    path="/properties"
                                    currentPath={currentPath}
                                    onClick={onClose}
                                    description="Find your dream"
                                />
                                <MobileNavItem
                                    icon={Users}
                                    label="About Us"
                                    path="/about"
                                    currentPath={currentPath}
                                    onClick={onClose}
                                    description="Our story"
                                />
                                <MobileNavItem
                                    icon={Phone}
                                    label="Contact"
                                    path="/contact"
                                    currentPath={currentPath}
                                    onClick={onClose}
                                    description="Get in touch"
                                />
                            </div>

                            {/* Register Button */}
                            {!isAuthenticated && (
                                <div className="mb-4 space-y-2 mt-3">
                                    <Link
                                        to="/register"
                                        onClick={onClose}
                                        className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all"
                                    >
                                        <Crown className="w-4 h-4" />
                                        <span className="text-sm">Register</span>
                                    </Link>
                                </div>
                            )}

                            {/* Account Section - When Authenticated */}
                            {isAuthenticated && (
                                <div className="border-t border-gray-200 pt-3">
                                    <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-2">
                                        Account
                                    </div>
                                    <MobileNavItem
                                        icon={UserCircle}
                                        label="My Profile"
                                        path="/profile"
                                        currentPath={currentPath}
                                        onClick={onClose}
                                    />
                                    {isVendor && (
                                        <MobileNavItem
                                            icon={PlusCircle}
                                            label="Add New Service"
                                            path="/vendor/add-service"
                                            currentPath={currentPath}
                                            onClick={onClose}
                                        />
                                    )}
                                    {isVendor ? (
                                        <MobileNavItem
                                            icon={MessageSquare}
                                            label="Chat"
                                            path="/messages"
                                            currentPath={currentPath}
                                            onClick={onClose}
                                        />
                                    ) : (
                                        <MobileNavItem
                                            icon={Bookmark}
                                            label="Favourite Properties"
                                            path="/saved"
                                            currentPath={currentPath}
                                            onClick={onClose}
                                        />
                                    )}
                                    <button
                                        onClick={onLogout}
                                        className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-red-600 hover:bg-red-50 transition-all mt-1"
                                    >
                                        <LogOut className="w-4 h-4" />
                                        <span className="text-sm font-medium">Sign out</span>
                                    </button>
                                </div>
                            )}

                            {/* Account Section - When Not Authenticated */}
                            {!isAuthenticated && (
                                <div className="border-t border-gray-200 pt-3">
                                    <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-2">
                                        Account
                                    </div>
                                    <Link
                                        to="/login"
                                        onClick={onClose}
                                        className="flex items-center gap-2 px-3 py-3 rounded-xl bg-white border-2 border-gray-200 text-gray-700 hover:border-blue-500 hover:bg-blue-50 transition-all mb-2 shadow-sm"
                                    >
                                        <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                                            <LogIn className="w-4 h-4 text-gray-600" />
                                        </div>
                                        <span className="text-sm font-semibold">Log In</span>
                                    </Link>
                                    <Link
                                        to="/signup"
                                        onClick={onClose}
                                        className="flex items-center gap-2 px-3 py-3 rounded-xl bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all relative overflow-hidden"
                                    >
                                        <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                                            <Bookmark className="w-4 h-4 text-white" />
                                        </div>
                                        <span className="text-sm">Create account</span>
                                        <motion.div
                                            animate={{
                                                x: [0, 100, 100, 0],
                                                opacity: [0, 0.5, 0.5, 0],
                                            }}
                                            transition={{
                                                duration: 2,
                                                repeat: Infinity,
                                                ease: "easeInOut",
                                            }}
                                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                                        />
                                    </Link>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

MobileMenu.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    isAuthenticated: PropTypes.bool,
    user: PropTypes.object,
    isVendor: PropTypes.bool,
    onLogout: PropTypes.func.isRequired,
    getInitials: PropTypes.func.isRequired,
    currentPath: PropTypes.string.isRequired,
};

export default MobileMenu;
