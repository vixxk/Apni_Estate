import React from "react";
import { motion } from "framer-motion";

const Pagination = ({ currentPage, totalPages, setCurrentPage }) => {
    if (totalPages <= 1) return null;

    return (
        <div className="mt-6 flex items-center justify-center gap-2">
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 text-sm bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/20 transition-all"
            >
                Prev
            </motion.button>

            <div className="flex gap-2">
                {totalPages <= 5 ? (
                    [...Array(totalPages)].map((_, i) => (
                        <motion.button
                            key={i}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setCurrentPage(i + 1)}
                            className={`w-10 h-10 text-sm rounded-xl font-semibold transition-all ${currentPage === i + 1
                                ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/50"
                                : "bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20"
                                }`}
                        >
                            {i + 1}
                        </motion.button>
                    ))
                ) : (
                    <>
                        {currentPage > 2 && (
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setCurrentPage(1)}
                                className="w-10 h-10 text-sm bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-xl font-semibold hover:bg-white/20"
                            >
                                1
                            </motion.button>
                        )}
                        {currentPage > 3 && (
                            <span className="flex items-center px-2 text-white/70 text-sm">
                                ...
                            </span>
                        )}
                        {[...Array(3)].map((_, i) => {
                            const pageNum = currentPage - 1 + i;
                            if (pageNum < 1 || pageNum > totalPages) return null;
                            return (
                                <motion.button
                                    key={pageNum}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setCurrentPage(pageNum)}
                                    className={`w-10 h-10 text-sm rounded-xl font-semibold transition-all ${currentPage === pageNum
                                        ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/50"
                                        : "bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20"
                                        }`}
                                >
                                    {pageNum}
                                </motion.button>
                            );
                        })}
                        {currentPage < totalPages - 2 && (
                            <span className="flex items-center px-2 text-white/70 text-sm">
                                ...
                            </span>
                        )}
                        {currentPage < totalPages - 1 && (
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setCurrentPage(totalPages)}
                                className="w-10 h-10 text-sm bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-xl font-semibold hover:bg-white/20"
                            >
                                {totalPages}
                            </motion.button>
                        )}
                    </>
                )}
            </div>

            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 text-sm bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/20 transition-all"
            >
                Next
            </motion.button>
        </div>
    );
};

export default Pagination;
