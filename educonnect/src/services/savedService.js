import api from './api';
import { normalizeTutor } from '../utils/normalize';

export async function toggleSavedTutor(tutorId) {
  const res = await api.post('/saved/toggle', { tutorId });
  return res.data;
}

export async function getSavedTutors() {
  const res = await api.get('/saved');
  return res.data.map(normalizeTutor);
}
