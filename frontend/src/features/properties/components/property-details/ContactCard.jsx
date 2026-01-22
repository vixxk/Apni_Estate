import React from "react";
import { Calendar, Phone, MessageCircle } from "lucide-react";

const ContactCard = ({
    hasContactInfo,
    setShowSchedule,
    handleRequestCall,
    handleChatClick,
}) => {
    return (
        <div className="lg:col-span-1 space-y-3">
            {/* Action Buttons */}
            <div className="grid grid-cols-1 gap-2 lg:grid-cols-1 lg:gap-3">
                {/* Schedule Viewing Button */}
                <button
                    onClick={() => setShowSchedule(true)}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2.5 md:py-3 rounded-lg md:rounded-xl hover:shadow-lg transition-shadow flex items-center justify-center gap-1.5 text-sm md:text-base font-semibold"
                >
                    <Calendar className="w-4 h-4 md:w-5 md:h-5" />
                    <span>Schedule</span>
                </button>
            </div>

            {/* Contact Card */}
            {hasContactInfo && (
                <div className="glass-card rounded-lg md:rounded-xl p-3 md:p-4">
                    <h2 className="text-sm md:text-base font-bold mb-2 flex items-center gap-2">
                        <div className="p-1.5 bg-blue-600 rounded-md">
                            <Phone className="w-3 h-3 md:w-4 md:h-4 text-white" />
                        </div>
                        Contact Details
                    </h2>
                    <div className="space-y-2">
                        {/* Request Call Button */}
                        <button
                            onClick={handleRequestCall}
                            className="w-full flex items-center gap-2 p-2.5 bg-white rounded-lg hover:shadow-md transition-shadow"
                        >
                            <div className="p-1.5 bg-blue-100 rounded-md">
                                <Phone className="w-3 h-3 md:w-4 md:h-4 text-blue-600" />
                            </div>
                            <div className="text-left">
                                <p className="text-[9px] md:text-xs text-gray-500 font-medium">
                                    Contact
                                </p>
                                <p className="text-xs md:text-sm text-gray-900 font-semibold">
                                    Request a Call
                                </p>
                            </div>
                        </button>

                        {/* Chat Button */}
                        <button
                            onClick={handleChatClick}
                            className="w-full flex items-center gap-2 p-2.5 bg-white rounded-lg hover:shadow-md transition-shadow"
                        >
                            <div className="p-1.5 bg-emerald-100 rounded-md">
                                <MessageCircle className="w-3 h-3 md:w-4 md:h-4 text-emerald-600" />
                            </div>
                            <div className="text-left">
                                <p className="text-[9px] md:text-xs text-gray-500 font-medium">
                                    Message
                                </p>
                                <p className="text-xs md:text-sm text-gray-900 font-semibold">
                                    Start Chat
                                </p>
                            </div>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ContactCard;
