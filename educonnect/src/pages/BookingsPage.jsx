import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiCalendar, FiClock, FiX } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useBooking } from '../context/BookingContext';
import Button from '../components/Button';

export default function BookingsPage() {
  const { isAuthenticated } = useAuth();
  const { bookings, loadBookings, removeBooking } = useBooking();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) loadBookings();
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
        <FiCalendar size={32} className="text-gray-300" />
        <p className="mt-3 text-sm text-gray-400">Log in to see your bookings.</p>
        <button onClick={() => navigate('/login')} className="mt-3 text-sm font-semibold text-green-600 dark:text-lime-400">Login →</button>
      </div>
    );
  }

  return (
    <div className="px-4 pb-6 pt-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">My Bookings</h1>
        <Button onClick={() => navigate('/search')} className="!px-3 !py-1.5 text-xs">+ New Booking</Button>
      </div>

      <div className="mt-4 flex flex-col md:grid md:grid-cols-2 lg:grid-cols-3 gap-3">
        {bookings.length === 0 && (
          <p className="col-span-full mt-10 text-center text-sm text-gray-400">No bookings yet — find a tutor to get started.</p>
        )}
        {bookings.map((b) => (
          <div key={b.id} className="rounded-2xl border border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-800 p-4">
            <div className="flex items-center gap-3">
              <img src={b.tutorImage} alt={b.tutorName} className="h-12 w-12 rounded-full object-cover" />
              <div className="flex-1">
                <p className="text-sm font-bold text-gray-900 dark:text-white">{b.tutorName}</p>
                <p className="text-xs text-gray-400">{b.subject}</p>
              </div>
              <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase ${b.status === 'confirmed' ? 'bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-lime-400' : 'bg-red-50 dark:bg-red-500/10 text-red-500'}`}>
                {b.status}
              </span>
            </div>
            <div className="mt-3 flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
              <span className="flex items-center gap-1"><FiCalendar size={12} /> {b.date}</span>
              <span className="flex items-center gap-1"><FiClock size={12} /> {b.time}</span>
            </div>
            {b.status === 'confirmed' && (
              <button onClick={() => removeBooking(b.id)} className="mt-3 flex items-center gap-1 text-xs font-semibold text-red-500">
                <FiX size={12} /> Cancel Booking
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
