import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, ShieldCheck, Settings, Lock, Activity, BarChart3, Cloud, Trash2, ShieldAlert } from 'lucide-react';
import api from '../api/journalApi';
import { SENTIMENTS_BASIC as SENTIMENTS } from '../constants';
import Navbar from './Navbar';
import Footer from './Footer';

const Profile = ({ isDark, toggleTheme }) => {
  const [userData, setUserData] = useState(null);
  const [journals, setJournals] = useState([]);
  const [weather, setWeather] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form State
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [sentimentAnalysis, setSentimentAnalysis] = useState(false);
  const [password, setPassword] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [userRes, journalRes, greetingRes] = await Promise.all([
        api.get('/user/me'),
        api.get('/journal'),
        api.get('/user')
      ]);

      setUserData(userRes.data);
      setJournals(journalRes.data || []);
      setWeather(greetingRes.data.split(', Weather ')[1] || 'unavailable');
      
      setUserName(userRes.data.userName);
      setEmail(userRes.data.email || '');
      setSentimentAnalysis(userRes.data.sentimentAnalysis);
    } catch (err) {
      console.error("Error fetching profile data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const response = await api.put('/user', { userName, email, sentimentAnalysis, password });
      localStorage.setItem('userName', response.data.userName);
      setUserData(response.data);
      alert("Profile updated successfully!");
    } catch (err) {
      console.error("Update error:", err);
      alert("Failed to update profile.");
    } finally {
      setSaving(false);
      setPassword('');
    }
  };

  const handleDelete = async () => {
    if (window.confirm("ARE YOU SURE? This will permanently delete your account and all data.")) {
      try {
        await api.delete('/user');
        const theme = localStorage.getItem('theme');
        localStorage.clear();
        if (theme) localStorage.setItem('theme', theme);
        window.location.href = '/login';
      } catch (err) {
        alert("Failed to delete account.");
      }
    }
  };

  const getMoodStats = () => {
    const stats = { HAPPY: 0, SAD: 0, ANGRY: 0, ANXIOUS: 0, NEUTRAL: 0 };
    journals.forEach(j => {
      if (j.sentiment) stats[j.sentiment] = (stats[j.sentiment] || 0) + 1;
      else stats.NEUTRAL++;
    });
    return stats;
  };

  if (loading) return (
    <div className="min-h-screen bg-[var(--bg-color)] flex items-center justify-center">
       <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
    </div>
  );

  const stats = getMoodStats();
  const totalEntries = journals.length;

  return (
    <div className="min-h-screen bg-[var(--bg-color)] text-slate-900 dark:text-slate-200">
      <Navbar isDark={isDark} toggleTheme={toggleTheme} />

      <main className="max-w-6xl mx-auto px-6 py-12">
        <header className="mb-12">
          <h2 className="text-4xl font-black gradient-text mb-2">Account Dashboard</h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Manage your profile and explore your journaling insights.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Analytics */}
          <div className="lg:col-span-2 space-y-8">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <motion.div whileHover={{ y: -5 }} className="glass-card p-6 rounded-[2rem] border border-black/5 dark:border-white/5">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-blue-500/10 rounded-2xl text-blue-500">
                    <Activity className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Total Entries</p>
                    <p className="text-3xl font-black dark:text-white">{totalEntries}</p>
                  </div>
                </div>
              </motion.div>

              <motion.div whileHover={{ y: -5 }} className="glass-card p-6 rounded-[2rem] border border-black/5 dark:border-white/5">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-amber-500/10 rounded-2xl text-amber-500">
                    <Cloud className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Weather</p>
                    <p className="text-sm font-bold dark:text-white line-clamp-1">{weather}</p>
                  </div>
                </div>
              </motion.div>

              <motion.div whileHover={{ y: -5 }} className="glass-card p-6 rounded-[2rem] border border-black/5 dark:border-white/5">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-purple-500/10 rounded-2xl text-purple-500">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Status</p>
                    <p className="text-sm font-bold text-green-500 uppercase">Active Pro</p>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Mood Chart */}
            <div className="glass-card p-8 rounded-[2.5rem] border border-black/5 dark:border-white/5">
              <div className="flex items-center gap-3 mb-8">
                <BarChart3 className="text-blue-500 w-6 h-6" />
                <h3 className="text-xl font-bold dark:text-white">Mood Distribution</h3>
              </div>
              
              <div className="space-y-6">
                {SENTIMENTS.map(mood => {
                  const count = stats[mood.value] || 0;
                  const percentage = totalEntries > 0 ? (count / totalEntries) * 100 : 0;
                  return (
                    <div key={mood.value} className="space-y-2">
                      <div className="flex justify-between text-sm font-bold">
                        <span className={mood.text}>{mood.value}</span>
                        <span className="text-slate-500">{count} entries ({Math.round(percentage)}%)</span>
                      </div>
                      <div className="h-3 bg-black/5 dark:bg-white/5 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${percentage}%` }}
                          transition={{ duration: 1, ease: "easeOut" }}
                          className={`h-full ${mood.color} shadow-lg`}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Settings */}
          <div className="lg:col-span-1 space-y-8">
            <div className="glass-card p-8 rounded-[2.5rem] border border-black/5 dark:border-white/5">
              <div className="flex items-center gap-3 mb-8">
                <Settings className="text-blue-500 w-6 h-6" />
                <h3 className="text-xl font-bold dark:text-white">Profile Settings</h3>
              </div>

              <form onSubmit={handleUpdate} className="space-y-5">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">Username</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      className="w-full bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-2xl py-3.5 pl-12 pr-6 outline-none dark:text-white focus:ring-2 focus:ring-blue-500/50 transition-all font-medium"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-2xl py-3.5 pl-12 pr-6 outline-none dark:text-white focus:ring-2 focus:ring-blue-500/50 transition-all font-medium"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">New Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Leave blank to keep current"
                      className="w-full bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-2xl py-3.5 pl-12 pr-6 outline-none dark:text-white focus:ring-2 focus:ring-blue-500/50 transition-all font-medium text-sm"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-black/5 dark:bg-white/5 rounded-2xl border border-black/5 dark:border-white/10">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${sentimentAnalysis ? 'bg-green-500/20 text-green-500' : 'bg-slate-400/20 text-slate-400'}`}>
                      <Activity className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold dark:text-white">Sentiment Analysis</p>
                      <p className="text-[10px] text-slate-500">Weekly reports enabled</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSentimentAnalysis(!sentimentAnalysis)}
                    className={`w-10 h-5 rounded-full relative transition-colors ${sentimentAnalysis ? 'bg-blue-600' : 'bg-slate-400 dark:bg-slate-700'}`}
                  >
                    <motion.div 
                      animate={{ x: sentimentAnalysis ? 20 : 4 }}
                      className="absolute top-1 w-3 h-3 bg-white rounded-full shadow-sm" 
                    />
                  </button>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={saving}
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-2 mt-4"
                >
                  {saving ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Save Changes'}
                </motion.button>
              </form>

              <div className="mt-8 pt-8 border-t border-black/5 dark:border-white/5">
                <button
                  onClick={handleDelete}
                  className="w-full flex items-center justify-center gap-2 text-red-500 hover:text-red-600 font-bold text-sm transition-colors group"
                >
                  <Trash2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  Delete Account
                </button>
              </div>
            </div>

            <div className="glass-card p-6 rounded-[2.5rem] border border-red-500/10 bg-red-500/5">
              <div className="flex gap-4">
                <div className="p-3 bg-red-500/20 rounded-2xl text-red-500 h-fit">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-red-500 mb-1">Security Notice</h4>
                  <p className="text-[11px] text-slate-500 dark:text-red-400/60 leading-relaxed">
                    Always keep your password unique and logout after using public devices to protect your private journal entries.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Profile;
