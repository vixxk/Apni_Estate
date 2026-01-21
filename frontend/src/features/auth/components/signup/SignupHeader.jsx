import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Home, AlertCircle, Star, Shield, User } from "lucide-react";

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

const pulseAnimation = {
    scale: [1, 1.05, 1],
    opacity: [1, 0.8, 1],
    transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut",
    },
};

const SignupHeader = () => {
    return (
        <motion.div variants={inputVariants} className="text-center mb-8">
            <Link to="/" className="inline-block mb-6">
                <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center justify-center space-x-2"
                >
                    <motion.div
                        animate={pulseAnimation}
                        className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center"
                    >
                        <Home className="w-6 h-6 text-white" />
                    </motion.div>
                    <h1 className="text-3xl font-bold text-blue-700">ApniEstate</h1>
                </motion.div>
            </Link>

            <div className="space-y-2">
                <h2 className="text-2xl font-bold text-gray-800">
                    Create Your Account
                </h2>
                <p className="text-gray-600">Join thousands of property enthusiasts</p>
                <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 flex items-center gap-2 bg-blue-50 border border-blue-200 
            text-blue-700 px-4 py-3 rounded-xl text-sm"
                >
                    <AlertCircle className="w-4 h-4 text-blue-600" />
                    <span>
                        You'll need to <strong>sign in after signing up</strong>
                    </span>
                </motion.div>

                {/* Stats */}
                <div className="flex items-center justify-center space-x-6 mt-4 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span>4.9 Rating</span>
                    </div>
                    <div className="flex items-center space-x-1">
                        <Shield className="w-4 h-4 text-green-500" />
                        <span>Secure</span>
                    </div>
                    <div className="flex items-center space-x-1">
                        <User className="w-4 h-4 text-blue-500" />
                        <span>50K+ Users</span>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default SignupHeader;
