import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Home as HomeIcon,
    Share2,
    Check,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";

const ImageGallery = ({
    images,
    activeImage,
    setActiveImage,
    property,
    handleShare,
    copySuccess,
}) => {
    const hasImages = Array.isArray(images) && images.length > 0;

    return (
        <div className="relative h-[200px] sm:h-[280px] md:h-[400px] lg:h-[500px] bg-gray-900">
            <AnimatePresence mode="wait">
                {hasImages ? (
                    <motion.a
                        key={activeImage}
                        href={images[activeImage]}
                        target="_blank"
                        rel="noopener noreferrer"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="block w-full h-full"
                    >
                        <img
                            src={images[activeImage]}
                            alt={`${property.title} - View ${activeImage + 1}`}
                            className="w-full h-full object-cover"
                        />
                    </motion.a>
                ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 bg-gray-800">
                        <HomeIcon className="w-10 h-10 md:w-20 md:h-20 mb-2 md:mb-4 opacity-30" />
                        <p className="text-xs md:text-lg font-medium">
                            No images available
                        </p>
                    </div>
                )}
            </AnimatePresence>

            {/* Gradient overlay */}
            {hasImages && (
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none"></div>
            )}

            {/* Share Button - Top Right */}
            <button
                onClick={handleShare}
                className="absolute top-2 md:top-4 right-2 md:right-4 p-2 md:p-2.5 rounded-full bg-white/90 hover:bg-white shadow-lg transition-all z-10"
            >
                {copySuccess ? (
                    <Check className="w-4 h-4 md:w-5 md:h-5 text-green-600" />
                ) : (
                    <Share2 className="w-4 h-4 md:w-5 md:h-5 text-gray-800" />
                )}
            </button>

            {/* Navigation Controls */}
            {hasImages && images.length > 1 && (
                <>
                    <button
                        onClick={() =>
                            setActiveImage((prev) => (prev === 0 ? images.length - 1 : prev - 1))
                        }
                        className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 p-1.5 md:p-2.5 rounded-full bg-white/90 hover:bg-white shadow-lg transition-colors z-10"
                    >
                        <ChevronLeft className="w-4 h-4 md:w-6 md:h-6 text-gray-800" />
                    </button>
                    <button
                        onClick={() =>
                            setActiveImage((prev) => (prev === images.length - 1 ? 0 : prev + 1))
                        }
                        className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 p-1.5 md:p-2.5 rounded-full bg-white/90 hover:bg-white shadow-lg transition-colors z-10"
                    >
                        <ChevronRight className="w-4 h-4 md:w-6 md:h-6 text-gray-800" />
                    </button>
                </>
            )}

            {/* Image Counter */}
            {hasImages && (
                <div className="absolute bottom-2 md:bottom-4 left-1/2 -translate-x-1/2 bg-black/75 text-white px-2.5 py-1 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-semibold z-10 border border-white/20">
                    {activeImage + 1} / {images.length}
                </div>
            )}
        </div>
    );
};

export default ImageGallery;
