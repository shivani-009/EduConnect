import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiCalendar, FiMessageSquare, FiDollarSign, FiStar, FiSettings, FiInbox, FiUser } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useBooking } from '../context/BookingContext';

const cards = [
  { icon: FiCalendar, label: 'Bookings', to: '/bookings' },
  { icon: FiMessageSquare, label: 'Messages', to: '/messages' },
  { icon: FiInbox, label: 'Requests', to: '/bookings' },
  { icon: FiStar, label: 'Reviews', to: '/tutor/dashboard' },
  { icon: FiUser, label: 'Profile', to: '/profile' },
  { icon: FiSettings, label: 'Settings', to: '/settings' },
];

export default function TutorDashboard() {
  const { user } = useAuth();
  const { bookings, loadBookings } = useBooking();
  const navigate = useNavigate();

  useEffect(() => { loadBookings(); }, []);

  const activeBookings = bookings.filter((b) => b.status === 'confirmed');

  return (
    <div className="px-4 md:px-8 pb-6">
      <div className="pt-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Welcome, <span className="text-green-600 dark:text-lime-400">{user?.name || 'Tutor'}!</span>
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Here's your teaching overview today.</p>
      </div>

      <div className="mt-5 grid grid-cols-2 md:max-w-md gap-4">
        <div className="rounded-2xl gradient-primary p-4 text-white">
          <FiCalendar size={20} />
          <p className="mt-3 text-2xl font-bold">{activeBookings.length}</p>
          <p className="text-xs opacity-80">Active bookings</p>
        </div>
        <div className="rounded-2xl border border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-800 p-4">
          <FiDollarSign size={20} className="text-green-500" />
          <p className="mt-3 text-2xl font-bold text-gray-900 dark:text-white">{bookings.length}</p>
          <p className="text-xs text-gray-400">Total bookings</p>
        </div>
      </div>

      <h2 className="mt-6 mb-3 text-lg font-bold text-gray-900 dark:text-white">Manage</h2>
      <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
        {cards.map(({ icon: Icon, label, to }) => (
          <button key={label} onClick={() => navigate(to)} className="flex flex-col items-center gap-2 rounded-2xl border border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-800 py-4">
            <Icon className="text-green-500" size={20} />
            <span className="text-xs font-medium text-gray-600 dark:text-gray-300">{label}</span>
          </button>
        ))}
      </div>

      {activeBookings.length > 0 && (
        <section className="mt-6">
          <h2 className="mb-3 text-lg font-bold text-gray-900 dark:text-white">Upcoming Bookings</h2>
          <div className="flex flex-col gap-3">
            {activeBookings.slice(0, 3).map((b) => (
              <div key={b.id} className="rounded-2xl border border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-800 p-4">
                <p className="text-sm font-bold text-gray-900 dark:text-white">{b.subject}</p>
                <p className="text-xs text-gray-400">{b.date} at {b.time}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
