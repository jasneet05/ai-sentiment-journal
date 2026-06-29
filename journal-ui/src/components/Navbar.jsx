import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sun, Moon, LayoutDashboard, User, LogOut, Edit3, UserPlus, LogIn } from 'lucide-react';

const Navbar = ({ isDark, toggleTheme, isLanding = false }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const userName = localStorage.getItem('userName');
  const isLoggedIn = !!localStorage.getItem('token');

  const handleLogout = () => {
    const theme = localStorage.getItem('theme');
    localStorage.clear();
    if (theme) localStorage.setItem('theme', theme);
    navigate('/');
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Profile', path: '/profile', icon: User },
  ];

  return (
    <nav className="glass sticky top-0 z-50 px-6 py-4 flex items-center justify-between transition-all duration-300">
      <div className="flex items-center gap-8">
        <div 
          className="flex items-center gap-3 cursor-pointer group"
          onClick={() => navigate('/')}
        >
          <div className="w-10 h-10 bg-gradient-to-tr from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
            <Edit3 className="text-white w-6 h-6" />
          </div>
          <span className="text-xl font-bold gradient-text tracking-tight">JournalApp</span>
        </div>

        {isLoggedIn && !isLanding && (
          <div className="hidden md:flex items-center gap-1 bg-black/5 dark:bg-white/5 p-1 rounded-2xl border border-black/5 dark:border-white/5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                    isActive 
                      ? 'bg-blue-600 text-white shadow-md' 
                      : 'text-slate-500 hover:text-blue-500 dark:hover:text-blue-400'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.name}
                </button>
              );
            })}
          </div>
        )}
      </div>

      <div className="flex items-center gap-4">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2.5 bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 rounded-xl border border-black/5 dark:border-white/5 text-slate-500 dark:text-slate-400 transition-all hover:scale-110 active:scale-95"
          title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {isDark ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-blue-600" />}
        </button>

        {!isLoggedIn ? (
          <div className="flex items-center gap-3">
             <button
                onClick={() => navigate('/login')}
                className="hidden sm:flex items-center gap-2 px-6 py-2.5 text-sm font-bold text-slate-600 dark:text-slate-300 hover:text-blue-500 transition-all"
             >
                <LogIn className="w-4 h-4" /> Login
             </button>
             <button
                onClick={() => navigate('/signup')}
                className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-black uppercase tracking-widest shadow-lg shadow-blue-500/20 transition-all"
             >
                <UserPlus className="w-4 h-4" /> Join Now
             </button>
          </div>
        ) : (
          <div className="flex items-center gap-4">
             <div className="h-8 w-[1px] bg-black/10 dark:bg-white/10 mx-2 hidden sm:block" />
             <div className="flex items-center gap-3 pl-2">
                <div className="text-right hidden sm:block">
                  <p className="text-xs font-bold text-slate-900 dark:text-white leading-none">{userName || 'User'}</p>
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-1">Free Plan</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-xl border border-red-500/10 transition-all hover:scale-110 active:scale-95"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
             </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
