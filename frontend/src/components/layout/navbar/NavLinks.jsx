import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
    Home,
    Users,
    BotMessageSquare,
    Search,
    Phone,
    MessageSquare,
    ChevronDown,
} from "lucide-react";
import PropTypes from "prop-types";

const NavLinks = ({ currentPath, isAuthenticated }) => {
    const [hoveredLink, setHoveredLink] = useState(null);

    const links = [
        {
            name: "Home",
            path: "/",
            icon: Home,
            color: "from-blue-500 to-cyan-500",
        },
        {
            name: "About Us",
            path: "/about",
            icon: Users,
            color: "from-purple-500 to-pink-500",
        },
        {
            name: "AI Features",
            path: "/ai-features",
            icon: BotMessageSquare,
            color: "from-indigo-600 to-purple-600",
        },
        {
            name: "Properties",
            path: "/properties",
            icon: Search,
            color: "from-green-500 to-emerald-500",
            hasDropdown: true,
            dropdownItems: [
                { label: "Apartments", value: "apartment" },
                { label: "Houses", value: "house" },
                { label: "Villas", value: "villa" },
                { label: "Plots", value: "plot" },
                { label: "Commercial", value: "commercial" },
            ]
        },
        {
            name: "Contact",
            path: "/contact",
            icon: Phone,
            color: "from-orange-500 to-red-500",
        },
        ...(isAuthenticated
            ? [
                {
                    name: "Chat",
                    path: "/messages",
                    icon: MessageSquare,
                    color: "from-indigo-500 to-blue-500",
                },
            ]
            : []),
    ];

    return (
        <div className="flex items-center gap-1 sm:gap-2">
            {links.map(({ name, path, icon: Icon, color, hasDropdown, dropdownItems }) => {
                const isActive =
                    path === "/" ? currentPath === path : currentPath.startsWith(path);

                return (
                    <div
                        key={name}
                        className="relative"
                        onMouseEnter={() => hasDropdown && setHoveredLink(name)}
                        onMouseLeave={() => hasDropdown && setHoveredLink(null)}
                    >
                        <Link
                            to={path}
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all duration-300 relative z-10
                                ${isActive
                                    ? `text-white bg-gradient-to-r ${color} shadow-md`
                                    : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                                }`}
                        >
                            <Icon className={`w-4 h-4 ${isActive ? "text-white" : ""}`} />
                            <span className="text-sm tracking-wide">{name}</span>
                            {hasDropdown && (
                                <ChevronDown
                                    className={`w-3.5 h-3.5 transition-transform duration-300 ${hoveredLink === name ? "rotate-180" : ""}`}
                                />
                            )}
                        </Link>

                        {/* Dropdown Menu */}
                        <AnimatePresence>
                            {hasDropdown && hoveredLink === name && (
                                <motion.div
                                    initial={{ opacity: 0, y: 15, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                    transition={{ duration: 0.2, ease: "easeOut" }}
                                    className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-48 bg-white rounded-2xl shadow-xl shadow-blue-900/10 border border-gray-100 overflow-hidden z-20"
                                >
                                    <div className={`h-1 w-full bg-gradient-to-r ${color}`}></div>
                                    <div className="p-1">
                                        {dropdownItems.map((item) => (
                                            <Link
                                                key={item.value}
                                                to={`${path}?type=${item.value}`}
                                                className="block px-4 py-2.5 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors text-left font-medium"
                                            >
                                                {item.label}
                                            </Link>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                );
            })}
        </div>
    );
};

NavLinks.propTypes = {
    currentPath: PropTypes.string.isRequired,
    isAuthenticated: PropTypes.bool,
};

export default NavLinks;
