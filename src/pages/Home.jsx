import React from 'react';
import { useTranslation } from 'react-i18next';
import { Map, Calendar, Link as LinkIcon, Shield } from 'lucide-react';
import GameButton from '../components/UI/GameButton';
import { motion } from 'framer-motion';

const Home = () => {
    const { t } = useTranslation();

    return (
        <div className="h-full flex flex-col items-center justify-center min-h-[80vh] gap-12 relative z-10">
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center space-y-6 mb-4 relative"
            >
                <div className="absolute -inset-10 bg-ftc-green/20 blur-3xl rounded-full opacity-30 animate-pulse-slow"></div>

                <h2 className="text-4xl md:text-7xl font-black italic uppercase text-transparent bg-clip-text bg-gradient-to-br from-white via-gray-200 to-gray-500 drop-shadow-[0_5px_5px_rgba(0,0,0,0.5)] font-mono tracking-tighter">
                    Decode<br /><span className="text-ftc-green text-glow">The Future</span>
                </h2>

                <div className="flex items-center justify-center gap-4">
                    <div className="h-[2px] w-12 bg-ftc-green/50"></div>
                    <p className="text-xl font-bold text-ftc-green tracking-[0.3em] font-sans text-glow">
                        {t('title').toUpperCase()}
                    </p>
                    <div className="h-[2px] w-12 bg-ftc-green/50"></div>
                </div>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-5xl px-4">
                <GameButton to="/map" icon={Map} color="white" delay={0.1}>
                    {t('menu.map')}
                </GameButton>
                <GameButton to="/agenda" icon={Calendar} color="orange" delay={0.2}>
                    {t('menu.agenda')}
                </GameButton>
                <GameButton to="/links" icon={LinkIcon} color="blue" delay={0.3}>
                    {t('menu.links')}
                </GameButton>
                <GameButton to="/admin" icon={Shield} color="purple" delay={0.4}>
                    {t('menu.admin')}
                </GameButton>
            </div>
        </div>
    );
};

export default Home;
