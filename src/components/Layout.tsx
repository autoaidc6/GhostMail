import { useEffect, useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Ghost, Sun, Moon } from 'lucide-react';

export default function Layout() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const savedTheme = localStorage.getItem('ghostmail_theme');
    if (savedTheme === 'dark') {
      setTheme('dark');
      document.documentElement.classList.add('dark');
    } else {
      setTheme('light');
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('ghostmail_theme', newTheme);
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans antialiased">
      {/* Navbar */}
      <nav className="p-4 md:p-6 flex items-center justify-between z-10 w-full max-w-5xl mx-auto">
        <Link to="/" className="flex items-center gap-2 group cursor-pointer">
          <div className="p-2 bg-ghost-accent/20 rounded-xl group-hover:bg-ghost-accent/30 transition-colors">
            <Ghost className="w-6 h-6 text-ghost-accent" />
          </div>
          <span className="text-xl font-bold tracking-tight">GhostMail</span>
        </Link>
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-4 text-sm font-medium opacity-80">
             <Link to="/faq" className="hover:text-ghost-accent transition-colors">FAQ</Link>
             <Link to="/contact" className="hover:text-ghost-accent transition-colors">Contact</Link>
          </div>
          <button 
            onClick={toggleTheme}
            className="p-2 glass rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
            aria-label="Toggle theme"
          >
            {theme === 'light' ? <Moon className="w-5 h-5 text-gray-800" /> : <Sun className="w-5 h-5 text-white" />}
          </button>
          <div className="flex items-center gap-2 px-3 py-1.5 glass rounded-full">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse-slow glow-green" />
            <span className="text-[10px] uppercase tracking-widest font-semibold opacity-70">Live Status</span>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex-1 w-full max-w-5xl mx-auto flex flex-col">
         <Outlet />
      </div>

      {/* Footer */}
      <footer className="p-8 mt-12 w-full max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-t border-black/10 dark:border-white/10 pt-8">
          <div className="text-text-muted text-[10px] uppercase tracking-[0.2em] font-bold">
            Powered by GhostMail Infrastructure • NO LOGS • NO SPAM
          </div>
          <div className="flex items-center gap-4 text-xs font-medium text-text-muted">
            <Link to="/privacy" className="hover:text-ghost-accent transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-ghost-accent transition-colors">Terms of Service</Link>
            <Link to="/contact" className="hover:text-ghost-accent transition-colors md:hidden">Contact Us</Link>
            <Link to="/faq" className="hover:text-ghost-accent transition-colors md:hidden">FAQ</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
