import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiBell, FiTrash2, FiCheck } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { getNotifications, markNotificationRead, deleteNotification, clearAllNotifications } from '../services/notificationService';

export default function NotificationsPage() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      setItems(await getNotifications());
    } catch (err) {
      toast.error(err.message || 'Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) load();
    // eslint-disable-next-line
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
        <FiBell size={32} className="text-gray-300" />
        <p className="mt-3 text-sm text-gray-400">Log in to see your notifications.</p>
        <button onClick={() => navigate('/login')} className="mt-3 text-sm font-semibold text-green-600 dark:text-lime-400">Login →</button>
      </div>
    );
  }

  const unread = items.filter((i) => !i.read).length;

  const markRead = async (id) => {
    setItems((prev) => prev.map((i) => (i._id === id ? { ...i, read: true } : i)));
    try {
      await markNotificationRead(id);
    } catch (err) {
      toast.error(err.message || 'Failed to update');
    }
  };

  const remove = async (id) => {
    setItems((prev) => prev.filter((i) => i._id !== id));
    try {
      await deleteNotification(id);
    } catch (err) {
      toast.error(err.message || 'Failed to delete');
    }
  };

  const clearAll = async () => {
    setItems([]);
    try {
      await clearAllNotifications();
      toast('All notifications cleared', { icon: '🧹' });
    } catch (err) {
      toast.error(err.message || 'Failed to clear notifications');
    }
  };

  return (
    <div className="px-4 md:px-8 pb-6 pt-4 max-w-2xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="flex items-center gap-2 text-xl font-bold text-gray-900 dark:text-white">
          <FiBell /> Notifications
          {unread > 0 && <span className="rounded-full bg-red-500 px-2 py-0.5 text-xs font-bold text-white">{unread}</span>}
        </h1>
        {items.length > 0 && (
          <button onClick={clearAll} className="text-xs font-semibold text-green-600 dark:text-lime-400">Clear All</button>
        )}
      </div>

      <div className="mt-4 flex flex-col gap-2">
        {loading && <p className="text-sm text-gray-400">Loading…</p>}
        {!loading && items.length === 0 && <p className="mt-10 text-center text-sm text-gray-400">You're all caught up!</p>}
        {items.map((n) => (
          <div
            key={n._id}
            className={`flex items-center gap-3 rounded-2xl border p-3 ${
              n.read ? 'border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-800' : 'border-green-200 dark:border-green-500/40 bg-green-50 dark:bg-green-500/10'
            }`}
          >
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-800 dark:text-gray-100">{n.title}</p>
              <p className="text-xs text-gray-400">{new Date(n.createdAt).toLocaleString()}</p>
            </div>
            {!n.read && (
              <button onClick={() => markRead(n._id)} className="text-green-500"><FiCheck size={16} /></button>
            )}
            <button onClick={() => remove(n._id)} className="text-gray-400"><FiTrash2 size={16} /></button>
          </div>
        ))}
      </div>
    </div>
  );
}
