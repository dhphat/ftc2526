import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getLinks, addLink, deleteLink } from '../components/Links/linkManager';
import { getSettings, updateSettings } from '../components/Settings/settingsManager';
import { motion } from 'framer-motion';
import { Plus, Trash, Lock, Settings, LogOut } from 'lucide-react';
import { auth } from '../firebase';
import { signInWithEmailAndPassword, onAuthStateChanged, signOut } from 'firebase/auth';

const AdminPage = () => {
    const { t } = useTranslation();
    const [links, setLinks] = useState([]);
    const [settings, setSettings] = useState({
        siteLogo: '',
        heroLogo: '',
        heroTitleImage: ''
    });
    const [user, setUser] = useState(null);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Form State
    const [newName, setNewName] = useState('');
    const [newNameVi, setNewNameVi] = useState('');
    const [newUrl, setNewUrl] = useState('');

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setLoading(false);
            if (currentUser) {
                fetchData();
            }
        });
        return () => unsubscribe();
    }, []);

    const fetchData = async () => {
        const fetchedLinks = await getLinks();
        setLinks(fetchedLinks);

        const fetchedSettings = await getSettings();
        setSettings(fetchedSettings);
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await signInWithEmailAndPassword(auth, email, password);
        } catch (err) {
            setError('Invalid credentials. Please try again.');
            console.error("Login error:", err);
        }
    };

    const handleLogout = async () => {
        await signOut(auth);
    };

    const handleUpdateSettings = async (e) => {
        e.preventDefault();
        await updateSettings(settings);
        alert('Settings updated successfully!');
    };

    const handleAdd = async (e) => {
        e.preventDefault();
        if (!newName || !newNameVi || !newUrl) return;

        const updatedLinks = await addLink({
            name: newName,
            nameVi: newNameVi,
            url: newUrl
        });
        setLinks(updatedLinks);
        setNewName('');
        setNewNameVi('');
        setNewUrl('');
    };

    const handleDelete = async (id) => {
        if (window.confirm('Delete this link?')) {
            const updatedLinks = await deleteLink(id);
            setLinks(updatedLinks);
        }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center font-black">Loading Admin Panel...</div>;

    if (!user) {
        return (
            <div className="flex justify-center items-center h-[70vh]">
                <form onSubmit={handleLogin} className="p-8 bg-white border-4 border-black flex flex-col gap-6 text-center max-w-sm w-full relative shadow-[8px_8px_0px_0px_black]">
                    <div className="absolute top-0 left-0 w-full h-2 bg-black"></div>

                    <Lock className="mx-auto mb-2 text-black" size={48} />
                    <h2 className="text-2xl font-black uppercase text-black tracking-tighter italic">Restricted Area</h2>

                    {error && <p className="text-red-600 font-bold text-sm bg-red-100 p-2 border-2 border-red-600">{error}</p>}

                    <div className="space-y-4">
                        <input
                            type="email"
                            placeholder="ADMIN EMAIL"
                            className="w-full p-3 bg-white border-4 border-black text-black font-black font-mono text-center focus:outline-none focus:bg-black/5 transition-all"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <input
                            type="password"
                            placeholder="PASSCODE"
                            className="w-full p-3 bg-white border-4 border-black text-black font-black font-mono text-center focus:outline-none focus:bg-black/5 transition-all uppercase"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button className="bg-black text-[#6ee7b7] border-4 border-black p-3 font-black hover:bg-white hover:text-black transition-all uppercase tracking-tighter font-mono shadow-[4px_4px_0px_0px_black] active:translate-x-1 active:translate-y-1 active:shadow-none">
                        &gt; AUTHENTICATE
                    </button>
                </form>
            </div>
        );
    }

    return (
        <div className="flat-panel p-8 max-w-6xl mx-auto rounded-none bg-white text-black space-y-12">
            <div className="flex justify-between items-center border-b-4 border-black pb-4">
                <div className="flex flex-col">
                    <h2 className="text-3xl font-black uppercase text-black tracking-tighter italic">{t('menu.admin')}</h2>
                    <span className="text-xs font-mono text-black/50 font-bold uppercase">Logged in as: {user.email}</span>
                </div>
                <button onClick={handleLogout} className="flex items-center gap-2 text-sm font-black text-red-600 hover:text-white hover:bg-red-600 border-2 border-red-600 px-3 py-1 font-mono uppercase transition-all shadow-[2px_2px_0px_0px_rgba(220,38,38,1)]">
                    <LogOut size={14} /> Logout
                </button>
            </div>

            {/* Branding Settings Section */}
            <div className="space-y-6">
                <h3 className="text-2xl font-black text-black uppercase tracking-tighter flex items-center gap-3 italic">
                    <Settings className="stroke-black stroke-[3]" /> Branding Customization
                </h3>
                <form onSubmit={handleUpdateSettings} className="grid grid-cols-1 md:grid-cols-3 gap-8 border-4 border-black p-8 bg-[#6ee7b7]/10 shadow-[8px_8px_0px_0px_black]">
                    <div className="space-y-4">
                        <label className="block font-black text-xs text-black uppercase font-mono border-b-2 border-black pb-1">Header site logo (URL)</label>
                        <input
                            className="w-full p-3 bg-white border-4 border-black text-black font-black focus:outline-none focus:bg-[#6ee7b7]/5 transition-colors"
                            value={settings.siteLogo || ''}
                            onChange={e => setSettings({ ...settings, siteLogo: e.target.value })}
                            placeholder="https://example.com/logo.png"
                        />
                        {settings.siteLogo && <img src={settings.siteLogo} alt="Preview" className="h-10 object-contain border-2 border-black bg-white" />}
                    </div>

                    <div className="space-y-4">
                        <label className="block font-black text-xs text-black uppercase font-mono border-b-2 border-black pb-1">Hero icon logo (URL)</label>
                        <input
                            className="w-full p-3 bg-white border-4 border-black text-black font-black focus:outline-none focus:bg-[#6ee7b7]/5 transition-colors"
                            value={settings.heroLogo || ''}
                            onChange={e => setSettings({ ...settings, heroLogo: e.target.value })}
                            placeholder="https://example.com/hero-icon.png"
                        />
                        {settings.heroLogo && <img src={settings.heroLogo} alt="Preview" className="h-20 w-20 object-contain border-2 border-black mx-auto bg-white" />}
                    </div>

                    <div className="space-y-4">
                        <label className="block font-black text-xs text-black uppercase font-mono border-b-2 border-black pb-1">Hero title image (URL)</label>
                        <input
                            className="w-full p-3 bg-white border-4 border-black text-black font-black focus:outline-none focus:bg-[#6ee7b7]/5 transition-colors"
                            value={settings.heroTitleImage || ''}
                            onChange={e => setSettings({ ...settings, heroTitleImage: e.target.value })}
                            placeholder="https://example.com/hero-title.png"
                        />
                        {settings.heroTitleImage && <img src={settings.heroTitleImage} alt="Preview" className="h-16 object-contain border-2 border-black bg-white" />}
                    </div>

                    <div className="md:col-span-3 flex justify-end">
                        <button className="bg-black text-[#6ee7b7] px-8 py-3 font-black flex items-center justify-center gap-2 hover:bg-white hover:text-black border-4 border-black transition-all uppercase font-mono shadow-[4px_4px_0px_0px_black] active:translate-x-1 active:translate-y-1 active:shadow-none">
                            Save Branding Config
                        </button>
                    </div>
                </form>
            </div>

            <div className="grid md:grid-cols-2 gap-12">
                {/* Add Form */}
                <div className="space-y-6">
                    <h3 className="text-xl font-black text-black uppercase tracking-tighter flex items-center gap-2 italic">
                        <span className="w-3 h-3 bg-black"></span> New Link
                    </h3>
                    <form onSubmit={handleAdd} className="flex flex-col gap-5 border-4 border-black p-6 bg-[#f8fafc] shadow-[6px_6px_0px_0px_black]">
                        <div>
                            <label className="font-black text-xs text-black/40 font-mono uppercase">Name (English)</label>
                            <input
                                className="w-full p-3 bg-white border-4 border-black text-black font-black focus:outline-none transition-colors"
                                value={newName}
                                onChange={e => setNewName(e.target.value)}
                                placeholder="Link Name..."
                                required
                            />
                        </div>

                        <div>
                            <label className="font-black text-xs text-black/40 font-mono uppercase">Name (Vietnamese)</label>
                            <input
                                className="w-full p-3 bg-white border-4 border-black text-black font-black focus:outline-none transition-colors"
                                value={newNameVi}
                                onChange={e => setNewNameVi(e.target.value)}
                                placeholder="Tên liên kết..."
                                required
                            />
                        </div>

                        <div>
                            <label className="font-black text-xs text-black/40 font-mono uppercase">URL</label>
                            <input
                                className="w-full p-3 bg-white border-4 border-black text-black font-black font-mono text-sm focus:outline-none transition-colors"
                                value={newUrl}
                                onChange={e => setNewUrl(e.target.value)}
                                placeholder="https://..."
                                type="url"
                                required
                            />
                        </div>

                        <button className="bg-black text-[#6ee7b7] p-4 font-black flex items-center justify-center gap-2 hover:bg-white hover:text-black border-4 border-black transition-all mt-2 uppercase font-mono shadow-[4px_4px_0px_0px_black] active:translate-x-1 active:translate-y-1 active:shadow-none">
                            <Plus size={24} strokeWidth={3} /> Execute Add
                        </button>
                    </form>
                </div>

                {/* List */}
                <div className="space-y-6">
                    <h3 className="text-xl font-black text-black uppercase tracking-tighter flex items-center gap-2 italic">
                        <span className="w-3 h-3 bg-blue-600"></span> Database
                    </h3>
                    <div className="h-[450px] overflow-y-auto space-y-3 pr-2 border-4 border-black bg-black/5 p-4 custom-scrollbar">
                        {links.map(link => (
                            <div key={link.id} className="flex items-center justify-between p-4 bg-white border-4 border-black shadow-[4px_4px_0px_0px_black] group">
                                <div className="overflow-hidden">
                                    <div className="font-black text-black uppercase italic tracking-tighter group-hover:bg-black group-hover:text-white px-2 -ml-2 transition-colors inline-block w-fit">{link.name}</div>
                                    <div className="text-xs text-black/40 font-black">{link.nameVi}</div>
                                    <div className="text-xs font-black font-mono text-blue-600 truncate max-w-[200px] opacity-70">{link.url}</div>
                                </div>
                                <button
                                    onClick={() => handleDelete(link.id)}
                                    className="p-2 border-2 border-transparent hover:border-red-600 text-black/30 hover:text-red-600 transition-all"
                                >
                                    <Trash size={20} />
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
