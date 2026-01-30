import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import clsx from 'clsx';

const GameButton = ({ to, onClick, children, className, color = 'white', icon: Icon, delay = 0 }) => {
    const Component = to ? Link : motion.button;
    const [isHovered, setIsHovered] = useState(false);

    const variants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { delay, type: 'spring', damping: 15 } }
    };

    const getColors = () => {
        switch (color) {
            case 'purple': return 'bg-white hover:bg-[#a855f7]';
            case 'orange': return 'bg-white hover:bg-[#f97316]';
            case 'blue': return 'bg-white hover:bg-[#3b82f6]';
            default: return 'bg-white hover:bg-black hover:text-white';
        }
    };

    return (
        <Component
            to={to}
            onClick={onClick}
            initial="hidden"
            animate="visible"
            variants={variants}
            whileTap={{ x: 2, y: 2, boxShadow: "0px 0px 0px 0px black" }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className={clsx(
                "relative group flex flex-col items-center justify-center p-8",
                "border-4 border-black transition-all duration-200",
                "shadow-[6px_6px_0px_0px_black] hover:shadow-[2px_2px_0px_0px_black] hover:translate-x-[4px] hover:translate-y-[4px]",
                getColors(),
                className
            )}
        >
            {/* Corner Notch Overlay */}
            <div className="absolute top-0 left-0 w-4 h-4 border-t-4 border-l-4 border-black -m-[4px]"></div>
            <div className="absolute bottom-0 right-0 w-4 h-4 border-b-4 border-r-4 border-black -m-[4px]"></div>

            {/* Icon */}
            <motion.div
                animate={isHovered ? { scale: 1.1 } : { scale: 1 }}
            >
                {Icon && <Icon size={48} className="mb-4 stroke-[2]" />}
            </motion.div>

            <span className="text-xl md:text-2xl text-center z-10 font-black tracking-tighter uppercase font-mono">
                {children}
            </span>
        </Component>
    );
};

export default GameButton;
