import { useNavigate } from 'react-router-dom';
import { FiHeart } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useSavedTutors } from '../context/SavedTutorContext';
import TutorCard from '../components/TutorCard';

export default function SavedPage() {
  const { isAuthenticated } = useAuth();
  const { savedTutors, loading } = useSavedTutors();
  const navigate = useNavigate();

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
        <FiHeart size={32} className="text-gray-300" />
        <p className="mt-3 text-sm text-gray-400">Log in to see your saved tutors.</p>
        <button onClick={() => navigate('/login')} className="mt-3 text-sm font-semibold text-green-600 dark:text-lime-400">Login →</button>
      </div>
    );
  }

  return (
    <div className="px-4 pb-6 pt-4">
      <h1 className="text-xl font-bold text-gray-900 dark:text-white">Saved Tutors</h1>
      <div className="mt-4 flex flex-col md:grid md:grid-cols-2 lg:grid-cols-3 gap-3">
        {loading && <p className="text-sm text-gray-400">Loading…</p>}
        {!loading && savedTutors.length === 0 && (
          <div className="col-span-full mt-10 flex flex-col items-center gap-3 text-center">
            <FiHeart size={32} className="text-gray-300" />
            <p className="text-sm text-gray-400">No saved tutors yet.</p>
            <button onClick={() => navigate('/search')} className="text-sm font-semibold text-green-600 dark:text-lime-400">Browse tutors →</button>
          </div>
        )}
        {savedTutors.map((t) => (
          <TutorCard key={t.id} tutor={t} />
        ))}
      </div>
    </div>
  );
}
