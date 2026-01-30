import React from 'react';
import InteractiveMap from '../components/Map/InteractiveMap';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

const MapPage = () => {
    const { t } = useTranslation();
    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="h-full flex flex-col"
        >
            <InteractiveMap />
        </motion.div>
    );
};

export default MapPage;
