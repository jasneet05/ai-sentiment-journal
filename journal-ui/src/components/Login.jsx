import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LogIn, User, Lock, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../api/journalApi';
import Navbar from './Navbar';
import Footer from './Footer';

const Login = ({ isDark, toggleTheme }) => {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem('token')) {
      navigate('/dashboard');
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await api.post('/public/login', { userName, password });
      localStorage.setItem('token', response.data);
      localStorage.setItem('userName', userName);
      navigate('/dashboard');
    } catch (err) {
      setError('Invalid username or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-color)] flex flex-col transition-colors duration-500">
      <Navbar isDark={isDark} toggleTheme={toggleTheme} />
      
      <main className="flex-grow flex items-center justify-center p-4 relative overflow-hidden">
        {/* Background Decorative Elements */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 rounded-full blur-[120px]" />

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md relative z-10"
        >
          <div className="glass-card p-10 rounded-[3rem] shadow-2xl border border-black/5 dark:border-white/10">
            <div className="text-center mb-10">
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', damping: 10 }}
                className="w-20 h-20 bg-gradient-to-tr from-blue-500 to-purple-600 rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-500/20"
              >
                <LogIn className="text-white w-10 h-10" />
              </motion.div>
              <h1 className="text-4xl font-black gradient-text mb-2 tracking-tight">Welcome Back</h1>
              <p className="text-slate-500 dark:text-slate-400 font-medium">Unlock your private vault</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 ml-1 uppercase tracking-widest">Username</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input 
                    type="text" 
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    className="w-full bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all dark:text-white font-bold"
                    placeholder="Your username"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 ml-1 uppercase tracking-widest">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all dark:text-white font-bold"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              {error && (
                <motion.p 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-red-500 text-xs font-bold bg-red-500/10 p-4 rounded-2xl border border-red-500/10"
                >
                  {error}
                </motion.p>
              )}

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-4 rounded-2xl shadow-xl shadow-blue-500/25 flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-10 uppercase tracking-widest text-sm"
              >
                {loading ? (
                  <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    Unlock Vault <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </motion.button>
            </form>

            <p className="text-center mt-10 text-slate-500 dark:text-slate-500 text-sm font-bold">
              New here? <span onClick={() => navigate('/signup')} className="text-blue-500 hover:underline cursor-pointer">Create Account</span>
            </p>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
};

export default Login;
