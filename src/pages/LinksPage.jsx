import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getLinks } from '../components/Links/linkManager';
import GameButton from '../components/UI/GameButton';
import { ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';

const LinksPage = () => {
    const { t, i18n } = useTranslation();
    const [links, setLinks] = useState([]);

    useEffect(() => {
        setLinks(getLinks());
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col gap-6 max-w-2xl mx-auto"
        >
            <div className="glass-panel p-6 rounded-lg text-white">
                <div className="flex items-center justify-between border-b border-ftc-green/30 pb-4 mb-6">
                    <h2 className="text-3xl font-bold uppercase tracking-widest text-ftc-green text-glow">
                        {t('links.title')}
                    </h2>
                    <div className="text-xs font-mono text-ftc-green/50 animate-pulse">Running...</div>
                </div>

                <div className="grid gap-4">
                    {links.map((link, idx) => (
                        <motion.a
                            key={link.id}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="flex items-center justify-between p-4 bg-black/40 border border-gray-700 hover:border-ftc-green hover:bg-ftc-green/10 transition-all group rounded"
                        >
                            <div className="flex flex-col">
                                <span className="font-bold text-lg text-white group-hover:text-ftc-green transition-colors">
                                    {i18n.language === 'en' ? link.name : link.nameVi}
                                </span>
                                <span className="text-xs font-mono text-gray-500 group-hover:text-ftc-green/70 truncate max-w-[250px]">
                                    {link.url}
                                </span>
                            </div>

                            <ExternalLink className="group-hover:rotate-45 transition-transform text-white group-hover:text-ftc-green" />
                        </motion.a>
                    ))}

                    {links.length === 0 && (
                        <p className="text-center text-gray-500 italic font-mono">&gt; NO_LINKS_FOUND</p>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export default LinksPage;
