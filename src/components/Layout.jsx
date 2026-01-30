import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';
import { Globe, ArrowLeft, Home as HomeIcon } from 'lucide-react';
import { motion } from 'framer-motion';

const Layout = ({ children }) => {
    const { i18n } = useTranslation();
    const location = useLocation();
    const isHome = location.pathname === '/';

    const toggleLanguage = () => {
        i18n.changeLanguage(i18n.language === 'en' ? 'vi' : 'en');
    };

    return (
        <div className="min-h-screen flex flex-col relative overflow-hidden text-white bg-ftc-dark">
            {/* Visual Effects */}
            <div className="scanline pointer-events-none"></div>
            <div className="fixed inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-ftc-green/5 via-transparent to-transparent opacity-50 pointer-events-none"></div>

            {/* Header */}
            <header className="p-4 flex justify-between items-center z-40 bg-ftc-dark/80 backdrop-blur-md border-b border-ftc-green/20 sticky top-0 shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
                <div className="flex items-center gap-4">
                    {!isHome && (
                        <Link to="/" className="p-2 text-ftc-green hover:bg-ftc-green/10 rounded-full transition-all active:scale-95 border border-transparent hover:border-ftc-green/50">
                            <HomeIcon size={24} />
                        </Link>
                    )}
                    <h1 className="text-2xl md:text-3xl font-black italic tracking-wider flex items-center gap-2 font-mono text-transparent bg-clip-text bg-gradient-to-r from-ftc-green to-blue-400 drop-shadow-[0_0_10px_rgba(110,231,183,0.5)]">
                        <span className="text-ftc-green">FTC</span> VN 2026
                    </h1>
                </div>

                <button
                    onClick={toggleLanguage}
                    className="flex items-center gap-2 font-bold px-4 py-2 bg-ftc-dark/50 border border-ftc-green/30 text-ftc-green hover:bg-ftc-green hover:text-black transition-all rounded clip-path-slant"
                >
                    <Globe size={18} />
                    <span className="font-mono">{i18n.language.toUpperCase()}</span>
                </button>
            </header>

            {/* Main Content */}
            <main className="flex-1 w-full max-w-7xl mx-auto p-4 md:p-8 relative z-10 flex flex-col">
                {children}
            </main>

            {/* Footer */}
            <footer className="p-6 text-center text-xs font-mono text-ftc-green/40 tracking-[0.2em] uppercase">
        // System Online // First Tech Challenge Vietnam // 2025 - 2026 //
            </footer>
        </div>
    );
};

export default Layout;
