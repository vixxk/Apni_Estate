import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import PropTypes from "prop-types";

const PasswordStrength = ({ password, strength }) => {
    return (
        <AnimatePresence>
            {password && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-2"
                >
                    <div className="flex items-center space-x-2 mb-1">
                        <span className="text-sm text-gray-600">Password strength:</span>
                        <span
                            className={`text-sm font-medium ${strength < 50
                                ? "text-red-500"
                                : strength < 75
                                    ? "text-yellow-500"
                                    : "text-green-500"
                                }`}
                        >
                            {strength < 50
                                ? "Weak"
                                : strength < 75
                                    ? "Medium"
                                    : "Strong"}
                        </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${strength}%` }}
                            transition={{ duration: 0.3 }}
                            className={`h-2 rounded-full transition-colors duration-300 ${strength < 50
                                ? "bg-red-500"
                                : strength < 75
                                    ? "bg-yellow-500"
                                    : "bg-green-500"
                                }`}
                        />
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

PasswordStrength.propTypes = {
    password: PropTypes.string,
    strength: PropTypes.number.isRequired,
};

export default PasswordStrength;
