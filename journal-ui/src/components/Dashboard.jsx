import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Calendar, Trash2, Edit3, Heart, X, Send, Search, Activity } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../api/journalApi';
import { getSentimentStyles } from '../constants';
import Navbar from './Navbar';
import Footer from './Footer';

const EntryModal = ({ isOpen, onClose, onSave, initialData = null }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '');
      setContent(initialData.content || '');
    } else {
      setTitle('');
      setContent('');
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSave({ title, content });
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="glass-card w-full max-w-lg p-8 rounded-[2.5rem] shadow-2xl relative z-10 border border-black/5 dark:border-white/10"
      >
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-2xl font-bold dark:text-white">{initialData ? 'Edit Memory' : 'New Memory'}</h3>
          <button onClick={onClose} className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-full transition-colors">
            <X className="w-6 h-6 text-slate-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-500 ml-1 uppercase tracking-widest">Title</label>
            <input
              autoFocus
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Give it a name..."
              className="w-full bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-2xl py-4 px-6 outline-none dark:text-white text-lg font-bold focus:ring-2 focus:ring-blue-500/50 transition-all"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-500 ml-1 uppercase tracking-widest">Content</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What's on your mind?"
              rows={5}
              className="w-full bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-2xl py-4 px-6 outline-none dark:text-white resize-none focus:ring-2 focus:ring-blue-500/50 transition-all font-medium"
              required
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={saving}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50 mt-4"
          >
            {saving ? <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <>{initialData ? 'Update' : 'Save'} <Send className="w-5 h-5" /></>}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

const Dashboard = ({ isDark, toggleTheme }) => {
  const [journals, setJournals] = useState([]);
  const [greeting, setGreeting] = useState('Welcome back!');
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const storedUser = localStorage.getItem('userName');
    if (!storedUser) {
      navigate('/login');
      return;
    }
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    await Promise.all([fetchJournals(), fetchGreeting()]);
    setLoading(false);
  };

  useEffect(() => {
    if (location.state?.editingEntry) {
      setEditingEntry(location.state.editingEntry);
      setIsModalOpen(true);
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const fetchGreeting = async () => {
    try {
      const response = await api.get('/user');
      // Safety check: only set greeting if it's a string, otherwise use a fallback
      if (typeof response.data === 'string') {
        setGreeting(response.data);
      } else {
        setGreeting('Welcome back to your vault!');
      }
    } catch (err) {
      console.error("Greeting Fetch Error:", err);
      setGreeting('Welcome back!');
    }
  };

  const fetchJournals = async () => {
    try {
      const response = await api.get('/journal');
      setJournals(response.data || []);
    } catch (err) {
      console.error("Fetch Error:", err);
      const status = err.response?.status;
      const message = status === 401 ? "Session expired. Please log in again." : 
                      status === 403 ? "Access Denied. Check your permissions." :
                      "Connection Error (" + (err.message || "Server Unreachable") + ").";
      setError(message);
      setJournals([]);
    }
  };

  const handleSaveEntry = async (entryData) => {
    try {
      if (editingEntry) {
        await api.put(`/journal/id/${editingEntry.id}`, entryData);
      } else {
        await api.post('/journal', entryData);
      }
      setIsModalOpen(false);
      setEditingEntry(null);
      fetchJournals();
    } catch (err) {
      console.error("Save Error:", err);
      alert("Failed to save entry.");
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/journal/id/${id}`);
      setJournals(prev => prev.filter(j => j.id !== id));
      setConfirmDeleteId(null);
    } catch (err) {
      console.error("Delete Error:", err);
      setConfirmDeleteId(null);
    }
  };

  const filteredJournals = journals.filter(journal => 
    journal.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    journal.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[var(--bg-color)] text-slate-900 dark:text-slate-200">
      <Navbar isDark={isDark} toggleTheme={toggleTheme} />

      <main className="max-w-7xl mx-auto px-6 py-10">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20">
          <div>
            <h2 className="text-5xl md:text-6xl font-black gradient-text mb-4 tracking-tighter pb-2">Daily Log</h2>
            <p className="text-slate-500 dark:text-slate-400 font-semibold text-xl tracking-tight leading-relaxed max-w-2xl">{greeting || 'Capture your moments, analyze your growth.'}</p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input 
                type="text"
                placeholder="Search memories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-2xl py-4 pl-12 pr-6 outline-none dark:text-white focus:ring-2 focus:ring-blue-500/50 transition-all font-medium"
              />
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setEditingEntry(null);
                setIsModalOpen(true);
              }}
              className="flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-[2rem] shadow-xl shadow-blue-500/20 transition-all font-black text-sm uppercase tracking-widest whitespace-nowrap"
            >
              <Plus className="w-5 h-5" /> New Entry
            </motion.button>
          </div>
        </header>

        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12 p-6 glass-card border-red-500/20 bg-red-500/5 flex flex-col md:flex-row items-center justify-between gap-4"
          >
            <div className="flex items-center gap-4 text-red-500">
               <Activity className="w-6 h-6" />
               <p className="font-bold">{error}</p>
            </div>
            <button 
              onClick={fetchData}
              className="px-6 py-2 bg-red-500 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-red-400 transition-colors"
            >
              Retry Connection
            </button>
          </motion.div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 opacity-50">
            <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mb-4" />
            <p className="font-bold uppercase tracking-widest text-xs">Accessing your vault...</p>
          </div>
        ) : filteredJournals.length === 0 ? (
          <div className="text-center py-32 glass-card rounded-[3rem] border-dashed border-2 border-black/5 dark:border-white/5">
            <div className="w-24 h-24 bg-blue-500/5 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
              <Search className="w-10 h-10 text-blue-500/40" />
            </div>
            <h3 className="text-2xl font-black dark:text-white mb-3">No memories found</h3>
            <p className="text-slate-500 mb-10 max-w-sm mx-auto font-medium">
              {searchQuery ? `We couldn't find any entries matching "${searchQuery}"` : "Capture your first thought of the day and begin your journaling journey."}
            </p>
            {!searchQuery && (
              <button
                onClick={() => setIsModalOpen(true)}
                className="text-blue-500 font-bold hover:underline"
              >
                Click here to write your first entry
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence mode="popLayout">
              {filteredJournals.map((journal) => {
                const sStyles = getSentimentStyles(journal.sentiment);
                return (
                  <motion.div
                    key={journal.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="glass-card p-8 rounded-[2.5rem] border border-black/5 dark:border-white/5 hover:border-blue-500/40 transition-all group relative overflow-hidden cursor-pointer"
                    onClick={() => navigate(`/journal/${journal.id}`)}
                  >
                    <div className="flex justify-between items-start mb-6">
                      <div className="p-3 bg-blue-500/10 rounded-2xl text-blue-500 shadow-inner">
                        <Calendar className="w-5 h-5" />
                      </div>

                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        {confirmDeleteId === journal.id ? (
                          <div className="flex items-center gap-1 bg-red-500/10 p-1 rounded-xl border border-red-500/20">
                            <button
                              onClick={(e) => { e.stopPropagation(); handleDelete(journal.id); }}
                              className="px-3 py-1 bg-red-500 text-white text-[10px] font-bold rounded-lg"
                            >
                              YES
                            </button>
                            <button
                              onClick={(e) => { e.stopPropagation(); setConfirmDeleteId(null); }}
                              className="px-3 py-1 bg-black/10 dark:bg-white/10 dark:text-white text-[10px] font-bold rounded-lg"
                            >
                              NO
                            </button>
                          </div>
                        ) : (
                          <>
                            <button
                              onClick={(e) => { e.stopPropagation(); setEditingEntry(journal); setIsModalOpen(true); }}
                              className="p-2.5 bg-black/5 dark:bg-white/5 hover:bg-blue-500/10 rounded-xl text-slate-500 hover:text-blue-500 transition-all"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={(e) => { e.stopPropagation(); setConfirmDeleteId(journal.id); }}
                              className="p-2.5 bg-black/5 dark:bg-white/5 hover:bg-red-500/10 rounded-xl text-slate-500 hover:text-red-500 transition-all"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </div>

                    <h3 className="text-2xl font-black dark:text-white mb-4 line-clamp-1">{journal.title}</h3>
                    <p className="text-slate-500 dark:text-slate-400 text-base mb-8 line-clamp-3 leading-relaxed font-medium">{journal.content}</p>
                    
                    <div className="pt-6 border-t border-black/5 dark:border-white/5 flex justify-between items-center">
                      <span className="text-[11px] text-slate-400 font-bold uppercase tracking-widest">
                        {journal.date ? new Date(journal.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : 'Today'}
                      </span>
                      <div className={`flex items-center gap-1.5 text-[10px] font-black ${sStyles.color} ${sStyles.bg} px-4 py-2 rounded-full border ${sStyles.border} uppercase tracking-widest shadow-sm`}>
                        <Heart className={`w-3 h-3 ${journal.sentiment ? 'fill-current' : ''}`} />
                        <span>{journal.sentiment || 'NEUTRAL'}</span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </main>

      <Footer />

      <EntryModal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setEditingEntry(null); }}
        onSave={handleSaveEntry}
        initialData={editingEntry}
      />
    </div>
  );
};

export default Dashboard;
