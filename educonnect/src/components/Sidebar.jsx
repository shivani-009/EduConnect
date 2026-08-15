import { AnimatePresence, motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { FiX, FiHome, FiSearch, FiUser, FiSettings, FiHelpCircle, FiPhone, FiInfo, FiLogOut, FiLogIn, FiUserPlus } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

const links = [
  { to: '/', label: 'Home', icon: FiHome },
  { to: '/search', label: 'Search Tutors', icon: FiSearch },
  { to: '/profile', label: 'Profile', icon: FiUser },
  { to: '/settings', label: 'Settings', icon: FiSettings },
  { to: '/about', label: 'About', icon: FiInfo },
  { to: '/contact', label: 'Contact', icon: FiPhone },
  { to: '/faq', label: 'FAQ', icon: FiHelpCircle },
];

export default function Sidebar({ open, onClose }) {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/50"
          />
          <motion.aside
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'tween', duration: 0.25 }}
            className="fixed left-0 top-0 z-50 h-full w-72 bg-white dark:bg-[#0B1120] p-5 shadow-xl"
          >
            <div className="mb-6 flex items-center justify-between">
              <span className="text-lg font-extrabold bg-gradient-to-r from-green-600 to-lime-600 bg-clip-text text-transparent">
                EduConnect
              </span>
              <button onClick={onClose}>
                <FiX size={22} className="text-gray-500 dark:text-gray-300" />
              </button>
            </div>
            <nav className="flex flex-col gap-1">
              {links.map(({ to, label, icon: Icon }) => (
                <Link
                  key={to}
                  to={to}
                  onClick={onClose}
                  className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-green-50 dark:hover:bg-slate-800"
                >
                  <Icon size={18} /> {label}
                </Link>
              ))}
              {isAuthenticated ? (
                <button
                  onClick={() => { logout(); onClose(); navigate('/'); }}
                  className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-slate-800"
                >
                  <FiLogOut size={18} /> Logout
                </button>
              ) : (
                <>
                  <button
                    onClick={() => { onClose(); navigate('/login'); }}
                    className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-green-600 hover:bg-green-50 dark:hover:bg-slate-800"
                  >
                    <FiLogIn size={18} /> Login
                  </button>
                  <button
                    onClick={() => { onClose(); navigate('/register'); }}
                    className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-green-600 hover:bg-green-50 dark:hover:bg-slate-800"
                  >
                    <FiUserPlus size={18} /> Create Account
                  </button>
                </>
              )}
            </nav>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
