import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
    Home,
    Users,
    BotMessageSquare,
    Search,
    MessageCircle,
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
            icon: MessageCircle,
            color: "from-orange-500 to-red-500",
        },
        ...(isAuthenticated
            ? [
                {
                    name: "Chat",
                    path: "/messages",
                    icon: MessageCircle,
                    color: "from-indigo-500 to-blue-500",
                },
            ]
            : []),
    ];

    return (
        <div className="flex items-center space-x-2">
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
                        <motion.div
                            whileHover={{ y: -2 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Link
                                to={path}
                                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold transition-all z-10 relative
                  ${isActive
                                        ? `text-white bg-gradient-to-r ${color} shadow-lg`
                                        : "text-gray-700 hover:text-blue-600 hover:bg-blue-50"
                                    }`}
                            >
                                <Icon className="w-4 h-4" />
                                <span>{name}</span>
                                {hasDropdown && <ChevronDown className="w-3 h-3 ml-0.5 opacity-70" />}
                            </Link>
                        </motion.div>

                        {/* Dropdown Menu */}
                        <AnimatePresence>
                            {hasDropdown && hoveredLink === name && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                    transition={{ duration: 0.2 }}
                                    className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50 p-1"
                                >
                                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-indigo-500"></div>
                                    {dropdownItems.map((item) => (
                                        <Link
                                            key={item.value}
                                            to={`${path}?type=${item.value}`}
                                            className="block px-4 py-2.5 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors text-center"
                                        >
                                            {item.label}
                                        </Link>
                                    ))}
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
