import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { UserPlus, User, Lock, Mail, ArrowRight, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../api/journalApi';
import Navbar from './Navbar';
import Footer from './Footer';

const Signup = ({ isDark, toggleTheme }) => {
  const [formData, setFormData] = useState({
    userName: '',
    email: '',
    password: '',
    sentimentAnalysis: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem('token')) {
      navigate('/dashboard');
    }
  }, [navigate]);

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await api.post('/public/signup', formData);
      navigate('/login');
    } catch (err) {
      setError('Signup failed. Username might already be taken.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-color)] flex flex-col transition-colors duration-500">
      <Navbar isDark={isDark} toggleTheme={toggleTheme} />

      <main className="flex-grow flex items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/10 rounded-full blur-[120px]" />

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md relative z-10"
        >
          <div className="glass-card p-10 rounded-[3rem] shadow-2xl border border-black/5 dark:border-white/10">
            <div className="text-center mb-8">
              <motion.div 
                initial={{ rotate: -20, scale: 0 }}
                animate={{ rotate: 0, scale: 1 }}
                className="w-16 h-16 bg-gradient-to-tr from-indigo-500 to-blue-600 rounded-[1.5rem] flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/20"
              >
                <UserPlus className="text-white w-8 h-8" />
              </motion.div>
              <h1 className="text-3xl font-black gradient-text tracking-tight">Join the Journey</h1>
              <p className="text-slate-500 dark:text-slate-400 text-sm mt-2 font-medium">Start your private digital vault today</p>
            </div>

            <form onSubmit={handleSignup} className="space-y-5">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 ml-1 uppercase tracking-widest">Username</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <input 
                    type="text" 
                    value={formData.userName}
                    onChange={(e) => setFormData({...formData, userName: e.target.value})}
                    className="w-full bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-2xl py-3.5 pl-11 pr-4 focus:ring-2 focus:ring-blue-500/50 outline-none dark:text-white text-sm font-bold"
                    placeholder="Choose a username"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 ml-1 uppercase tracking-widest">Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <input 
                    type="email" 
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-2xl py-3.5 pl-11 pr-4 focus:ring-2 focus:ring-blue-500/50 outline-none dark:text-white text-sm font-bold"
                    placeholder="your@email.com"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 ml-1 uppercase tracking-widest">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <input 
                    type="password" 
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    className="w-full bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-2xl py-3.5 pl-11 pr-4 focus:ring-2 focus:ring-blue-500/50 outline-none dark:text-white text-sm font-bold"
                    placeholder="Min 8 characters"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-black/5 dark:bg-white/5 rounded-2xl border border-black/5 dark:border-white/10">
                <div className="relative flex items-center justify-center">
                  <input 
                    type="checkbox" 
                    checked={formData.sentimentAnalysis}
                    onChange={(e) => setFormData({...formData, sentimentAnalysis: e.target.checked})}
                    className="w-5 h-5 appearance-none rounded-md bg-white/10 dark:bg-white/5 border border-black/10 dark:border-white/20 checked:bg-blue-600 checked:border-transparent transition-all cursor-pointer"
                  />
                  {formData.sentimentAnalysis && <ShieldCheck className="absolute text-white w-3 h-3 pointer-events-none" />}
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold dark:text-white">Sentiment Analysis</span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-500 font-medium tracking-tight">Enable smart mood insights (Recommended)</span>
                </div>
              </div>

              {error && (
                <p className="text-red-500 text-xs font-bold bg-red-500/10 p-3 rounded-xl border border-red-500/10">{error}</p>
              )}

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={loading}
                className="w-full bg-blue-600 py-4 rounded-2xl text-white font-black text-sm shadow-xl shadow-blue-500/20 flex items-center justify-center gap-2 mt-6 disabled:opacity-50 uppercase tracking-widest transition-all"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>Create My Vault <ArrowRight className="w-4 h-4" /></>
                )}
              </motion.button>
            </form>

            <p className="text-center mt-8 text-slate-500 dark:text-slate-500 text-xs font-bold">
              Already have a vault? <span onClick={() => navigate('/login')} className="text-blue-500 hover:underline cursor-pointer">Login</span>
            </p>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
};

export default Signup;
