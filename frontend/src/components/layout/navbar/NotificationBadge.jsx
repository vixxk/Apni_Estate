import React from "react";
import { motion } from "framer-motion";
import { Bell } from "lucide-react";
import PropTypes from "prop-types";

const NotificationBadge = ({ onClick, count }) => {
    return (
        <motion.button
            onClick={onClick}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative p-2 rounded-xl hover:bg-blue-50 transition-colors"
            aria-label="Notifications"
        >
            <Bell className="w-5 h-5 text-gray-700" />
            {count > 0 && (
                <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1 rounded-full bg-red-500 text-white text-xs font-bold flex items-center justify-center shadow"
                >
                    {count > 99 ? "99+" : count}
                </motion.span>
            )}
        </motion.button>
    );
};

NotificationBadge.propTypes = {
    onClick: PropTypes.func.isRequired,
    count: PropTypes.number,
};

export default NotificationBadge;
