import { createContext, useContext, useState, useCallback } from 'react';
import { getTutors, getTutorById } from '../services/tutorService';

const TutorContext = createContext();

export function TutorProvider({ children }) {
  const [tutors, setTutors] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchTutors = useCallback(async (filters = {}) => {
    setLoading(true);
    try {
      const data = await getTutors(filters);
      setTutors(data);
      return data;
    } catch {
      setTutors([]);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchTutorById = useCallback((id) => getTutorById(id), []);

  return (
    <TutorContext.Provider value={{ tutors, loading, fetchTutors, fetchTutorById }}>
      {children}
    </TutorContext.Provider>
  );
}

export const useTutors = () => useContext(TutorContext);
