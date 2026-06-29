import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Shield, 
  Sparkles, 
  BarChart3, 
  ArrowRight, 
  Lock, 
  PenTool, 
  Cloud,
  Heart
} from 'lucide-react';
import Navbar from './Navbar';
import Footer from './Footer';

const Landing = ({ isDark, toggleTheme }) => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Shield,
      title: "Private & Secure",
      desc: "Your entries are encrypted and visible only to you. Your thoughts remain your own.",
      color: "bg-blue-500/10 text-blue-500"
    },
    {
      icon: Sparkles,
      title: "Mood Analytics",
      desc: "Track your emotional growth over time with AI-powered sentiment analysis.",
      color: "bg-purple-500/10 text-purple-500"
    },
    {
      icon: BarChart3,
      title: "Visual Insights",
      desc: "Beautiful charts and statistics to help you discover patterns in your daily life.",
      color: "bg-indigo-500/10 text-indigo-500"
    }
  ];

  return (
    <div className="min-h-screen bg-[var(--bg-color)] transition-colors duration-500 overflow-hidden">
      <Navbar isDark={isDark} toggleTheme={toggleTheme} isLanding={true} />

      {/* Hero Section */}
      <section className="relative pt-20 pb-32 md:pt-32 md:pb-52 px-6">
        {/* Background Glows */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/20 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/20 rounded-full blur-[120px] animate-pulse delay-700" />
        </div>

        <div className="max-w-7xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-widest mb-6 border border-blue-500/20">
              The ultimate journaling experience
            </span>
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[1.1] mb-8 dark:text-white">
              Write your <span className="gradient-text">Story</span>,<br />
              Understand your <span className="gradient-text">Soul</span>.
            </h1>
            <p className="text-xl md:text-2xl text-slate-500 dark:text-slate-400 max-w-3xl mx-auto mb-12 font-medium leading-relaxed">
              Experience the first AI-powered digital vault designed to help you capture moments, analyze moods, and grow every single day.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate(localStorage.getItem('token') ? '/dashboard' : '/signup')}
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 text-white px-10 py-5 rounded-[2rem] font-black text-sm uppercase tracking-widest shadow-2xl shadow-blue-500/40 flex items-center justify-center gap-3 transition-all"
              >
                {localStorage.getItem('token') ? 'Go to Dashboard' : 'Start Journaling'} <ArrowRight className="w-5 h-5" />
              </motion.button>
              {!localStorage.getItem('token') && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/login')}
                  className="w-full sm:w-auto glass px-10 py-5 rounded-[2rem] font-black text-sm uppercase tracking-widest dark:text-white transition-all border border-black/5 dark:border-white/10"
                >
                  Login to Vault
                </motion.button>
              )}
            </div>
          </motion.div>

          {/* Floating UI Elements Mockup */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="mt-24 relative max-w-5xl mx-auto"
          >
             <div className="glass-card rounded-[3rem] p-4 border-black/5 dark:border-white/10 shadow-2xl overflow-hidden">
                <div className="bg-slate-100 dark:bg-[#1e293b] rounded-[2.5rem] aspect-video flex items-center justify-center group overflow-hidden">
                   <div className="relative">
                      <div className="w-32 h-32 bg-blue-500/20 rounded-full flex items-center justify-center animate-ping absolute inset-0" />
                      <PenTool className="w-20 h-20 text-blue-500 relative z-10" />
                   </div>
                </div>
             </div>
             
             {/* Decorative Mini Cards */}
             <div className="hidden lg:block absolute -top-10 -left-10 glass-card p-6 rounded-3xl shadow-xl border-black/5 dark:border-white/5 max-w-[200px] text-left">
                <Heart className="text-red-500 w-6 h-6 mb-3 fill-current" />
                <p className="text-xs font-bold text-slate-500 uppercase mb-1">Today's Mood</p>
                <p className="text-lg font-black dark:text-white">Happy & Calm</p>
             </div>
             
             <div className="hidden lg:block absolute -bottom-10 -right-10 glass-card p-6 rounded-3xl shadow-xl border-black/5 dark:border-white/5 max-w-[200px] text-left">
                <BarChart3 className="text-purple-500 w-6 h-6 mb-3" />
                <p className="text-xs font-bold text-slate-500 uppercase mb-1">Growth</p>
                <p className="text-lg font-black dark:text-white">+12% Streak</p>
             </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-32 px-6 bg-black/5 dark:bg-white/[0.01]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-black dark:text-white mb-4 tracking-tighter">Everything you need to <span className="gradient-text">Reflect</span></h2>
            <p className="text-slate-500 dark:text-slate-400 font-medium">Simple yet powerful tools to keep your life on track.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((f, idx) => {
              const Icon = f.icon;
              return (
                <motion.div
                  key={idx}
                  whileHover={{ y: -10 }}
                  className="glass-card p-10 rounded-[3rem] border border-black/5 dark:border-white/10"
                >
                  <div className={`w-14 h-14 ${f.color} rounded-2xl flex items-center justify-center mb-8 shadow-inner`}>
                    <Icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-black dark:text-white mb-4 tracking-tight">{f.title}</h3>
                  <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed">{f.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Trust/CTA Section */}
      <section className="py-32 px-6 relative">
         <div className="max-w-4xl mx-auto glass-card p-12 md:p-20 rounded-[4rem] text-center border-blue-500/20 bg-gradient-to-tr from-blue-600/5 to-purple-600/5">
            <h2 className="text-4xl md:text-6xl font-black dark:text-white mb-8 tracking-tighter leading-tight">Ready to start your <br /><span className="gradient-text">Private Journey?</span></h2>
            <p className="text-xl text-slate-500 dark:text-slate-400 mb-12 font-medium">Join thousands of users who trust JournalApp for their daily reflections.</p>
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate(localStorage.getItem('token') ? '/dashboard' : '/signup')}
                className="bg-blue-600 hover:bg-blue-500 text-white px-12 py-5 rounded-[2rem] font-black text-sm uppercase tracking-widest shadow-2xl shadow-blue-500/40 transition-all"
            >
              {localStorage.getItem('token') ? 'Open My Vault' : 'Create Your Vault'}
            </motion.button>
         </div>
      </section>

      <Footer />
    </div>
  );
};

export default Landing;
