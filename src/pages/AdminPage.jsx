import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getLinks, addLink, deleteLink } from '../components/Links/linkManager';
import { motion } from 'framer-motion';
import { Plus, Trash, Lock } from 'lucide-react';

const AdminPage = () => {
    const { t } = useTranslation();
    const [links, setLinks] = useState([]);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState('');

    // Form State
    const [newName, setNewName] = useState('');
    const [newNameVi, setNewNameVi] = useState('');
    const [newUrl, setNewUrl] = useState('');

    useEffect(() => {
        setLinks(getLinks());
    }, []);

    const handleLogin = (e) => {
        e.preventDefault();
        if (password === 'admin') { // Simple mock password
            setIsAuthenticated(true);
        } else {
            alert('Wrong password! Try "admin"');
        }
    };

    const handleAdd = (e) => {
        e.preventDefault();
        if (!newName || !newNameVi || !newUrl) return;

        const updated = addLink({
            name: newName,
            nameVi: newNameVi,
            url: newUrl
        });
        setLinks(updated);
        setNewName('');
        setNewNameVi('');
        setNewUrl('');
    };

    const handleDelete = (id) => {
        if (window.confirm('Delete this link?')) {
            const updated = deleteLink(id);
            setLinks(updated);
        }
    };

    if (!isAuthenticated) {
        return (
            <div className="flex justify-center items-center h-[50vh]">
                <form onSubmit={handleLogin} className="p-8 glass-panel border border-ftc-green/50 flex flex-col gap-6 text-center max-w-sm w-full relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-ftc-green to-transparent animate-pulse"></div>

                    <Lock className="mx-auto mb-2 text-ftc-green animate-pulse" size={48} />
                    <h2 className="text-2xl font-black uppercase text-white tracking-widest text-glow">Restricted Area</h2>

                    <div className="relative">
                        <input
                            type="password"
                            placeholder="ENTER PASSCODE"
                            className="w-full p-3 bg-black/50 border border-ftc-green/30 text-ftc-green font-mono text-center focus:border-ftc-green focus:outline-none focus:box-glow transition-all"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <button className="bg-ftc-green/10 text-ftc-green border border-ftc-green p-2 font-bold hover:bg-ftc-green hover:text-black transition-all uppercase tracking-widest font-mono">
                        &gt; UNLOCK
                    </button>
                </form>
            </div>
        );
    }

    return (
        <div className="glass-panel p-6 border border-ftc-green/20 max-w-4xl mx-auto rounded-lg">
            <div className="flex justify-between items-center border-b border-ftc-green/20 pb-4 mb-6">
                <h2 className="text-3xl font-black uppercase text-ftc-green text-glow">{t('menu.admin')}</h2>
                <button onClick={() => setIsAuthenticated(false)} className="text-sm font-bold text-red-500 hover:text-red-400 font-mono">[ Logout ]</button>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                {/* Add Form */}
                <div className="space-y-4">
                    <h3 className="text-xl font-bold text-white uppercase tracking-wider flex items-center gap-2">
                        <span className="w-2 h-2 bg-ftc-green inline-block"></span> New Link
                    </h3>
                    <form onSubmit={handleAdd} className="flex flex-col gap-4 bg-black/20 p-4 rounded border border-white/5">
                        <div>
                            <label className="font-bold text-xs text-gray-400 font-mono uppercase">Name (English)</label>
                            <input
                                className="w-full p-2 bg-black border border-gray-700 text-white focus:border-ftc-green focus:outline-none transition-colors"
                                value={newName}
                                onChange={e => setNewName(e.target.value)}
                                placeholder="Link Name..."
                                required
                            />
                        </div>

                        <div>
                            <label className="font-bold text-xs text-gray-400 font-mono uppercase">Name (Vietnamese)</label>
                            <input
                                className="w-full p-2 bg-black border border-gray-700 text-white focus:border-ftc-green focus:outline-none transition-colors"
                                value={newNameVi}
                                onChange={e => setNewNameVi(e.target.value)}
                                placeholder="Tên liên kết..."
                                required
                            />
                        </div>

                        <div>
                            <label className="font-bold text-xs text-gray-400 font-mono uppercase">URL</label>
                            <input
                                className="w-full p-2 bg-black border border-gray-700 text-ftc-blue font-mono text-sm focus:border-ftc-blue focus:outline-none transition-colors"
                                value={newUrl}
                                onChange={e => setNewUrl(e.target.value)}
                                placeholder="https://..."
                                type="url"
                                required
                            />
                        </div>

                        <button className="bg-ftc-green text-black p-3 font-bold flex items-center justify-center gap-2 hover:bg-white transition-colors mt-2 uppercase font-mono">
                            <Plus size={20} /> Execute Add
                        </button>
                    </form>
                </div>

                {/* List */}
                <div className="space-y-4">
                    <h3 className="text-xl font-bold text-white uppercase tracking-wider flex items-center gap-2">
                        <span className="w-2 h-2 bg-ftc-blue inline-block"></span> Database
                    </h3>
                    <div className="h-[400px] overflow-y-auto space-y-2 pr-2 border border-white/5 bg-black/40 p-2 rounded custom-scrollbar">
                        {links.map(link => (
                            <div key={link.id} className="flex items-center justify-between p-3 bg-white/5 border border-transparent hover:border-gray-500 transition-colors group">
                                <div className="overflow-hidden">
                                    <div className="font-bold text-white group-hover:text-ftc-green transition-colors">{link.name}</div>
                                    <div className="text-xs text-gray-500">{link.nameVi}</div>
                                    <div className="text-xs font-mono text-ftc-blue truncate max-w-[200px] opacity-70">{link.url}</div>
                                </div>
                                <button
                                    onClick={() => handleDelete(link.id)}
                                    className="p-2 text-gray-600 hover:text-red-500 transition-colors"
                                >
                                    <Trash size={18} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminPage;
