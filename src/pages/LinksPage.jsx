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
        const fetchLinks = async () => {
            const data = await getLinks();
            setLinks(data);
        };
        fetchLinks();
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex flex-col gap-6 max-w-2xl mx-auto w-full"
        >
            <div className="flat-panel p-8 rounded-none overflow-hidden bg-white text-black">
                <div className="flex items-center justify-between border-b-4 border-black pb-4 mb-8">
                    <h2 className="text-3xl font-black uppercase tracking-tighter italic text-black">
                        {t('links.title')}
                    </h2>
                    <div className="text-xs font-black font-mono text-black/30">ONLINE...</div>
                </div>

                <div className="grid gap-6">
                    {links.map((link, idx) => (
                        <motion.a
                            key={link.id}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            whileHover={{ x: 4, y: 4, shadow: "none" }}
                            className="flex items-center justify-between p-5 bg-white border-4 border-black shadow-[6px_6px_0px_0px_black] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all group"
                        >
                            <div className="flex flex-col gap-1">
                                <span className="font-black text-xl text-black uppercase italic tracking-tighter group-hover:bg-black group-hover:text-white px-2 -ml-2 transition-colors inline-block w-fit">
                                    {i18n.language === 'en' ? link.name : link.nameVi}
                                </span>
                                <span className="text-xs font-black font-mono text-black/50 group-hover:text-black truncate max-w-[250px] md:max-w-md">
                                    {link.url}
                                </span>
                            </div>

                            <div className="bg-black text-[#6ee7b7] p-2 group-hover:bg-white group-hover:text-black transition-colors border-2 border-black shadow-[2px_2px_0px_0px_black]">
                                <ExternalLink size={20} className="stroke-[3]" />
                            </div>
                        </motion.a>
                    ))}

                    {links.length === 0 && (
                        <div className="text-center py-12 border-4 border-dashed border-black/10 text-black/20 font-black font-mono uppercase italic">&gt; NO_LINKS_FOUND</div>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export default LinksPage;
