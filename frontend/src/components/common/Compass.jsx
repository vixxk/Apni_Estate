import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Navigation } from "lucide-react";

const Compass = ({ isOpen, onClose }) => {
    const [heading, setHeading] = useState(0);
    const [permissionGranted, setPermissionGranted] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!isOpen) return;

        const handleOrientation = (event) => {
            let compassHeading = 0;

            if (event.webkitCompassHeading !== undefined && event.webkitCompassHeading !== null) {
                // iOS: webkitCompassHeading is clockwise from North (0=N, 90=E)
                compassHeading = event.webkitCompassHeading;
            } else if (event.alpha !== null) {
                // Android / Standard
                // Verify if the event provides absolute values
                // If absolute is false, it means it's relative to device start position (not useful for compass)
                // However, some older implementation might not set absolute=true but still be magnetic

                // For Android: 
                // alpha: 0=North, 90=West (Check this!) 
                // Actually on Android:
                // alpha = 0 when top points North
                // alpha increases as you rotate device counter-clockwise (left)
                // so alpha=90 means top points West? 
                // If I rotate left 90 deg, device is now pointing West. Alpha is 90.
                // So West is 90.
                // Clockwise Compass: N=0, E=90, S=180, W=270.
                // If Alpha=90 (West). Map to 270.
                // 360 - 90 = 270. Correct.
                // If Alpha=270 (rotate right 90 deg -> East). Map to 90.
                // 360 - 270 = 90. Correct.

                compassHeading = Math.abs(event.alpha - 360) % 360;
            }

            setHeading(compassHeading);
        };

        const requestPermission = async () => {
            if (
                typeof DeviceOrientationEvent !== "undefined" &&
                typeof DeviceOrientationEvent.requestPermission === "function"
            ) {
                try {
                    const permission = await DeviceOrientationEvent.requestPermission();
                    if (permission === "granted") {
                        setPermissionGranted(true);
                        window.addEventListener("deviceorientation", handleOrientation);
                    } else {
                        setError("Permission denied");
                    }
                } catch (e) {
                    console.error(e);
                    setError("Error requesting permission");
                }
            } else {
                // Non-iOS 13+ devices
                // Attempt to listen to 'deviceorientationabsolute' for Android (more accurate)
                if ('ondeviceorientationabsolute' in window) {
                    window.addEventListener("deviceorientationabsolute", (event) => {
                        // Absolute event usually provides alpha=0 at North
                        let compassHeading = 0;
                        if (event.alpha !== null) {
                            compassHeading = Math.abs(event.alpha - 360) % 360;
                        }
                        setHeading(compassHeading);
                    });
                }

                // Fallback or simultaneous listener (browser usually picks one)
                // We'll add standard listener too, just in case
                setPermissionGranted(true);
                window.addEventListener("deviceorientation", handleOrientation);
            }
        };

        requestPermission();

        return () => {
            window.removeEventListener("deviceorientation", handleOrientation);
            if ('ondeviceorientationabsolute' in window) {
                window.removeEventListener("deviceorientationabsolute", handleOrientation); // We need the named function to remove it
            }
        };
    }, [isOpen]);

    const getCardinalDirection = (angle) => {
        const directions = [
            "N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE",
            "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"
        ];
        // split into 16 chunks of 22.5 degrees
        const index = Math.round(angle / 22.5) % 16;
        return directions[index];
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[100] bg-gray-950 flex flex-col items-center justify-between py-12 px-4 text-white overflow-hidden"
                >
                    {/* Top Bar */}
                    <div className="w-full flex justify-between items-center relative z-10">
                        <div className="flex flex-col">
                            <span className="text-gray-400 text-xs font-medium tracking-widest uppercase">
                                Coordinates
                            </span>
                            <span className="text-sm font-mono text-gray-500">
                                --° --' --" N
                            </span>
                        </div>

                        <button
                            onClick={onClose}
                            className="p-3 rounded-full bg-gray-800/50 hover:bg-gray-700/50 backdrop-blur-md transition-colors"
                        >
                            <X className="w-6 h-6 text-gray-200" />
                        </button>
                    </div>

                    {/* Main Compass Area */}
                    <div className="relative flex-1 w-full flex items-center justify-center">

                        {/* Fixed Center Line Indicator (The "Red Line") */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-0.5 h-40 bg-transparent z-30">
                            <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-1 h-8 bg-red-500 rounded-full shadow-[0_0_15px_rgba(239,68,68,0.6)]" />
                        </div>

                        {/* Rotating Dial */}
                        <motion.div
                            className="relative w-[340px] h-[340px] md:w-[400px] md:h-[400px]"
                            animate={{ rotate: -heading }}
                            transition={{ type: "spring", stiffness: 45, damping: 25, mass: 0.8 }}
                        >
                            {/* Outer Ring Image/Vector */}
                            <div className="absolute inset-0 rounded-full border border-gray-800 bg-gray-900/40 shadow-2xl backdrop-blur-sm"></div>

                            {/* Angle Markers */}
                            {[...Array(120)].map((_, i) => {
                                const deg = i * 3;
                                const isMajor = deg % 30 === 0;
                                const isCardinal = deg % 90 === 0;

                                return (
                                    <div
                                        key={i}
                                        className={`absolute top-0 left-1/2 -translate-x-1/2 origin-bottom`}
                                        style={{
                                            height: '50%',
                                            transform: `rotate(${deg}deg)`,
                                            transformOrigin: 'bottom center'
                                        }}
                                    >
                                        <div
                                            className={`w-0.5 ${isCardinal ? "h-6 bg-red-500 w-1" :
                                                isMajor ? "h-4 bg-gray-300" : "h-2 bg-gray-600"
                                                }`}
                                        />
                                    </div>
                                );
                            })}

                            {/* Degrees Text */}
                            {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
                                <div
                                    key={deg}
                                    className="absolute top-8 left-1/2 -translate-x-1/2 text-xs font-mono font-medium text-gray-500"
                                    style={{
                                        transform: `rotate(${deg}deg) translateY(0px)`, // Just rotation to position around circle
                                        height: '100%',
                                        transformOrigin: 'center'
                                    }}
                                >
                                    {/* We want the text to be upright if possible, or rotated with dial? 
                        Most compass apps have text rotated.
                    */}
                                    <div style={{ transform: `translateY(-20px)` }}>{deg}</div>
                                </div>
                            ))}

                            {/* Cardinal Directions */}
                            {[
                                { deg: 0, label: "N", color: "text-red-500" },
                                { deg: 90, label: "E", color: "text-white" },
                                { deg: 180, label: "S", color: "text-white" },
                                { deg: 270, label: "W", color: "text-white" }
                            ].map((item) => (
                                <div
                                    key={item.label}
                                    className={`absolute inset-0 flex items-center justify-center`}
                                    style={{ transform: `rotate(${item.deg}deg)` }}
                                >
                                    <span
                                        className={`absolute -top-2 ${item.color} text-3xl font-bold tracking-widest`}
                                    >
                                        {item.label}
                                    </span>
                                </div>
                            ))}

                            {/* Secondary Directions */}
                            {["NE", "SE", "SW", "NW"].map((label, i) => (
                                <div
                                    key={label}
                                    className="absolute inset-0 flex items-center justify-center pointer-events-none"
                                    style={{ transform: `rotate(${45 + (i * 90)}deg)` }}
                                >
                                    <span className="absolute top-12 text-gray-500 text-sm font-semibold">{label}</span>
                                </div>
                            ))}

                        </motion.div>

                        {/* Center + Level Bubble (Visual Only) */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 border border-gray-700/30 rounded-full flex items-center justify-center pointer-events-none">
                            <div className="w-1 h-1 bg-white rounded-full opacity-50"></div>
                            <div className="absolute inset-0 border border-gray-800 rounded-full scale-50"></div>
                        </div>

                    </div>

                    {/* Bottom Info Panel */}
                    <div className="w-full flex flex-col items-center gap-2 mb-8 relative z-10">
                        <div className="text-6xl font-sans font-medium text-white tabular-nums tracking-tighter">
                            {Math.round(heading)}°
                        </div>
                        <div className="text-xl font-medium text-gray-400 tracking-widest">
                            {getCardinalDirection(heading)}
                        </div>

                        {!permissionGranted && (
                            <div className="mt-4 px-4 py-2 bg-gray-800 rounded-lg text-sm text-gray-300">
                                Tap to calibrate / Enable sensors
                            </div>
                        )}

                        {error && (
                            <span className="text-red-400 text-sm mt-2">{error}</span>
                        )}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default Compass;
