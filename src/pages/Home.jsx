import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Map, Calendar, Link as LinkIcon, Shield, ExternalLink } from 'lucide-react';
import GameButton from '../components/UI/GameButton';
import { getSettings } from '../components/Settings/settingsManager';
import { getLinks } from '../components/Links/linkManager';
import { motion } from 'framer-motion';

const Home = () => {
    const { t } = useTranslation();
    const [settings, setSettings] = useState({
        heroLogo: '',
        heroTitleImage: ''
    });
    const [links, setLinks] = useState([]);

    useEffect(() => {
        const loadSettings = async () => {
            const result = await getSettings();
            setSettings(result);
        };
        loadSettings();
        fetchLinks();
    }, []);

    const fetchLinks = async () => {
        const fetched = await getLinks();
        setLinks(fetched);
    };

    return (
        <div className="h-full flex flex-col items-center py-12 gap-16 relative z-10 text-black">

            {/* Navigation Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-5xl px-4 order-1">
                <GameButton to="/map" icon={Map} color="white" delay={0.1}>
                    {t('menu.map')}
                </GameButton>
                <GameButton to="/agenda" icon={Calendar} color="orange" delay={0.2}>
                    {t('menu.agenda')}
                </GameButton>
                {/* Admin button hidden as requested */}
            </div>

            {/* Resources / Links Section */}
            <div className="w-full max-w-5xl px-4 space-y-8 order-2">
                <div className="border-b-4 border-black pb-4 text-center md:text-left">
                    <h3 className="text-3xl font-black uppercase text-black tracking-tighter italic">
                        {t('links.title')}
                    </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {links.map((link) => (
                        <motion.a
                            key={link.id}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            whileHover={{ scale: 1.02, x: 5, y: -5, boxShadow: "8px 8px 0px 0px rgba(0,0,0,1)" }}
                            className="flat-panel p-6 bg-white flex items-center justify-between group cursor-pointer text-black"
                        >
                            <div>
                                <h4 className="text-xl font-black uppercase italic tracking-tighter group-hover:text-blue-600 transition-colors">{link.name}</h4>
                                <p className="text-sm font-black text-gray-500 font-mono">{link.nameVi}</p>
                            </div>
                            <ExternalLink className="text-black group-hover:rotate-45 transition-transform" strokeWidth={3} />
                        </motion.a>
                    ))}
                    {links.length === 0 && (
                        <div className="col-span-1 md:col-span-2 text-center py-12 border-4 border-dashed border-black/20 font-mono font-black text-black/40 uppercase">
                             // No Access Nodes Detected //
                        </div>
                    )}
                </div>
            </div>

            {/* Hero Section - Moved to Bottom */}
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-4xl flex flex-col items-center order-3 mt-auto relative"
            >
                {/* Divider */}
                <div className="w-full border-t-4 border-black mb-12 opacity-20"></div>

                {/* Branding Block */}
                {/* Branding Block */}
                <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16 w-full justify-center">
                    {/* Left Icon (Clock/Compass) */}
                    <div className="w-48 h-48 md:w-64 md:h-64 border-4 border-black bg-white shadow-[8px_8px_0px_0px_black] flex items-center justify-center relative decode-border overflow-hidden">
                        {settings.heroLogo ? (
                            <img src={settings.heroLogo} alt="Hero Logo" className="w-full h-full object-contain p-4" />
                        ) : (
                            <div className="absolute inset-2 border-2 border-black flex items-center justify-center">
                                <div className="w-32 h-32 md:w-44 md:h-44 rounded-full border-4 border-black bg-[#f87171] relative overflow-hidden">
                                    <div className="absolute top-1/2 left-1/2 w-1 h-20 md:h-24 bg-black origin-bottom -translate-x-1/2 -translate-y-full rotate-[15deg] transition-transform"></div>
                                    <div className="absolute top-1/2 left-1/2 w-3 h-3 bg-black rounded-full -translate-x-1/2 -translate-y-1/2"></div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Text */}
                    <div className="text-center md:text-left space-y-4">
                        {settings.heroTitleImage ? (
                            <img src={settings.heroTitleImage} alt="DECODE" className="h-20 md:h-32 object-contain" />
                        ) : (
                            <h2 className="text-6xl md:text-8xl font-black italic uppercase tracking-tighter leading-none">
                                DecodE
                            </h2>
                        )}
                        <p className="max-w-xs text-sm font-black font-mono uppercase tracking-widest pt-4">
                            {t('home.description')}
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Home;
