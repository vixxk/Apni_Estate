import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    MessageCircle,
    X,
    Home as HomeIcon,
    MapPin,
    Check,
} from "lucide-react";

const MessageModal = ({
    isOpen,
    onClose,
    property,
    customMessage,
    setCustomMessage,
    submitContactRequest,
    contactLoading,
}) => {
    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-3"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    onClick={(e) => e.stopPropagation()}
                    className="bg-white rounded-xl md:rounded-2xl shadow-2xl w-[90%] md:w-full max-w-lg overflow-hidden max-h-[85vh] overflow-y-auto"
                >
                    {/* Modal Header */}
                    <div className="bg-gradient-to-r from-emerald-600 to-green-600 p-3 md:p-5 sticky top-0 z-10">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 md:gap-3">
                                <div className="w-9 h-9 md:w-12 md:h-12 bg-white/20 rounded-lg flex items-center justify-center">
                                    <MessageCircle className="w-4 h-4 md:w-6 md:h-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-base md:text-xl font-bold text-white">
                                        Contact Vendor
                                    </h3>
                                    <p className="text-[10px] md:text-sm text-white/80">
                                        Send your message to the property owner
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-1.5 md:p-2 hover:bg-white/20 rounded-lg transition-colors"
                            >
                                <X className="w-4 h-4 md:w-5 md:h-5 text-white" />
                            </button>
                        </div>
                    </div>

                    {/* Modal Body */}
                    <div className="p-3 md:p-5">
                        {/* Property Info */}
                        <div className="bg-gray-50 rounded-lg p-2.5 md:p-4 mb-3 md:mb-4 border border-gray-200">
                            <div className="flex items-start gap-2 md:gap-3">
                                <div className="w-9 h-9 md:w-12 md:h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <HomeIcon className="w-4 h-4 md:w-6 md:h-6 text-white" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="text-xs md:text-base font-bold text-gray-900 mb-1 truncate">
                                        {property.title}
                                    </h4>
                                    <div className="flex items-center gap-1.5 md:gap-2 text-gray-600 text-[10px] md:text-sm">
                                        <MapPin className="w-3 h-3 flex-shrink-0" />
                                        <span className="truncate">{property.location}</span>
                                    </div>
                                    <p className="text-blue-600 font-semibold text-xs md:text-base mt-1">
                                        ₹{Number(property.price).toLocaleString("en-IN")}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Message Input */}
                        <div className="mb-3 md:mb-4">
                            <label className="block text-xs md:text-sm font-semibold text-gray-900 mb-1.5 md:mb-2">
                                Your Message
                            </label>
                            <textarea
                                value={customMessage}
                                onChange={(e) => setCustomMessage(e.target.value)}
                                placeholder="Write your message to the vendor..."
                                maxLength={500}
                                rows={4}
                                className="w-full px-3 py-2 md:px-4 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-xs md:text-base resize-none"
                            />
                            <div className="flex items-center justify-between mt-1.5">
                                <p className="text-[10px] md:text-xs text-gray-500">
                                    Maximum 500 characters
                                </p>
                                <p className="text-[10px] md:text-xs font-semibold text-gray-700">
                                    {customMessage.length}/500
                                </p>
                            </div>
                        </div>

                        {/* Quick Templates */}
                        <div className="mb-3 md:mb-4">
                            <p className="text-[10px] md:text-xs font-semibold text-gray-700 mb-1.5">
                                Quick Templates:
                            </p>
                            <div className="flex flex-wrap gap-1.5">
                                {[
                                    "I am interested in this property. Please contact me.",
                                    "I would like to schedule a viewing. When is convenient?",
                                    "Is this property still available? I'm very interested.",
                                    "Can you provide more details about this property?",
                                ].map((template, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setCustomMessage(template)}
                                        className="px-2.5 py-1.5 text-[10px] md:text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-colors"
                                    >
                                        {template.length > 35
                                            ? template.substring(0, 32) + "..."
                                            : template}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2 md:gap-3">
                            <button
                                onClick={onClose}
                                disabled={contactLoading}
                                className="flex-1 px-3 py-2 md:px-4 md:py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-semibold text-xs md:text-base transition-colors disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={submitContactRequest}
                                disabled={contactLoading || !customMessage.trim()}
                                className="flex-1 px-3 py-2 md:px-4 md:py-3 bg-gradient-to-r from-emerald-600 to-green-600 hover:shadow-lg text-white rounded-lg font-semibold text-xs md:text-base transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {contactLoading ? (
                                    <>
                                        <motion.div
                                            animate={{ rotate: 360 }}
                                            transition={{
                                                duration: 1,
                                                repeat: Infinity,
                                                ease: "linear",
                                            }}
                                            className="w-3.5 h-3.5 md:w-4 md:h-4 border-2 border-white border-t-transparent rounded-full"
                                        />
                                        <span>Sending...</span>
                                    </>
                                ) : (
                                    <>
                                        <Check className="w-3.5 h-3.5 md:w-4 md:h-4" />
                                        <span>Send Message</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default MessageModal;
