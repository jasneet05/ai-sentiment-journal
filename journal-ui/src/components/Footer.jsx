import React from 'react';
import { Edit3, Globe, Mail, ShieldCheck, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="mt-20 border-t border-black/5 dark:border-white/5 bg-[var(--bg-color)]">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-2 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-tr from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Edit3 className="text-white w-6 h-6" />
              </div>
              <span className="text-xl font-bold gradient-text">JournalApp</span>
            </div>
            <p className="text-slate-500 dark:text-slate-400 max-w-sm leading-relaxed">
              Capture your thoughts, track your moods, and discover patterns in your daily life. Your personal journey, visualized and protected.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-widest mb-6">Product</h4>
            <ul className="space-y-4">
              {['Features', 'Analytics', 'Security', 'Themes'].map(item => (
                <li key={item}>
                  <a href="#" className="text-slate-500 dark:text-slate-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors text-sm font-medium">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-widest mb-6">Community</h4>
            <div className="flex gap-4">
              {[Globe, Mail, ShieldCheck].map((Icon, idx) => (
                <a 
                  key={idx} 
                  href="#" 
                  className="p-3 bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 rounded-xl border border-black/5 dark:border-white/5 text-slate-500 dark:text-slate-400 hover:text-blue-500 dark:hover:text-blue-400 transition-all"
                >
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="pt-12 border-t border-black/5 dark:border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-slate-500 dark:text-slate-500 text-sm font-medium">
            © {new Date().getFullYear()} JournalApp. All rights reserved.
          </p>
          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-500 text-sm font-medium">
            <span>Made with</span>
            <Heart className="w-4 h-4 text-red-500 fill-current animate-pulse" />
            <span>by DeepMind</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
