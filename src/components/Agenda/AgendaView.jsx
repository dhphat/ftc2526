import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { agendaData } from './agendaData';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';
import { Clock } from 'lucide-react';

const AgendaView = () => {
    const { t, i18n } = useTranslation();
    const [selectedDay, setSelectedDay] = useState('2026-01-30');
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 60000); // Update every minute

        // Set initial selected day to current date if it exists in agendaData
        const today = new Date().toISOString().split('T')[0];
        if (agendaData.some(item => item.day === today)) {
            setSelectedDay(today);
        }

        return () => clearInterval(timer);
    }, []);

    // Format date to locale string
    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString(i18n.language === 'en' ? 'en-US' : 'vi-VN', { weekday: 'long', month: 'short', day: 'numeric' });
    };

    const days = [...new Set(agendaData.map(item => item.day))];
    const filteredEvents = agendaData.filter(item => item.day === selectedDay);

    // Helper to check if an event is currently happening
    const isCurrentEvent = (event) => {
        const now = currentTime;
        const [todayY, todayM, todayD] = now.toISOString().split('T')[0].split('-');
        const [eventY, eventM, eventD] = event.day.split('-');

        if (todayY !== eventY || todayM !== eventM || todayD !== eventD) return false;

        const [startH, startM] = event.start.split(':').map(Number);
        const [endH, endM] = event.end.split(':').map(Number);

        const startTime = new Date(now);
        startTime.setHours(startH, startM, 0);

        const endTime = new Date(now);
        endTime.setHours(endH, endM, 0);

        return now >= startTime && now < endTime;
    };

    // Helper to determine color by type
    const getTypeColor = (type, isCurrent) => {
        if (isCurrent) return 'border-l-[12px] border-black bg-black text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)]';

        const map = {
            practice: 'border-l-8 border-[#22c55e] bg-white',
            admin: 'border-l-8 border-[#64748b] bg-white',
            tech: 'border-l-8 border-[#3b82f6] bg-white',
            meeting: 'border-l-8 border-[#eab308] bg-white',
            judging: 'border-l-8 border-[#a855f7] bg-white',
            match: 'border-l-8 border-[#ef4444] bg-white',
            ceremony: 'border-l-8 border-[#f97316] bg-white',
            major: 'border-l-8 border-black bg-white'
        };
        return map[type] || 'border-l-8 border-gray-300 bg-white';
    };

    return (
        <div className="flex flex-col h-full flat-panel rounded-none overflow-hidden text-black bg-[#6ee7b7]">
            {/* Day Tabs */}
            <div className="flex border-b-4 border-black bg-white">
                {days.map(day => (
                    <button
                        key={day}
                        onClick={() => setSelectedDay(day)}
                        className={clsx(
                            "flex-1 py-4 px-2 font-black uppercase transition-all min-w-[120px] font-mono tracking-tighter relative overflow-hidden border-r-4 border-black last:border-r-0",
                            selectedDay === day
                                ? "text-white bg-black"
                                : "text-black hover:bg-black/5"
                        )}
                    >
                        {formatDate(day)}
                    </button>
                ))}
            </div>

            {/* Timeline Content */}
            <div className="flex-1 overflow-y-auto p-6 relative bg-[#6ee7b7]">
                <ul className="space-y-6 relative">
                    {/* Vertical Time Line */}
                    <div className="absolute left-4 md:left-[8.5rem] top-0 bottom-0 w-[4px] bg-black hidden md:block"></div>

                    <AnimatePresence mode="popLayout">
                        {filteredEvents.map((event, index) => {
                            const isCurrent = isCurrentEvent(event);
                            return (
                                <motion.li
                                    key={event.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ delay: index * 0.05 }}
                                    className={clsx(
                                        "p-5 border-4 border-black flex flex-col md:flex-row gap-4 relative group transition-all shadow-[6px_6px_0px_0px_black]",
                                        getTypeColor(event.type, isCurrent)
                                    )}
                                >
                                    {/* Decorative dot on timeline */}
                                    <div className={clsx(
                                        "hidden md:block absolute left-[8.5rem] top-1/2 -mt-1 -ml-[8px] w-[16px] h-[16px] bg-white border-4 border-black z-10 transition-all",
                                        isCurrent ? "scale-125 bg-black" : "group-hover:scale-125"
                                    )}></div>

                                    <div className={clsx(
                                        "flex items-center gap-3 md:w-32 shrink-0 font-mono text-sm md:text-xl font-black transition-colors",
                                        isCurrent ? "text-white" : "text-black"
                                    )}>
                                        <Clock size={16} className={isCurrent ? "animate-pulse" : "stroke-black stroke-[3]"} />
                                        <span>{event.start}</span>
                                    </div>

                                    <div className="flex-1 pl-4 border-l-2 border-black/10 md:border-none">
                                        <div className="flex items-center gap-2">
                                            <h3 className={clsx(
                                                "font-black text-xl md:text-2xl leading-tight uppercase tracking-tighter transition-all italic",
                                                isCurrent ? "text-white" : "text-black"
                                            )}>
                                                {i18n.language === 'en' ? event.title : event.titleVi}
                                            </h3>
                                            {isCurrent && (
                                                <span className="text-[10px] bg-[#f97316] text-white px-2 py-0.5 border-2 border-black font-black animate-pulse shadow-[2px_2px_0px_0px_black]">LIVE</span>
                                            )}
                                        </div>
                                        <div className={clsx(
                                            "text-xs font-black mt-1 font-mono uppercase tracking-[0.2em] opacity-80",
                                            isCurrent ? "text-white" : "text-black"
                                        )}>
                                            {event.type}
                                        </div>
                                    </div>

                                    <div className={clsx(
                                        "text-xs font-black font-mono flex items-center self-start md:self-center transition-opacity",
                                        isCurrent ? "text-white" : "text-black opacity-40 group-hover:opacity-100"
                                    )}>
                                        &lt; {event.end} END &gt;
                                    </div>
                                </motion.li>
                            );
                        })}
                    </AnimatePresence>
                </ul>

                {filteredEvents.length === 0 && (
                    <div className="text-center py-20 font-black font-mono text-2xl uppercase border-4 border-dashed border-black/20 text-black/20">NO_DATA_STREAM</div>
                )}
            </div>

            {/* Current Time Indicator */}
            <div className="bg-black text-[#6ee7b7] border-t-4 border-black p-3 text-center text-xs font-black font-mono tracking-[0.3em] uppercase">
                SYSTEM_TIME: {currentTime.toLocaleTimeString()} // STATUS: ONLINE
            </div>
        </div>
    );
};


export default AgendaView;
