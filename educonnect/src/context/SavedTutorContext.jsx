import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { toggleSavedTutor, getSavedTutors } from '../services/savedService';
import { useAuth } from './AuthContext';

const SavedTutorContext = createContext();

export function SavedTutorProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const [savedTutors, setSavedTutors] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadSaved = useCallback(async () => {
    if (!isAuthenticated) {
      setSavedTutors([]);
      return;
    }
    setLoading(true);
    try {
      const data = await getSavedTutors();
      setSavedTutors(data);
    } catch {
      setSavedTutors([]);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    loadSaved();
  }, [loadSaved]);

  const toggleSave = async (tutorId, tutorName = 'Tutor') => {
    if (!isAuthenticated) {
      toast.error('Please log in to save tutors');
      return;
    }
    const wasSaved = savedTutors.some((t) => t.id === tutorId);
    try {
      await toggleSavedTutor(tutorId);
      await loadSaved();
      if (wasSaved) toast(`Removed ${tutorName} from saved`, { icon: '💔' });
      else toast.success(`${tutorName} saved!`);
    } catch (err) {
      toast.error(err.message || 'Failed to update saved tutors');
    }
  };

  const isSaved = (tutorId) => savedTutors.some((t) => t.id === tutorId);

  return (
    <SavedTutorContext.Provider value={{ savedTutors, loading, toggleSave, isSaved, refreshSaved: loadSaved }}>
      {children}
    </SavedTutorContext.Provider>
  );
}

export const useSavedTutors = () => useContext(SavedTutorContext);
