import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, Edit3, Trash2, Heart, Smile, Frown, Flame, Activity } from 'lucide-react';
import api from '../api/journalApi';
import Navbar from './Navbar';
import Footer from './Footer';

const SENTIMENTS = [
  { value: 'HAPPY', emoji: '😊', color: 'text-green-400', bg: 'bg-green-400/10', border: 'border-green-400/20', icon: Smile },
  { value: 'SAD', emoji: '😢', color: 'text-blue-400', bg: 'bg-blue-400/10', border: 'border-blue-400/20', icon: Frown },
  { value: 'ANGRY', emoji: '😡', color: 'text-red-400', bg: 'bg-red-400/10', border: 'border-red-400/20', icon: Flame },
  { value: 'ANXIOUS', emoji: '😰', color: 'text-amber-400', bg: 'bg-amber-400/10', border: 'border-amber-400/20', icon: Activity },
];

const JournalView = ({ isDark, toggleTheme }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [journal, setJournal] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJournal();
  }, [id]);

  const fetchJournal = async () => {
    try {
      const response = await api.get(`/journal/id/${id}`);
      setJournal(response.data);
    } catch (err) {
      console.error("Fetch Error:", err);
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this entry?")) {
      try {
        await api.delete(`/journal/id/${id}`);
        navigate('/dashboard');
      } catch (err) {
        alert("Failed to delete entry.");
      }
    }
  };

  const getSentimentStyles = (sentimentValue) => {
    const s = SENTIMENTS.find(sent => sent.value === sentimentValue);
    return s || { color: 'text-pink-400', bg: 'bg-pink-400/5', border: 'border-pink-400/10', emoji: '💜', icon: Heart };
  };

  if (loading) return (
    <div className="min-h-screen bg-[var(--bg-color)] flex items-center justify-center">
       <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
    </div>
  );

  if (!journal) return null;

  const sStyles = getSentimentStyles(journal.sentiment);
  const MoodIcon = sStyles.icon;

  return (
    <div className="min-h-screen bg-[var(--bg-color)] text-slate-900 dark:text-slate-200 selection:bg-blue-500/30 transition-colors duration-500">
      <Navbar isDark={isDark} toggleTheme={toggleTheme} />
      
      {/* Dynamic Background Glow */}
      <div className={`fixed inset-0 pointer-events-none opacity-20 blur-[120px] transition-colors duration-1000 ${sStyles.bg.replace('/10', '/30')}`} />
      
      <div className="max-w-4xl mx-auto px-6 py-12 relative z-10">
        <motion.button
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 text-slate-500 hover:text-blue-500 transition-colors mb-12 group font-bold uppercase tracking-widest text-xs"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Return to Dashboard</span>
        </motion.button>

        <motion.article
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="glass-card rounded-[3rem] border border-black/5 dark:border-white/10 overflow-hidden shadow-2xl"
        >
          {/* Header Section */}
          <div className="p-8 md:p-12 border-b border-black/5 dark:border-white/5">
            <div className="flex flex-wrap justify-between items-start gap-6 mb-10">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-blue-500/10 rounded-2xl text-blue-500 shadow-inner">
                    <Calendar className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-bold text-slate-500 tracking-widest uppercase">
                    {journal.date ? new Date(journal.date).toLocaleDateString(undefined, { 
                      weekday: 'long', 
                      month: 'long', 
                      day: 'numeric', 
                      year: 'numeric' 
                    }) : 'Recorded Today'}
                  </span>
                </div>
                <h1 className="text-5xl md:text-7xl font-black dark:text-white leading-tight tracking-tighter mb-4">
                  {journal.title}
                </h1>
              </div>

              <motion.div 
                whileHover={{ scale: 1.05 }}
                className={`flex items-center gap-2 px-8 py-4 rounded-[2rem] border ${sStyles.bg} ${sStyles.border} ${sStyles.color} font-black text-sm tracking-widest shadow-xl uppercase`}
              >
                <MoodIcon className="w-5 h-5" />
                <span>{journal.sentiment || 'NEUTRAL'}</span>
              </motion.div>
            </div>

            <div className="flex gap-4">
              <button 
                onClick={() => navigate('/dashboard', { state: { editingEntry: journal } })}
                className="flex items-center gap-2 px-8 py-3.5 bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 rounded-[1.5rem] transition-all border border-black/5 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:text-blue-500 dark:hover:text-blue-400 font-black text-xs uppercase tracking-widest"
              >
                <Edit3 className="w-4 h-4" /> Edit Memory
              </button>
              <button 
                onClick={handleDelete}
                className="flex items-center gap-2 px-8 py-3.5 bg-red-500/5 hover:bg-red-500/10 rounded-[1.5rem] transition-all border border-red-500/10 text-red-500 font-black text-xs uppercase tracking-widest"
              >
                <Trash2 className="w-4 h-4" /> Delete
              </button>
            </div>
          </div>

          {/* Content Section */}
          <div className="p-8 md:p-12 bg-black/[0.01] dark:bg-white/[0.01]">
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <p className="text-xl md:text-2xl dark:text-slate-300 leading-relaxed whitespace-pre-wrap font-medium tracking-tight">
                {journal.content}
              </p>
            </div>
          </div>

          <div className="h-2 bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />
        </motion.article>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-16 text-center"
        >
          <p className="text-slate-400 dark:text-slate-500 italic font-bold tracking-tight text-lg">
            "Every day is a new page in your story."
          </p>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
};

export default JournalView;
