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
            let { alpha } = event;
            // standard implementation usually gives alpha as 0-360 degrees
            // Android: alpha is compass heading (0 = North)
            // iOS: alpha is consistent but needs webkitCompassHeading for true North if available

            if (event.webkitCompassHeading) {
                // iOS
                alpha = event.webkitCompassHeading;
            } else {
                // Non-iOS (Android)
                // alpha increases counter-clockwise on Android usually?
                // standard: alpha is 0 when device top points North?
                // Actually, on Android alpha is 0 when pointing North.
                // We typically want 360 - alpha for rotation if we rotate the dial.
                // If we rotate the needle, it's just alpha?
                // Let's assume standard behavior:
                // alpha: 0=North, 90=East, 180=South, 270=West (if z-axis is up)
                // Adjust for device specific quirks if needed, but start standard.
                // Commonly on Android: 360 - alpha.
                alpha = Math.abs(alpha - 360);
            }

            setHeading(alpha);
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
                setPermissionGranted(true);
                window.addEventListener("deviceorientation", handleOrientation);
            }
        };

        requestPermission();

        return () => {
            window.removeEventListener("deviceorientation", handleOrientation);
        };
    }, [isOpen]);

    const getCardinalDirection = (angle) => {
        const directions = [
            "N",
            "NE",
            "E",
            "SE",
            "S",
            "SW",
            "W",
            "NW",
        ];
        // split into 8 chunks of 45 degrees
        // 0 is N. 360 is N.
        // 0 +/- 22.5 is N.
        // index = round(angle / 45) % 8
        const index = Math.round(angle / 45) % 8;
        return directions[index];
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[100] bg-gray-900/95 backdrop-blur-xl flex flex-col items-center justify-center text-white"
                >
                    <button
                        onClick={onClose}
                        className="absolute top-6 right-6 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                    >
                        <X className="w-8 h-8" />
                    </button>

                    <div className="flex flex-col items-center gap-8">
                        <h2 className="text-2xl font-bold tracking-wider uppercase text-blue-400">
                            Compass
                        </h2>

                        {/* Compass Circle */}
                        <div className="relative w-72 h-72 rounded-full border-4 border-gray-700 bg-gray-800 shadow-[0_0_50px_rgba(0,0,0,0.5)] flex items-center justify-center">
                            {/* Dial Marks */}
                            {[0, 90, 180, 270].map((deg) => (
                                <div
                                    key={deg}
                                    className="absolute w-full h-full flex justify-center p-2"
                                    style={{ transform: `rotate(${deg}deg)` }}
                                >
                                    <span className="text-sm font-bold text-gray-400">
                                        {deg === 0
                                            ? "N"
                                            : deg === 90
                                                ? "E"
                                                : deg === 180
                                                    ? "S"
                                                    : "W"}
                                    </span>
                                </div>
                            ))}

                            {/* Minor Ticks */}
                            {[...Array(72)].map((_, i) => (
                                <div
                                    key={i}
                                    className={`absolute top-0 left-1/2 -translate-x-1/2 origin-bottom w-0.5 ${i % 9 === 0 ? "h-4 bg-gray-400" : "h-2 bg-gray-600"}`}
                                    style={{
                                        height: '50%',
                                        transform: `rotate(${i * 5}deg)`,
                                        transformOrigin: 'bottom center'
                                    }}
                                >
                                    {/* We only want the tick at the edge, so we can wrap this or just use a pseudo element approach. 
                       Easier: Just an absolute div at the correct position. 
                       Let's redo the tick marks logic to be simpler visual.
                   */}
                                </div>
                            ))}

                            {/* Rotating Dial Container */}
                            <motion.div
                                className="absolute inset-4 rounded-full border-2 border-gray-600/50"
                                animate={{ rotate: -heading }}
                                transition={{ type: "spring", stiffness: 50, damping: 20 }}
                            >
                                {/* North Indicator on the dial */}
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1 w-2 h-6 bg-red-500 rounded-full shadow-[0_0_10px_red]" />

                                {/* Decorative Crosshairs */}
                                <div className="absolute inset-0 flex items-center justify-center opacity-20">
                                    <div className="w-full h-px bg-white" />
                                    <div className="h-full w-px bg-white absolute" />
                                </div>

                                {/* Cardinal Letters that rotate with the dial */}
                                {[
                                    { deg: 0, label: "N", color: "text-red-500" },
                                    { deg: 90, label: "E", color: "text-white" },
                                    { deg: 180, label: "S", color: "text-white" },
                                    { deg: 270, label: "W", color: "text-white" }
                                ].map((item) => (
                                    <div
                                        key={item.label}
                                        className={`absolute top-2 left-1/2 -translate-x-1/2 origin-[50%_136px] ${item.color} font-bold text-xl`}
                                        style={{
                                            transform: `translateX(-50%) rotate(${item.deg}deg) translateY(10px)`,
                                            transformOrigin: 'center 120px' // Approximate center
                                        }}
                                    >
                                        {/* Positioning letters is tricky with rotation. 
                             Better approach: Rotate the whole container opposite to heading.
                             Then N is always at the top of the container physically, but the container rotates.
                             So if Heading is 90 (East), container rotates -90. N is now at the left which is correct (East is up? No wait).
                             
                             If I face East (90 deg):
                             Dial should rotate such that 'E' is at the top.
                             So 90 deg mark should be at top.
                             If 0 is at top normally, 
                             Rotate -90 puts 90 at top? No. anti-clockwise 90 puts 90 at top.
                             So rotate: -heading.
                             If heading is 90. Rotate -90.
                             0 (N) moves to -90 (Left).
                             90 (E) moves to 0 (Top).
                             Correct.
                         */}
                                        <span
                                            className="absolute font-bold text-lg"
                                            style={{
                                                top: '5px',
                                                left: '50%',
                                                transform: `translateX(-50%) rotate(${item.deg}deg) translateY(0px) rotate(${-item.deg}deg)`, // Keep text upright? No, let it rotate with dial
                                                // Actually, simpler:
                                            }}
                                        >
                                            {/* We'll just place them absolutely on the dial */}
                                        </span>
                                    </div>
                                ))}

                                <div className="absolute inset-0">
                                    <span className="absolute top-2 left-1/2 -translate-x-1/2 text-red-500 font-bold text-xl">N</span>
                                    <span className="absolute bottom-2 left-1/2 -translate-x-1/2 text-white font-bold text-xl">S</span>
                                    <span className="absolute left-2 top-1/2 -translate-y-1/2 text-white font-bold text-xl">W</span>
                                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-white font-bold text-xl">E</span>
                                </div>

                            </motion.div>

                            {/* Fixed Needle/Indicator (Pointing Up) */}
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-4 w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-b-[20px] border-b-yellow-400 z-10 drop-shadow-lg" />

                            {/* Center Dot */}
                            <div className="absolute w-2 h-2 bg-yellow-400 rounded-full z-20" />
                        </div>

                        {/* Readout */}
                        <div className="text-center space-y-1">
                            <div className="text-5xl font-mono font-bold text-white">
                                {Math.round(heading)}°
                            </div>
                            <div className="text-2xl font-bold text-blue-400">
                                {getCardinalDirection(heading)}
                            </div>
                        </div>

                        {!permissionGranted && (
                            <div className="px-6 text-center text-sm text-gray-400">
                                <p>Rotate your device to calibrate.</p>
                                {error && <p className="text-red-400 mt-2">{error}</p>}
                            </div>
                        )}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default Compass;
