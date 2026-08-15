import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiCalendar, FiClock, FiMessageSquare, FiBookmark } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useBooking } from '../context/BookingContext';
import { useSavedTutors } from '../context/SavedTutorContext';
import Button from '../components/Button';

export default function StudentDashboard() {
  const { user } = useAuth();
  const { bookings, loadBookings } = useBooking();
  const { savedTutors } = useSavedTutors();
  const navigate = useNavigate();

  useEffect(() => { loadBookings(); }, []);

  const savedPreview = savedTutors.slice(0, 2);
  const activeBookings = bookings.filter((b) => b.status === 'confirmed');
  const nextBooking = activeBookings[0];

  return (
    <div className="px-4 md:px-8 pb-6">
      <div className="pt-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Welcome back, <span className="text-green-600 dark:text-lime-400">{user?.name || 'Student'}!</span>
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          You have {activeBookings.length} lesson{activeBookings.length !== 1 ? 's' : ''} scheduled. Ready to learn?
        </p>
      </div>

      <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div onClick={() => navigate('/bookings')} className="cursor-pointer rounded-2xl border border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-800 p-4">
          <div className="flex items-center justify-between">
            <FiCalendar className="text-green-500" size={20} />
            <span className="text-2xl font-bold text-gray-900 dark:text-white">{activeBookings.length}</span>
          </div>
          <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-gray-400">Active Bookings</p>
        </div>

        <div className="rounded-2xl border border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-800 p-4">
          <div className="flex items-center justify-between">
            <FiClock className="text-green-500" size={20} />
            <span className="text-2xl font-bold text-gray-900 dark:text-white">{bookings.length}</span>
          </div>
          <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-gray-400">Total Bookings</p>
        </div>

        {nextBooking ? (
          <div onClick={() => navigate('/bookings')} className="cursor-pointer rounded-2xl gradient-primary p-4 text-white">
            <div className="flex items-center justify-between">
              <span className="rounded-lg bg-white/20 p-2"><FiBookmark /></span>
              <span className="text-xl font-bold">{nextBooking.time}</span>
            </div>
            <p className="mt-2 text-xs font-semibold uppercase tracking-wide opacity-80">Next: {nextBooking.subject}</p>
            <p className="text-sm">{nextBooking.date} • with {nextBooking.tutorName}</p>
          </div>
        ) : (
          <button onClick={() => navigate('/search')} className="rounded-2xl border-2 border-dashed border-gray-200 dark:border-slate-700 p-4 text-sm font-semibold text-green-600 dark:text-lime-400">
            + Book your first lesson
          </button>
        )}
      </div>

      <section className="mt-6">
        <div className="mb-3 flex items-center gap-2">
          <FiBookmark className="text-green-500" />
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Saved Tutors</h2>
        </div>
        <div className="flex flex-col md:grid md:grid-cols-2 gap-3">
          {savedPreview.length === 0 && (
            <p className="text-sm text-gray-400">No saved tutors yet — tap the heart icon on a tutor's profile.</p>
          )}
          {savedPreview.map((t) => (
            <div key={t.id} className="flex items-center gap-3 rounded-2xl border border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-800 p-3">
              <img src={t.image} alt={t.name} className="h-12 w-12 rounded-full object-cover" />
              <div className="flex-1">
                <p className="text-sm font-bold text-gray-900 dark:text-white">{t.name}</p>
                <p className="text-xs text-gray-400">{t.subject}</p>
                <p className="text-xs font-semibold text-gray-600 dark:text-gray-300">★ {t.rating} • ${t.price}/hr</p>
              </div>
              <Button onClick={() => navigate(`/tutor/${t.id}`)} className="!px-3 !py-1.5 text-xs">Book Now</Button>
            </div>
          ))}
          <button onClick={() => navigate('/search')} className="rounded-2xl border-2 border-dashed border-gray-200 dark:border-slate-700 py-3 text-sm font-semibold text-green-600 dark:text-lime-400">
            + Find More Tutors
          </button>
        </div>
      </section>

      <section className="mt-6">
        <div className="mb-3 flex items-center gap-2">
          <FiMessageSquare className="text-green-500" />
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Messages & Notifications</h2>
        </div>
        <div className="flex gap-3">
          <button onClick={() => navigate('/messages')} className="flex-1 rounded-2xl border border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-800 p-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">
            Open Inbox
          </button>
          <button onClick={() => navigate('/notifications')} className="flex-1 rounded-2xl border border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-800 p-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">
            Notifications
          </button>
        </div>
      </section>
    </div>
  );
}
