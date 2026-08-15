import { NavLink } from 'react-router-dom';
import { FiHome, FiSearch, FiBookOpen, FiMessageSquare, FiUser } from 'react-icons/fi';

const items = [
  { to: '/student/dashboard', label: 'Home', icon: FiHome },
  { to: '/search', label: 'Search', icon: FiSearch },
  { to: '/bookings', label: 'Lessons', icon: FiBookOpen },
  { to: '/messages', label: 'Inbox', icon: FiMessageSquare },
  { to: '/profile', label: 'Profile', icon: FiUser },
];

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 grid grid-cols-5 border-t border-gray-100 dark:border-slate-800 bg-white dark:bg-[#0B1120] px-1 py-2 max-w-md mx-auto md:hidden">
      {items.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 rounded-lg py-1.5 text-xs font-medium ${
              isActive ? 'text-green-600 dark:text-lime-400 bg-green-50 dark:bg-slate-800' : 'text-gray-400 dark:text-gray-500'
            }`
          }
        >
          <Icon size={19} />
          {label}
        </NavLink>
      ))}
    </nav>
  );
}
