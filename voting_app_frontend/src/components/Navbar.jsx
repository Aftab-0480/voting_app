import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon, Vote, LogOut, User, BarChart3, Shield, Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { dark, toggle } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setMobileOpen(false);
  };

  const navLinks = user
    ? [
        { to: '/', label: 'Candidates', icon: Vote },
        { to: '/results', label: 'Results', icon: BarChart3 },
        { to: '/profile', label: 'Profile', icon: User },
        ...(user.role === 'admin' ? [{ to: '/admin', label: 'Admin', icon: Shield }] : []),
      ]
    : [
        { to: '/results', label: 'Results', icon: BarChart3 },
      ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 bg-white/80 dark:bg-ink-900/80 backdrop-blur-md border-b border-paper-200 dark:border-ink-700">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-vote-500 flex items-center justify-center group-hover:bg-vote-600 transition-colors">
              <Vote size={16} className="text-white" />
            </div>
            <span className="font-display font-700 text-lg text-ink-900 dark:text-paper-50">
              CastVote
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive(to)
                    ? 'bg-vote-500 text-white'
                    : 'text-ink-600 dark:text-paper-200 hover:bg-paper-100 dark:hover:bg-ink-700'
                }`}
              >
                <Icon size={15} />
                {label}
              </Link>
            ))}
          </div>

          {/* Right controls */}
          <div className="flex items-center gap-2">
            {/* Theme toggle */}
            <button
              onClick={toggle}
              className="p-2 rounded-lg text-ink-500 hover:text-ink-900 dark:text-paper-200 dark:hover:text-paper-50 hover:bg-paper-100 dark:hover:bg-ink-700 transition-all duration-200"
              aria-label="Toggle theme"
            >
              {dark ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {/* Auth buttons */}
            {user ? (
              <>
                <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-paper-100 dark:bg-ink-700">
                  <div className="w-6 h-6 rounded-full bg-vote-500 flex items-center justify-center">
                    <span className="text-white text-xs font-bold">{user.name?.[0]?.toUpperCase()}</span>
                  </div>
                  <span className="text-sm font-medium text-ink-900 dark:text-paper-50">{user.name}</span>
                  {user.role === 'admin' && (
                    <span className="text-xs bg-accent-500 text-white px-1.5 py-0.5 rounded font-semibold">ADMIN</span>
                  )}
                </div>
                <button
                  onClick={handleLogout}
                  className="hidden md:flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200"
                >
                  <LogOut size={15} />
                  Logout
                </button>
              </>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link to="/login" className="btn-secondary text-sm py-2 px-4">Log in</Link>
                <Link to="/signup" className="btn-primary text-sm py-2 px-4">Sign up</Link>
              </div>
            )}

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen((o) => !o)}
              className="md:hidden p-2 rounded-lg text-ink-600 dark:text-paper-200 hover:bg-paper-100 dark:hover:bg-ink-700 transition-colors"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-paper-200 dark:border-ink-700 bg-white dark:bg-ink-900 px-4 py-3 space-y-1">
          {navLinks.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive(to)
                  ? 'bg-vote-500 text-white'
                  : 'text-ink-700 dark:text-paper-100 hover:bg-paper-100 dark:hover:bg-ink-700'
              }`}
            >
              <Icon size={16} />
              {label}
            </Link>
          ))}
          {user ? (
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            >
              <LogOut size={16} />
              Logout
            </button>
          ) : (
            <div className="flex gap-2 pt-2">
              <Link to="/login" onClick={() => setMobileOpen(false)} className="btn-secondary flex-1 text-center text-sm py-2">Log in</Link>
              <Link to="/signup" onClick={() => setMobileOpen(false)} className="btn-primary flex-1 text-center text-sm py-2">Sign up</Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}