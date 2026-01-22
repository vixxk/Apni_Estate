import React from "react";
import { Tag, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const TagInput = ({ form, removeTag, handleAddTag }) => {
    return (
        <div>
            <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center">
                    <Tag className="text-yellow-600" size={16} />
                </div>
                <h2 className="text-lg md:text-xl font-bold text-gray-800">
                    Tags (Optional)
                </h2>
            </div>

            <div className="flex flex-wrap gap-2 mb-3">
                <AnimatePresence>
                    {form.tags.map((tag, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                            className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-3 py-1.5 rounded-full flex items-center gap-2 shadow-sm"
                        >
                            <span className="text-xs font-medium">{tag}</span>
                            <button
                                type="button"
                                onClick={() => removeTag(idx)}
                                className="hover:bg-white/20 rounded-full p-0.5 transition-colors"
                            >
                                <X size={12} />
                            </button>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            <input
                type="text"
                placeholder="Type a tag and press Enter (max 10)"
                onKeyPress={handleAddTag}
                disabled={form.tags.length >= 10}
                className="w-full px-3 py-2.5 text-sm border-2 border-gray-200 rounded-lg md:rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
            <p className="text-gray-500 text-xs mt-1">
                Examples: luxury, near metro, etc.
            </p>
        </div>
    );
};

export default TagInput;
