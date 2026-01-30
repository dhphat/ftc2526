import React from 'react';
import AgendaView from '../components/Agenda/AgendaView';
import { motion } from 'framer-motion';

const AgendaPage = () => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="h-full"
        >
            <AgendaView />
        </motion.div>
    );
};

export default AgendaPage;
