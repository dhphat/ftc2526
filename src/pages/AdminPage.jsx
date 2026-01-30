import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getLinks, addLink, deleteLink, updateLink } from '../components/Links/linkManager';
import { getPrompts, updatePrompt } from '../components/PhotoBooth/PromptManager';
import { getSettings, updateSettings } from '../components/Settings/settingsManager';
import { uploadImage } from '../components/Settings/uploadManager';
import { motion } from 'framer-motion';
import { Plus, Trash, Lock, Settings, LogOut, UploadCloud, Image as ImageIcon, Camera, Edit2, Save, X } from 'lucide-react';

const PromptManagerView = () => {
    const [prompts, setPrompts] = useState([]);
    const [editingPrompt, setEditingPrompt] = useState(null);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        loadPrompts();
    }, []);

    const loadPrompts = async () => {
        const data = await getPrompts();
        setPrompts(data);
    };

    const handleSavePrompt = async (id, newPromptText) => {
        await updatePrompt(id, { prompt: newPromptText });
        setEditingPrompt(null);
        loadPrompts();
    };

    const handleUploadSample = async (file, id) => {
        if (!file) return;
        setUploading(true);
        try {
            const url = await uploadImage(file, `prompts/${id}`);
            await updatePrompt(id, { sampleImage: url });
            loadPrompts();
        } catch (error) {
            alert("Upload failed");
        } finally {
            setUploading(false);
        }
    };

    return (
        <>
            {prompts.map(prompt => (
                <div key={prompt.id} className="bg-white border-4 border-black p-4 space-y-4">
                    <div className="flex justify-between items-start">
                        <div>
                            <h4 className="font-black text-lg uppercase italic">{prompt.name}</h4>
                            <p className="text-xs font-mono text-black/60">{prompt.description}</p>
                        </div>
                        {editingPrompt === prompt.id ? (
                            <div className="flex gap-2">
                                <button onClick={() => setEditingPrompt(null)} className="p-1 hover:text-red-600"><X size={16} /></button>
                            </div>
                        ) : (
                            <button onClick={() => setEditingPrompt(prompt.id)} className="p-1 hover:text-blue-600"><Edit2 size={16} /></button>
                        )}
                    </div>

                    {/* Sample Image Upload */}
                    <div className="relative group cursor-pointer border-2 border-black border-dashed bg-gray-50 h-32 flex items-center justify-center overflow-hidden">
                        {prompt.sampleImage ? (
                            <img src={prompt.sampleImage} alt="Sample" className="w-full h-full object-cover" />
                        ) : (
                            <span className="text-xs font-black text-black/20 uppercase text-center p-2">Upload Sample Result<br />(4:5 Ratio)</span>
                        )}
                        <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => handleUploadSample(e.target.files[0], prompt.id)} disabled={uploading} />
                        <div className="absolute bottom-1 right-1 bg-black text-white p-1 pointer-events-none"><UploadCloud size={12} /></div>
                    </div>

                    {/* Prompt Editor */}
                    <div className="relative">
                        <textarea
                            className={`w-full h-32 p-2 font-mono text-xs border-2 border-black bg-black/5 resize-none focus:outline-none ${editingPrompt === prompt.id ? 'bg-white' : 'opacity-50 pointer-events-none'}`}
                            defaultValue={prompt.prompt}
                            id={`prompt-text-${prompt.id}`}
                        />
                        {editingPrompt === prompt.id && (
                            <button
                                onClick={() => handleSavePrompt(prompt.id, document.getElementById(`prompt-text-${prompt.id}`).value)}
                                className="absolute bottom-2 right-2 bg-black text-[#f97316] text-xs font-black px-2 py-1 uppercase flex items-center gap-1 hover:bg-[#f97316] hover:text-black transition-colors"
                            >
                                <Save size={12} /> Save
                            </button>
                        )}
                    </div>
                </div>
            ))}
        </>
    );
};
import { auth } from '../firebase';
import { signInWithEmailAndPassword, onAuthStateChanged, signOut } from 'firebase/auth';

const AdminPage = () => {
    const { t } = useTranslation();
    const [links, setLinks] = useState([]);
    const [settings, setSettings] = useState({
        siteLogo: '',
        heroLogo: '',
        heroTitleImage: '',
        favicon: ''
    });
    const [user, setUser] = useState(null);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');

    // Form State
    const [newName, setNewName] = useState('');
    const [newNameVi, setNewNameVi] = useState('');
    const [newUrl, setNewUrl] = useState('');
    const [editingId, setEditingId] = useState(null);

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

    const handleImageUpload = async (file, key) => {
        if (!file) return;
        setUploading(true);
        try {
            // Path: settings/{key}
            const url = await uploadImage(file, 'settings');
            setSettings(prev => ({ ...prev, [key]: url }));
        } catch (error) {
            alert("Upload failed. Please try again.");
        } finally {
            setUploading(false);
        }
    };

    const handleUpdateSettings = async (e) => {
        e.preventDefault();
        await updateSettings(settings);
        alert('Settings updated successfully!');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!newName || !newNameVi || !newUrl) return;

        const linkData = {
            name: newName,
            nameVi: newNameVi,
            url: newUrl
        };

        let updatedLinks;
        if (editingId) {
            updatedLinks = await updateLink(editingId, linkData);
            setEditingId(null);
        } else {
            updatedLinks = await addLink(linkData);
        }

        setLinks(updatedLinks);
        setNewName('');
        setNewNameVi('');
        setNewUrl('');
    };

    const handleEdit = (link) => {
        setNewName(link.name);
        setNewNameVi(link.nameVi);
        setNewUrl(link.url);
        setEditingId(link.id);
    };

    const handleCancelEdit = () => {
        setNewName('');
        setNewNameVi('');
        setNewUrl('');
        setEditingId(null);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Delete this link?')) {
            const updatedLinks = await deleteLink(id);
            setLinks(updatedLinks);
            if (editingId === id) handleCancelEdit();
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
                <form onSubmit={handleUpdateSettings} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 border-4 border-black p-8 bg-[#6ee7b7]/10 shadow-[8px_8px_0px_0px_black]">

                    {/* Helper Component for File Upload */}
                    {[
                        { key: 'siteLogo', label: 'Header Logo', hClass: 'h-10' },
                        { key: 'heroLogo', label: 'Hero Icon', hClass: 'h-20' },
                        { key: 'heroTitleImage', label: 'Hero "DECODE"', hClass: 'h-16' },
                        { key: 'favicon', label: 'Browser Favicon', hClass: 'h-10 w-10 rounded-full' }
                    ].map(({ key, label, hClass }) => (
                        <div key={key} className="space-y-4">
                            <label className="block font-black text-xs text-black uppercase font-mono border-b-2 border-black pb-1">{label}</label>

                            <div className="relative group cursor-pointer border-4 border-black bg-white hover:bg-black/5 transition-colors p-4 flex flex-col items-center justify-center min-h-[150px]">
                                {settings[key] ? (
                                    <img src={settings[key]} alt="Preview" className={`${hClass} object-contain mb-4`} />
                                ) : (
                                    <ImageIcon className="text-black/20 mb-4" size={48} />
                                )}

                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleImageUpload(e.target.files[0], key)}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    disabled={uploading}
                                />

                                <div className="absolute bottom-2 right-2 p-2 bg-black text-white pointer-events-none">
                                    <UploadCloud size={16} />
                                </div>
                            </div>
                            {uploading && <div className="text-xs font-mono font-black text-blue-600 animate-pulse text-center">UPLOADING...</div>}
                        </div>
                    ))}

                    <div className="md:col-span-2 lg:col-span-4 flex justify-end">
                        <button disabled={uploading} className="bg-black text-[#6ee7b7] px-8 py-3 font-black flex items-center justify-center gap-2 hover:bg-white hover:text-black border-4 border-black transition-all uppercase font-mono shadow-[4px_4px_0px_0px_black] active:translate-x-1 active:translate-y-1 active:shadow-none disabled:opacity-50">
                            Save Branding Config
                        </button>
                    </div>
                </form>
            </div>

            {/* Photo Prompt Manager Section */}
            <div className="space-y-6">
                <h3 className="text-2xl font-black text-black uppercase tracking-tighter flex items-center gap-3 italic">
                    <Camera className="stroke-black stroke-[3]" /> Photo Prompt Manager
                </h3>
                <div className="border-4 border-black p-8 bg-[#f97316]/10 shadow-[8px_8px_0px_0px_black] grid grid-cols-1 md:grid-cols-2 gap-8">
                    <PromptManagerView />
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-12">
                {/* Add/Edit Form */}
                <div className="space-y-6">
                    <h3 className="text-xl font-black text-black uppercase tracking-tighter flex items-center gap-2 italic">
                        <span className="w-3 h-3 bg-black"></span> {editingId ? 'Edit Link' : 'New Link'}
                    </h3>
                    <form onSubmit={handleSubmit} className="flex flex-col gap-5 border-4 border-black p-6 bg-[#f8fafc] shadow-[6px_6px_0px_0px_black]">
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

                        <div className="flex gap-4">
                            <button className="flex-1 bg-black text-[#6ee7b7] p-4 font-black flex items-center justify-center gap-2 hover:bg-white hover:text-black border-4 border-black transition-all mt-2 uppercase font-mono shadow-[4px_4px_0px_0px_black] active:translate-x-1 active:translate-y-1 active:shadow-none">
                                <Plus size={24} strokeWidth={3} className={editingId ? "hidden" : "block"} />
                                {editingId ? 'Update Link' : 'Execute Add'}
                            </button>
                            {editingId && (
                                <button type="button" onClick={handleCancelEdit} className="flex-1 bg-gray-200 text-black p-4 font-black flex items-center justify-center gap-2 hover:bg-gray-300 border-4 border-black transition-all mt-2 uppercase font-mono shadow-[4px_4px_0px_0px_black] active:translate-x-1 active:translate-y-1 active:shadow-none">
                                    Cancel
                                </button>
                            )}
                        </div>
                    </form>
                </div>

                {/* List */}
                <div className="space-y-6">
                    <h3 className="text-xl font-black text-black uppercase tracking-tighter flex items-center gap-2 italic">
                        <span className="w-3 h-3 bg-blue-600"></span> Database
                    </h3>
                    <div className="h-[450px] overflow-y-auto space-y-3 pr-2 border-4 border-black bg-black/5 p-4 custom-scrollbar">
                        {links.map(link => (
                            <div key={link.id} className={`flex items-center justify-between p-4 bg-white border-4 border-black shadow-[4px_4px_0px_0px_black] group ${editingId === link.id ? 'border-dashed border-blue-600 bg-blue-50' : ''}`}>
                                <div className="overflow-hidden">
                                    <div className="font-black text-black uppercase italic tracking-tighter group-hover:bg-black group-hover:text-white px-2 -ml-2 transition-colors inline-block w-fit">{link.name}</div>
                                    <div className="text-xs text-black/40 font-black">{link.nameVi}</div>
                                    <div className="text-xs font-black font-mono text-blue-600 truncate max-w-[200px] opacity-70">{link.url}</div>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleEdit(link)}
                                        className="p-2 border-2 border-transparent hover:border-black text-black/30 hover:text-black transition-all"
                                    >
                                        <Settings size={20} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(link.id)}
                                        className="p-2 border-2 border-transparent hover:border-red-600 text-black/30 hover:text-red-600 transition-all"
                                    >
                                        <Trash size={20} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
export default AdminPage;
