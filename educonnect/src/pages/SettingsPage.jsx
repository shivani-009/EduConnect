import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiMoon, FiBell, FiGlobe, FiLogOut } from 'react-icons/fi';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

export default function SettingsPage() {
  const { theme, toggleTheme } = useTheme();
  const { logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [notifs, setNotifs] = useState(true);
  const [lang, setLang] = useState('English');

  return (
    <div className="px-4 md:px-8 pb-6 pt-4 max-w-2xl mx-auto">
      <h1 className="text-xl font-bold text-gray-900 dark:text-white">Settings</h1>

      <div className="mt-4 flex flex-col divide-y divide-gray-100 dark:divide-slate-800 rounded-2xl border border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-800">
        <Row icon={FiMoon} label="Dark Mode">
          <button onClick={toggleTheme} className={`h-6 w-11 rounded-full ${theme === 'dark' ? 'bg-green-600' : 'bg-gray-300'}`}>
            <span className={`block h-5 w-5 translate-x-0.5 rounded-full bg-white transition-transform ${theme === 'dark' ? 'translate-x-5' : ''}`} />
          </button>
        </Row>
        <Row icon={FiBell} label="Notifications">
          <button onClick={() => setNotifs((v) => !v)} className={`h-6 w-11 rounded-full ${notifs ? 'bg-green-600' : 'bg-gray-300'}`}>
            <span className={`block h-5 w-5 translate-x-0.5 rounded-full bg-white transition-transform ${notifs ? 'translate-x-5' : ''}`} />
          </button>
        </Row>
        <Row icon={FiGlobe} label="Language">
          <select value={lang} onChange={(e) => setLang(e.target.value)} className="rounded-lg bg-gray-50 dark:bg-slate-700 px-2 py-1 text-xs text-gray-700 dark:text-gray-200">
            <option>English</option>
            <option>Hindi</option>
          </select>
        </Row>
      </div>

      {isAuthenticated && (
        <button
          onClick={() => { logout(); navigate('/'); }}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl border border-gray-200 dark:border-slate-700 py-3 text-sm font-semibold text-gray-700 dark:text-gray-200"
        >
          <FiLogOut /> Logout
        </button>
      )}
    </div>
  );
}

function Row({ icon: Icon, label, children }) {
  return (
    <div className="flex items-center justify-between p-4">
      <span className="flex items-center gap-3 text-sm font-medium text-gray-700 dark:text-gray-200"><Icon /> {label}</span>
      {children}
    </div>
  );
}
