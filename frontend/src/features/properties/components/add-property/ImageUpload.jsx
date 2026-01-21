import React from "react";
import { Image as ImageIcon, Upload, AlertCircle, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const ImageUpload = ({
    images,
    fieldErrors,
    fileInputRef,
    handleImageSelect,
    imagePreviews,
    removeImage,
}) => {
    return (
        <div>
            <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center">
                    <ImageIcon className="text-rose-600" size={16} />
                </div>
                <h2 className="text-lg md:text-xl font-bold text-gray-800">
                    Upload Images *
                </h2>
            </div>

            <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-indigo-300 rounded-lg md:rounded-xl p-4 md:p-6 text-center bg-indigo-50/50 hover:bg-indigo-100 transition-all cursor-pointer"
            >
                <Upload className="mx-auto mb-2 text-indigo-600" size={24} />
                <p className="text-indigo-600 font-bold text-sm md:text-base hover:text-indigo-700 mb-1">
                    Click to upload
                </p>
                <p className="text-gray-600 text-xs mt-1">Max 5 images, 10MB each</p>
                <p className="text-gray-500 text-xs mt-1">
                    {images.length}/5 selected
                </p>
                <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageSelect}
                    className="hidden"
                />
            </div>

            {fieldErrors.images && (
                <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
                    <AlertCircle size={12} />
                    {fieldErrors.images}
                </p>
            )}

            {imagePreviews.length > 0 && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-4 grid grid-cols-3 md:grid-cols-5 gap-2 md:gap-3"
                >
                    <AnimatePresence>
                        {imagePreviews.map((preview, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                exit={{ scale: 0 }}
                                className="relative group"
                            >
                                <img
                                    src={preview}
                                    alt={`Preview ${idx + 1}`}
                                    className="w-full h-24 md:h-28 object-cover rounded-lg shadow-md"
                                />
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        removeImage(idx);
                                    }}
                                    className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-md opacity-0 group-hover:opacity-100 transition-all hover:bg-red-600 shadow-lg"
                                >
                                    <X size={14} />
                                </button>
                                {idx === 0 && (
                                    <span className="absolute bottom-1 left-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-[10px] px-2 py-0.5 rounded-full font-semibold shadow-md">
                                        Primary
                                    </span>
                                )}
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>
            )}
        </div>
    );
};

export default ImageUpload;
