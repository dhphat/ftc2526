import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import clsx from 'clsx';

const GameButton = ({ to, onClick, children, className, color = 'white', icon: Icon, delay = 0 }) => {
    const Component = to ? Link : motion.button;
    const [isHovered, setIsHovered] = useState(false);

    const variants = {
        hidden: { opacity: 0, scale: 0.8 },
        visible: { opacity: 1, scale: 1, transition: { delay, type: 'spring' } }
    };

    const getColors = () => {
        switch (color) {
            case 'purple': return 'border-ftc-purple shadow-[0_0_15px_rgba(168,85,247,0.4)] hover:shadow-[0_0_25px_rgba(168,85,247,0.6)] text-white';
            case 'orange': return 'border-ftc-orange shadow-[0_0_15px_rgba(249,115,22,0.4)] hover:shadow-[0_0_25px_rgba(249,115,22,0.6)] text-white';
            case 'blue': return 'border-ftc-blue shadow-[0_0_15px_rgba(59,130,246,0.4)] hover:shadow-[0_0_25px_rgba(59,130,246,0.6)] text-white';
            default: return 'border-white shadow-[0_0_15px_rgba(255,255,255,0.4)] hover:shadow-[0_0_25px_rgba(255,255,255,0.6)] text-white';
        }
    };

    return (
        <Component
            to={to}
            onClick={onClick}
            initial="hidden"
            animate="visible"
            variants={variants}
            whileTap={{ scale: 0.95 }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className={clsx(
                "relative group flex flex-col items-center justify-center p-8",
                "bg-ftc-dark/80 backdrop-blur-sm border-2 transition-all duration-300",
                getColors(),
                "overflow-hidden clip-path-notch", // You might need to define clip-path-notch in CSS
                className
            )}
            style={{
                clipPath: "polygon(10% 0, 100% 0, 100% 90%, 90% 100%, 0 100%, 0 10%)"
            }}
        >
            {/* Background Glitch Layer */}
            <div className={clsx("absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity bg-white/10")} />

            {/* Animated Corners */}
            <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-current opacity-50 group-hover:w-full group-hover:h-full transition-all duration-500"></div>
            <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-current opacity-50 group-hover:w-full group-hover:h-full transition-all duration-500"></div>

            {/* Icon with float animation */}
            <motion.div
                animate={isHovered ? { y: -5, textShadow: "0 0 8px currentColor" } : { y: 0 }}
            >
                {Icon && <Icon size={48} className="mb-4 stroke-[1.5]" />}
            </motion.div>

            <span className="text-xl md:text-2xl text-center z-10 font-bold tracking-widest uppercase font-sans">
                {children}
            </span>

            {/* Scanline overlay for button only */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent bg-[length:100%_4px] bg-repeat-y opacity-0 group-hover:opacity-30 pointer-events-none animate-pulse"></div>
        </Component>
    );
};

export default GameButton;
