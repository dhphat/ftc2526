import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { agendaData } from './agendaData';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';
import { Clock } from 'lucide-react';

const AgendaView = () => {
    const { t, i18n } = useTranslation();
    const [selectedDay, setSelectedDay] = useState('2026-01-30');

    // Format date to locale string
    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString(i18n.language === 'en' ? 'en-US' : 'vi-VN', { weekday: 'long', month: 'short', day: 'numeric' });
    };

    const days = [...new Set(agendaData.map(item => item.day))];
    const filteredEvents = agendaData.filter(item => item.day === selectedDay);

    // Helper to determine color by type
    const getTypeColor = (type) => {
        const map = {
            practice: 'border-l-4 border-green-500 bg-green-50',
            admin: 'border-l-4 border-gray-500 bg-gray-50',
            tech: 'border-l-4 border-blue-500 bg-blue-50',
            meeting: 'border-l-4 border-yellow-500 bg-yellow-50',
            judging: 'border-l-4 border-purple-500 bg-purple-50',
            match: 'border-l-4 border-red-500 bg-red-50',
            ceremony: 'border-l-4 border-orange-500 bg-orange-100',
            major: 'border-l-4 border-ftc-green bg-ftc-green/20'
        };
        return map[type] || 'border-l-4 border-gray-300 bg-white';
    };

    return (
        <div className="flex flex-col h-full glass-panel rounded-xl overflow-hidden border border-ftc-green/20">
            {/* Day Tabs */}
            <div className="flex border-b border-ftc-green/20 bg-black/40 backdrop-blur-sm">
                {days.map(day => (
                    <button
                        key={day}
                        onClick={() => setSelectedDay(day)}
                        className={clsx(
                            "flex-1 py-4 px-2 font-bold uppercase transition-all min-w-[120px] font-mono tracking-wider relative overflow-hidden",
                            selectedDay === day
                                ? "text-ftc-green bg-ftc-green/10"
                                : "text-gray-500 hover:text-white hover:bg-white/5"
                        )}
                    >
                        {selectedDay === day && (
                            <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 w-full h-[2px] bg-ftc-green box-glow" />
                        )}
                        {formatDate(day)}
                    </button>
                ))}
            </div>

            {/* Timeline Content */}
            <div className="flex-1 overflow-y-auto p-4 relative bg-black/20">
                <ul className="space-y-4 relative">
                    {/* Vertical Time Line */}
                    <div className="absolute left-4 md:left-[8.5rem] top-0 bottom-0 w-[1px] bg-ftc-green/20 hidden md:block"></div>

                    <AnimatePresence mode="popLayout">
                        {filteredEvents.map((event, index) => (
                            <motion.li
                                key={event.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ delay: index * 0.05 }}
                                className={clsx(
                                    "p-4 rounded border-l-2 flex flex-col md:flex-row gap-4 relative group hover:bg-white/5 transition-colors",
                                    getTypeColor(event.type).replace('border-l-4', 'border-l-2').replace(/bg-.*-50/, 'bg-transparent') // Clean up old styles
                                )}
                            >
                                {/* Decorative dot on timeline */}
                                <div className="hidden md:block absolute left-[8.5rem] top-1/2 -mt-1 -ml-[5px] w-[9px] h-[9px] rounded-full bg-ftc-dark border border-ftc-green box-glow z-10 group-hover:scale-150 transition-transform"></div>

                                <div className="flex items-center gap-3 md:w-32 shrink-0 font-mono text-sm md:text-base text-ftc-green/80 group-hover:text-ftc-green transition-colors">
                                    <Clock size={14} />
                                    <span>{event.start}</span>
                                </div>

                                <div className="flex-1 pl-4 border-l border-white/10 md:border-none">
                                    <h3 className="font-bold text-lg leading-tight uppercase tracking-wide text-white group-hover:text-glow transition-all">
                                        {i18n.language === 'en' ? event.title : event.titleVi}
                                    </h3>
                                    <div className="text-xs text-gray-400 mt-1 font-mono uppercase tracking-widest opacity-60">
                         // {event.type}
                                    </div>
                                </div>

                                <div className="text-xs font-mono text-gray-500 flex items-center self-start md:self-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    {event.end} END
                                </div>
                            </motion.li>
                        ))}
                    </AnimatePresence>
                </ul>

                {filteredEvents.length === 0 && (
                    <div className="text-center py-20 opacity-50 font-bold font-mono text-xl animate-pulse">NO_DATA_STREAM</div>
                )}
            </div>

            {/* Current Time Indicator (Visual Polish) */}
            <div className="bg-black/80 backdrop-blur text-ftc-green border-t border-ftc-green/20 p-2 text-center text-xs font-mono tracking-[0.2em]">
                SYSTEM_TIME: {new Date().toLocaleTimeString()} // STATUS: ONLINE
            </div>
        </div>
    );
};

export default AgendaView;
