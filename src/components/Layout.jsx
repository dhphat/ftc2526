import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';
import { Globe, ArrowLeft, Home as HomeIcon } from 'lucide-react';
import { getSettings } from './Settings/settingsManager';
import { motion } from 'framer-motion';

const Layout = ({ children }) => {
    const { i18n } = useTranslation();
    const location = useLocation();
    const isHome = location.pathname === '/';
    const [settings, setSettings] = useState({ siteLogo: '' });

    useEffect(() => {
        const fetchSettings = async () => {
            const data = await getSettings();
            setSettings(data);

            // Dynamic Favicon Update
            if (data.favicon) {
                const link = document.querySelector("link[rel~='icon']") || document.createElement('link');
                link.type = 'image/x-icon';
                link.rel = 'icon';
                link.href = data.favicon;
                document.getElementsByTagName('head')[0].appendChild(link);
            }
        };
        fetchSettings();
    }, []);

    const toggleLanguage = () => {
        i18n.changeLanguage(i18n.language === 'en' ? 'vi' : 'en');
    };

    return (
        <div className="min-h-screen flex flex-col relative overflow-hidden text-black bg-[#6ee7b7]">
            {/* Header */}
            <header className="p-4 flex justify-between items-center z-40 bg-white border-b-4 border-black sticky top-0 shadow-[4px_4px_0px_rgba(0,0,0,1)]">
                <div className="flex items-center gap-4">
                    {!isHome && (
                        <Link to="/" className="p-2 text-black hover:bg-black/5 border-2 border-transparent hover:border-black transition-all active:scale-95">
                            <HomeIcon size={24} />
                        </Link>
                    )}
                    <h1 className="text-2xl md:text-3xl font-black italic tracking-tighter flex items-center gap-2 font-mono uppercase text-black">
                        {settings.siteLogo ? (
                            <img src={settings.siteLogo} alt="FTC Logo" className="h-8 md:h-10 object-contain" />
                        ) : (
                            <>
                                <span className="bg-black text-[#6ee7b7] px-2">FTC</span> VN 2026
                            </>
                        )}
                    </h1>
                </div>

                <button
                    onClick={toggleLanguage}
                    className="flex items-center gap-2 font-black px-4 py-2 bg-black text-[#6ee7b7] border-2 border-black hover:bg-white hover:text-black transition-all uppercase font-mono shadow-[2px_2px_0px_rgba(0,0,0,1)]"
                >
                    <Globe size={18} />
                    <span>{i18n.language.toUpperCase()}</span>
                </button>
            </header>

            {/* Main Content */}
            <main className="flex-1 w-full max-w-7xl mx-auto p-4 md:p-8 relative z-10 flex flex-col">
                {children}
            </main>

            {/* Footer */}
            <footer className="p-6 text-center text-xs font-black font-mono text-black border-t-2 border-black/10 tracking-[0.1em] uppercase">
                // System Online // First Tech Challenge Vietnam // 2025 - 2026 //
            </footer>
        </div>
    );
};

export default Layout;
