import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, AlertCircle, Eye, EyeOff } from "lucide-react";
import PropTypes from "prop-types";

const inputVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
        opacity: 1,
        x: 0,
        transition: {
            duration: 0.5,
            ease: "easeOut",
        },
    },
};

const InputField = ({
    id,
    type = "text",
    label,
    icon: Icon,
    value,
    onChange,
    onFocus,
    onBlur,
    error,
    isFocused,
    placeholder,
    required = true,
    rightElement,
}) => {
    return (
        <motion.div variants={inputVariants}>
            <label
                htmlFor={id}
                className="block text-sm font-medium text-gray-700 mb-2"
            >
                {label}
            </label>
            <div className="relative group">
                <div
                    className={`absolute left-3 top-1/2 -translate-y-1/2 transition-colors duration-200 ${isFocused ? "text-blue-500" : "text-gray-400"
                        }`}
                >
                    {Icon && <Icon className="h-5 w-5" />}
                </div>
                <input
                    type={type}
                    name={id}
                    id={id}
                    required={required}
                    value={value}
                    onChange={onChange}
                    onFocus={() => onFocus(id)}
                    onBlur={() => onBlur(id)}
                    className={`w-full pl-10 ${rightElement ? "pr-12" : "pr-4"
                        } py-3 rounded-xl bg-gray-50/50 border-2 transition-all duration-200 placeholder-gray-400 ${error
                            ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
                            : isFocused
                                ? "border-blue-500 focus:border-blue-500 focus:ring-blue-500/20"
                                : "border-gray-200 hover:border-gray-300 focus:border-blue-500 focus:ring-blue-500/20"
                        } focus:ring-4 focus:outline-none`}
                    placeholder={placeholder}
                />

                {rightElement ? (
                    rightElement
                ) : (
                    <>
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="absolute right-3 top-1/2 -translate-y-1/2"
                            >
                                <AlertCircle className="h-5 w-5 text-red-500" />
                            </motion.div>
                        )}
                        {value && !error && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="absolute right-3 top-1/2 -translate-y-1/2"
                            >
                                <CheckCircle className="h-5 w-5 text-green-500" />
                            </motion.div>
                        )}
                    </>
                )}
            </div>
            <AnimatePresence>
                {error && (
                    <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="mt-1 text-sm text-red-600"
                    >
                        {error}
                    </motion.p>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

InputField.propTypes = {
    id: PropTypes.string.isRequired,
    type: PropTypes.string,
    label: PropTypes.string.isRequired,
    icon: PropTypes.elementType,
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    onFocus: PropTypes.func.isRequired,
    onBlur: PropTypes.func.isRequired,
    error: PropTypes.string,
    isFocused: PropTypes.bool,
    placeholder: PropTypes.string,
    required: PropTypes.bool,
    rightElement: PropTypes.node,
};

export default InputField;
