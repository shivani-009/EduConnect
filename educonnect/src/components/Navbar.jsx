import { Link, NavLink, useNavigate } from 'react-router-dom';
import { FiMenu, FiSun, FiMoon, FiBell, FiUser, FiLogOut, FiGrid } from 'react-icons/fi';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useState, useRef, useEffect } from 'react';
import Sidebar from './Sidebar';

const desktopLinks = [
  { to: '/', label: 'Home' },
  { to: '/search', label: 'Find Tutors' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const { user, isAuthenticated, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!menuOpen) return;
    const handleClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [menuOpen]);

  const handleLogout = () => {
    setMenuOpen(false);
    logout();
    navigate('/');
  };

  return (
    <>
      <header className="sticky top-0 z-40 flex items-center justify-between border-b border-gray-100 dark:border-slate-800 bg-white/90 dark:bg-[#0B1120]/90 backdrop-blur px-4 md:px-8 py-3">
        <div className="flex items-center gap-3">
          <button onClick={() => setSidebarOpen(true)} aria-label="Menu" className="md:hidden">
            <FiMenu size={22} className="text-gray-700 dark:text-gray-200" />
          </button>
          <Link to="/" className="text-xl font-extrabold bg-gradient-to-r from-green-600 to-lime-600 bg-clip-text text-transparent">
            EduConnect
          </Link>
        </div>

        <nav className="hidden md:flex items-center gap-6">
          {desktopLinks.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === '/'}
              className={({ isActive }) =>
                `text-sm font-medium ${isActive ? 'text-green-600 dark:text-lime-400' : 'text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-lime-400'}`
              }
            >
              {l.label}
            </NavLink>
          ))}
          {isAuthenticated && (
            <NavLink
              to={user?.role === 'tutor' ? '/tutor/dashboard' : '/student/dashboard'}
              className={({ isActive }) =>
                `text-sm font-medium ${isActive ? 'text-green-600 dark:text-lime-400' : 'text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-lime-400'}`
              }
            >
              Dashboard
            </NavLink>
          )}
        </nav>

        <div className="flex items-center gap-3 md:gap-4">
          <button onClick={toggleTheme} aria-label="Toggle theme">
            {theme === 'dark' ? (
              <FiSun size={20} className="text-gray-200" />
            ) : (
              <FiMoon size={20} className="text-gray-700" />
            )}
          </button>
          {isAuthenticated && (
            <button onClick={() => navigate('/notifications')} className="relative" aria-label="Notifications">
              <FiBell size={20} className="text-gray-700 dark:text-gray-200" />
              <span className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-red-500" />
            </button>
          )}
          {isAuthenticated ? (
            <div className="relative" ref={menuRef}>
              <button onClick={() => setMenuOpen((v) => !v)} aria-label="Account menu">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="h-8 w-8 rounded-full object-cover cursor-pointer border border-gray-200 dark:border-slate-700"
                />
              </button>
              {menuOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-xl border border-gray-100 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-lg py-1 z-50">
                  <p className="px-4 py-2 text-xs text-gray-400 truncate border-b border-gray-100 dark:border-slate-700">{user.email}</p>
                  <button
                    onClick={() => { setMenuOpen(false); navigate('/profile'); }}
                    className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-green-50 dark:hover:bg-slate-700"
                  >
                    <FiUser size={16} /> Profile
                  </button>
                  <button
                    onClick={() => { setMenuOpen(false); navigate(user.role === 'tutor' ? '/tutor/dashboard' : '/student/dashboard'); }}
                    className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-green-50 dark:hover:bg-slate-700"
                  >
                    <FiGrid size={16} /> Dashboard
                  </button>
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-slate-700"
                  >
                    <FiLogOut size={16} /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate('/login')}
                className="text-sm font-semibold text-gray-700 dark:text-gray-200 hover:text-green-600 dark:hover:text-lime-400"
              >
                Login
              </button>
              <button
                onClick={() => navigate('/register')}
                className="rounded-lg gradient-primary px-3 py-1.5 md:px-4 md:py-2 text-sm font-semibold text-white"
              >
                Sign Up
              </button>
            </div>
          )}
        </div>
      </header>
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
    </>
  );
}
